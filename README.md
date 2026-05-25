# CalorieFast 🥗⏱️

Sistema de registro de calorias e jejum intermitente desenvolvido com Next.js 14, TypeScript e Supabase.

![CalorieFast](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📋 Descrição

CalorieFast é uma aplicação web full-stack para acompanhamento de consumo calórico e jejum intermitente. Permite que usuários registrem refeições, definam metas diárias, controlem ciclos de jejum e visualizem seu progresso através de gráficos semanais.

⚠️ **Aviso**: Esta aplicação é apenas para fins educacionais e não substitui orientação médica ou nutricional profissional.

## ✨ Funcionalidades

### ✅ Implementadas

- **Autenticação Completa**
  - Cadastro com email e senha
  - Login e logout
  - Rotas protegidas
  - Dados isolados por usuário

- **Registro de Calorias (CRUD)**
  - Criar refeições com data/hora, descrição, calorias e tipo
  - Listar e filtrar por data
  - Editar registros existentes
  - Excluir com confirmação

- **Meta Calórica**
  - Definir meta diária de calorias
  - Editar meta a qualquer momento
  - Visualização de progresso com barra

- **Controle de Jejum**
  - Iniciar e encerrar jejum
  - Tipos: 16:8, 18:6, 20:4, 24h ou personalizado
  - Timer em tempo real
  - Apenas um jejum ativo por vez

- **Resumo Semanal**
  - Gráfico de calorias dos últimos 7 dias
  - Gráfico de horas de jejum por dia
  - Estatísticas: média de calorias, total de jejuns, tempo médio

- **Bônus Implementados** ✨
  - 🌓 Modo escuro funcional
  - 📱 PWA instalável
  - 📊 Gráficos interativos com Recharts

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **Validação**: Zod
- **Deploy**: Vercel

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuito)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/caloriefast.git
cd caloriefast
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL abaixo no SQL Editor do Supabase:

```sql
-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- Tabela de metas
create table goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  daily_calories integer not null check (daily_calories >= 500 and daily_calories <= 10000),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
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

-- RLS (Row Level Security) Policies

-- Goals
alter table goals enable row level security;

create policy "Users can view their own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on goals for update
  using (auth.uid() = user_id);

-- Meals
alter table meals enable row level security;

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

-- Fasts
alter table fasts enable row level security;

create policy "Users can view their own fasts"
  on fasts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own fasts"
  on fasts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own fasts"
  on fasts for update
  using (auth.uid() = user_id);

-- Índices para performance
create index meals_user_date_idx on meals(user_id, date desc);
create index fasts_user_start_idx on fasts(user_id, start_time desc);
create index goals_user_idx on goals(user_id);
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

**Onde encontrar as chaves**:
- Vá em Settings > API no dashboard do Supabase
- Copie a "Project URL" e a "anon public" key

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🌐 Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy!

## 📸 Screenshots

### Landing Page
![Landing](./docs/landing.png)

### Dashboard
![Dashboard](./docs/dashboard.png)

### Gráficos Semanais
![Charts](./docs/charts.png)

## 🏗️ Estrutura do Projeto

```
caloriefast/
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── auth/           # Páginas de autenticação
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── globals.css     # Estilos globais
│   │   ├── layout.tsx      # Layout raiz
│   │   └── page.tsx        # Landing page
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI (shadcn)
│   │   ├── meal-dialog.tsx
│   │   ├── meal-list.tsx
│   │   ├── goal-setting.tsx
│   │   ├── fasting-control.tsx
│   │   └── weekly-charts.tsx
│   ├── lib/                # Utilitários
│   │   ├── supabase/      # Clientes Supabase
│   │   ├── utils.ts       # Funções helper
│   │   └── validations.ts # Schemas Zod
│   └── types/             # TypeScript types
│       ├── database.types.ts
│       └── index.ts
├── public/                # Arquivos estáticos
├── middleware.ts          # Middleware de auth
├── tailwind.config.ts    # Config Tailwind
├── package.json
└── README.md
```

## 🗃️ Modelagem do Banco de Dados

### Tabelas

**goals** - Metas calóricas dos usuários
- `id`: UUID (PK)
- `user_id`: UUID (FK -> auth.users)
- `daily_calories`: INTEGER
- `created_at`, `updated_at`: TIMESTAMP

**meals** - Registros de refeições
- `id`: UUID (PK)
- `user_id`: UUID (FK -> auth.users)
- `date`: TIMESTAMP
- `description`: TEXT
- `calories`: INTEGER
- `meal_type`: TEXT (breakfast|lunch|snack|dinner|supper)
- `created_at`, `updated_at`: TIMESTAMP

**fasts** - Registros de jejum
- `id`: UUID (PK)
- `user_id`: UUID (FK -> auth.users)
- `start_time`: TIMESTAMP
- `end_time`: TIMESTAMP (nullable)
- `planned_type`: TEXT (16:8|18:6|20:4|24h|custom)
- `planned_hours`: INTEGER (nullable)
- `created_at`: TIMESTAMP

## 🔒 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Cada usuário só acessa seus próprios dados
- Validação client-side e server-side com Zod
- Rotas protegidas com middleware
- Variáveis de ambiente para chaves sensíveis

## 🎨 UI/UX

- Design responsivo (mobile-first)
- Modo escuro funcional
- Feedback visual para todas as ações
- Estados de loading e erro tratados
- Componentes acessíveis (shadcn/ui)

## 📊 Recursos Adicionais

- **PWA**: Instalável como app nativo
- **Gráficos Interativos**: Visualização clara do progresso
- **Real-time**: Timer de jejum atualiza automaticamente
- **Tema Adaptativo**: Modo claro/escuro

## 🤝 Contribuindo

Este é um projeto acadêmico, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é para fins educacionais. MIT License.

## 👤 Autor

Samantha - [@ramsam](https://github.com/ram-sam/)

## 🙏 Agradecimentos

- [Anthropic](https://anthropic.com) - Claude AI
- [Vercel](https://vercel.com) - Next.js e hospedagem
- [Firebase](https://console.firebase.google.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
