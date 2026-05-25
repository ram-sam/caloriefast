# 🚀 Guia de Deploy - CalorieFast

## Pré-requisitos

- Conta no GitHub
- Conta no Supabase (gratuita)
- Conta na Vercel (gratuita)

---

## 📝 Passo a Passo Completo

### 1. Setup do Supabase (5 minutos)

1. **Criar projeto**
   - Acesse [supabase.com](https://supabase.com)
   - Click em "New Project"
   - Nome: `caloriefast`
   - Database Password: escolha uma senha forte
   - Region: `South America (São Paulo)` (ou mais próxima)
   - Aguarde ~2 minutos para o projeto ser provisionado

2. **Executar SQL**
   - No dashboard do Supabase, vá em **SQL Editor** (menu lateral)
   - Click em "New Query"
   - Copie TODO o conteúdo do arquivo `supabase-setup.sql`
   - Cole no editor e click em **RUN**
   - Verifique se apareceu "Success. No rows returned"

3. **Copiar credenciais**
   - Vá em **Settings** > **API**
   - Copie e salve em algum lugar:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJhbGc...` (chave longa)

### 2. Setup do GitHub (3 minutos)

1. **Criar repositório**
   ```bash
   cd caloriefast
   git init
   git add .
   git commit -m "Initial commit: CalorieFast app"
   ```

2. **Criar repositório no GitHub**
   - Acesse [github.com/new](https://github.com/new)
   - Nome: `caloriefast`
   - Público ou Privado (sua escolha)
   - **NÃO** marque nenhuma opção (README, .gitignore, etc)
   - Click em "Create repository"

3. **Push do código**
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/caloriefast.git
   git branch -M main
   git push -u origin main
   ```

### 3. Deploy na Vercel (2 minutos)

1. **Importar projeto**
   - Acesse [vercel.com](https://vercel.com)
   - Click em "Add New..." > "Project"
   - Import do seu repositório GitHub `caloriefast`

2. **Configurar variáveis de ambiente**
   - Na tela de import, abra "Environment Variables"
   - Adicione:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
     ```
   - (Use as credenciais que você copiou do Supabase)

3. **Deploy**
   - Click em "Deploy"
   - Aguarde ~2 minutos
   - Pronto! 🎉

### 4. Testar a aplicação

1. **Acessar URL**
   - A Vercel mostrará uma URL tipo: `https://caloriefast.vercel.app`
   - Click para abrir

2. **Criar conta de teste**
   - Click em "Criar Conta"
   - Use um email real (para receber confirmação se configurado)
   - Senha: mínimo 6 caracteres

3. **Testar funcionalidades**
   - ✅ Definir meta calórica
   - ✅ Adicionar refeições
   - ✅ Iniciar jejum
   - ✅ Ver gráficos

---

## 🔧 Troubleshooting

### Erro: "Invalid API credentials"
- Verifique se copiou as credenciais corretas do Supabase
- Certifique-se de usar a **anon public** key, não a service_role

### Erro: "No rows returned" ao fazer login
- Execute o SQL novamente no Supabase
- Verifique se as tabelas foram criadas: `select * from information_schema.tables where table_schema = 'public';`

### Erro 500 na Vercel
- Vá em "Deployments" > Click no deploy > "View Function Logs"
- Procure por erros de conexão com Supabase

### Dados não aparecem no dashboard
- Abra o console do navegador (F12)
- Verifique erros de CORS ou autenticação
- Confirme que as RLS policies foram criadas corretamente

---

## 🎬 Próximos Passos

### Configurar domínio customizado (Opcional)
1. Na Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Habilitar email confirmation no Supabase (Opcional)
1. Supabase > Authentication > Email Templates
2. Configure templates de confirmação
3. Settings > Auth > Email Auth > Enable "Confirm email"

### Adicionar Analytics (Opcional)
1. Instale: `npm install @vercel/analytics`
2. Adicione ao layout:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

---

## 📊 Monitoramento

### Vercel Dashboard
- Acesse logs em tempo real
- Veja métricas de performance
- Configure alertas

### Supabase Dashboard
- Monitore uso do banco de dados
- Veja queries em tempo real
- Configure backups automáticos

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

A Vercel fará o deploy automaticamente! 🚀

---

## ✅ Checklist Final

Antes de entregar o trabalho, verifique:

- [ ] Aplicação acessível via URL pública
- [ ] Cadastro de usuário funcionando
- [ ] Login/logout funcionando
- [ ] CRUD de refeições completo
- [ ] Meta calórica funcionando
- [ ] Controle de jejum funcionando
- [ ] Gráficos semanais exibindo dados
- [ ] Modo escuro funcionando (bônus)
- [ ] Responsivo em mobile
- [ ] README.md completo
- [ ] Histórico de commits no GitHub
- [ ] Vídeo demonstrativo gravado

---

## 🎥 Gravando o Vídeo Demonstrativo

Sugestão de roteiro (3-5 minutos):

1. **Introdução** (30s)
   - Mostrar landing page
   - Explicar o propósito do app

2. **Cadastro e Login** (30s)
   - Criar conta
   - Fazer login

3. **Funcionalidades Principais** (2-3min)
   - Definir meta calórica
   - Adicionar 2-3 refeições
   - Editar uma refeição
   - Excluir uma refeição
   - Iniciar jejum
   - Mostrar timer rodando
   - Encerrar jejum
   - Mostrar gráficos semanais

4. **Recursos Extras** (30s)
   - Alternar modo claro/escuro
   - Mostrar responsividade (redimensionar janela)

5. **Encerramento** (30s)
   - Resumir tecnologias usadas
   - Agradecer

**Ferramentas de gravação**:
- [Loom](https://loom.com) (gratuito, fácil)
- OBS Studio (gratuito, mais controle)
- Screen recording nativo (Windows: Win+G, Mac: Cmd+Shift+5)

---

## 💡 Dicas Finais

- Teste em modo anônimo do navegador para simular novo usuário
- Teste em diferentes dispositivos (desktop, tablet, mobile)
- Leia os logs de erro se algo não funcionar
- Use o Discord/Slack da turma se precisar de ajuda

**Boa sorte! 🍀**
