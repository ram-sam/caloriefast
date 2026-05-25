-- ============================================
-- CALORIEFAST - SUPABASE DATABASE SETUP
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Settings > SQL Editor > New Query > Cole e Execute

-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- TABELAS
-- ============================================

-- Tabela de metas calóricas
create table goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  daily_calories integer not null check (daily_calories >= 500 and daily_calories <= 10000),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id) -- Um usuário só pode ter uma meta ativa
);

-- Tabela de refeições
create table meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  date timestamp with time zone not null,
  description text not null check (char_length(description) <= 200),
  calories integer not null check (calories >= 1 and calories <= 10000),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'snack', 'dinner', 'supper')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de jejuns
create table fasts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  planned_type text not null check (planned_type in ('16:8', '18:6', '20:4', '24h', 'custom')),
  planned_hours integer check (planned_hours >= 1 and planned_hours <= 48),
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
alter table goals enable row level security;
alter table meals enable row level security;
alter table fasts enable row level security;

-- ============================================
-- POLICIES - GOALS
-- ============================================

create policy "Users can view their own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on goals for delete
  using (auth.uid() = user_id);

-- ============================================
-- POLICIES - MEALS
-- ============================================

create policy "Users can view their own meals"
  on meals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own meals"
  on meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meals"
  on meals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meals"
  on meals for delete
  using (auth.uid() = user_id);

-- ============================================
-- POLICIES - FASTS
-- ============================================

create policy "Users can view their own fasts"
  on fasts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own fasts"
  on fasts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own fasts"
  on fasts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own fasts"
  on fasts for delete
  using (auth.uid() = user_id);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Otimizar queries de refeições por usuário e data
create index meals_user_date_idx on meals(user_id, date desc);

-- Otimizar queries de jejuns por usuário e data de início
create index fasts_user_start_idx on fasts(user_id, start_time desc);

-- Otimizar queries de jejuns ativos (sem end_time)
create index fasts_active_idx on fasts(user_id, end_time) where end_time is null;

-- Otimizar queries de metas por usuário
create index goals_user_idx on goals(user_id);

-- ============================================
-- FUNÇÕES E TRIGGERS (OPCIONAL)
-- ============================================

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger para goals
create trigger update_goals_updated_at
  before update on goals
  for each row
  execute function update_updated_at_column();

-- Trigger para meals
create trigger update_meals_updated_at
  before update on meals
  for each row
  execute function update_updated_at_column();

-- ============================================
-- DADOS DE TESTE (OPCIONAL - REMOVER EM PRODUÇÃO)
-- ============================================

-- Descomente abaixo para inserir dados de exemplo
-- IMPORTANTE: Substitua 'YOUR_USER_ID' pelo seu UUID de usuário real

/*
-- Inserir meta de exemplo
insert into goals (user_id, daily_calories)
values ('YOUR_USER_ID', 2000);

-- Inserir refeições de exemplo
insert into meals (user_id, date, description, calories, meal_type)
values 
  ('YOUR_USER_ID', now(), 'Café com pão integral', 350, 'breakfast'),
  ('YOUR_USER_ID', now(), 'Arroz, feijão, frango e salada', 650, 'lunch'),
  ('YOUR_USER_ID', now(), 'Banana e aveia', 200, 'snack');

-- Inserir jejum de exemplo (concluído)
insert into fasts (user_id, start_time, end_time, planned_type, planned_hours)
values 
  ('YOUR_USER_ID', now() - interval '18 hours', now() - interval '2 hours', '16:8', 16);
*/

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar se as tabelas foram criadas
select table_name 
from information_schema.tables 
where table_schema = 'public' 
  and table_name in ('goals', 'meals', 'fasts');

-- Verificar se RLS está habilitado
select tablename, rowsecurity 
from pg_tables 
where schemaname = 'public' 
  and tablename in ('goals', 'meals', 'fasts');

-- Verificar policies criadas
select schemaname, tablename, policyname 
from pg_policies 
where tablename in ('goals', 'meals', 'fasts');

-- ============================================
-- FIM DO SETUP
-- ============================================
-- Se tudo rodou sem erros, seu banco está pronto! 🎉
