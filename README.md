📖 State Of The Art — Documento de Apresentação
🌐 O que é o State Of The Art?

# State Of The Art 🏆

O State Of The Art é uma plataforma comunitária para desenvolvedores discutirem, votarem e acompanharem quais tecnologias, ferramentas e implementações representam o estado da arte em diferentes áreas da programação.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm ou pnpm

### Setup

1. **Clone o repositório**

```bash
git clone <repo-url>
cd stateofart
```

2. **Instalar dependências**

```bash
npm install
```

3. **Configurar variáveis de ambiente**

```bash
# Copie o template de exemplo
cp .env.example .env.local

# Edite .env.local com suas chaves reais
# - Crie conta no Clerk (https://clerk.com)
# - Adicione suas chaves CLERK_SECRET_KEY e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

4. **Setup do banco de dados**

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Popular com dados de exemplo
npm run db:seed
```

5. **Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

Acesse http://localhost:3000

### 📁 Estrutura de Arquivos de Ambiente

- `.env.example` - Template commitado no git com todas as variáveis necessárias
- `.env.local` - Suas configurações locais (NÃO commitado)

## 🛠️ Comandos Úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificar código com Biome
npm run format       # Formatar código

# Database
npx prisma studio    # Interface visual do banco
npm run db:seed      # Popular com dados exemplo
npx prisma generate  # Gerar cliente após mudanças no schema
```

A ideia é simples: para cada problema técnico (ex: auth, fetch, IDE, ORM, CI/CD), a comunidade pode cadastrar alternativas, debater prós e contras, votar e comentar.
Com base nesses votos e interações, a plataforma gera um ranking dinâmico, mostrando qual implementação é o atual State Of Art para aquele tópico.

🎯 Objetivo

Criar um espaço único para acompanhar tendências e melhores práticas de programação.

Oferecer transparência e clareza: qual tecnologia está sendo mais usada/recomendada hoje.

Ajudar devs e equipes a tomarem decisões técnicas mais embasadas.

🔑 Funcionalidades do MVP

Categorias técnicas → exemplos: Auth, Fetch, ORM, IDE, Testes, CI/CD.

Implementações por categoria → ex: Auth → JWT, Clerk, Auth0, NextAuth.

Votação → usuários podem votar em suas implementações favoritas.

Comentários → discussão com prós/contras, experiências reais, exemplos de código.

Ranking dinâmico → a implementação mais votada ganha o selo State Of Art.

Autenticação de usuários → via GitHub/Google (Clerk).

⚙️ Tecnologias Utilizadas

O projeto será desenvolvido com uma stack moderna, que permite rapidez no MVP e escalabilidade no futuro:

Next.js (App Router) → framework React para frontend e backend (server components + server actions).

Prisma → ORM para modelagem e acesso ao banco de dados.

Banco de Dados Local (SQLite no MVP) → simples de rodar localmente, fácil de migrar para Postgres em produção.

Clerk → autenticação de usuários (GitHub/Google), gerenciamento de sessões e perfis.

TanStack Query → gerenciamento de dados no cliente (fetch + cache automático).

Server Actions → mutações diretas no backend sem necessidade de REST/GraphQL no MVP.

nuqs (Query String State) → sincronização de estado com query params, se necessário em filtros e buscas.

TailwindCSS → estilização rápida e responsiva.

🛠️ Como funciona na prática

O usuário faz login via Clerk.

Escolhe uma categoria (ex: ORM).

Vê as implementações cadastradas (Prisma, Drizzle, TypeORM, etc).

Pode votar em uma implementação (server action → banco via Prisma).

Pode comentar trazendo prós/contras, experiências de uso, exemplos.

A implementação mais votada aparece como State Of Art atual daquela categoria.

📌 Resumindo

O State Of Art é um guia vivo, feito pela comunidade, que mostra o que está em alta na programação hoje.
Com uma base técnica sólida (Next.js, Prisma, Clerk, TanStack Query), o projeto nasce moderno, escalável e pronto para evoluir.
