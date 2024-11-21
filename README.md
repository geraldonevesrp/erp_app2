# ErpApp2 - Sistema ERP White Label

Sistema ERP moderno e personalizável com módulos para gestão empresarial e área de revendedores.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Next Themes (Tema claro/escuro)
- Supabase (Banco de dados e autenticação)
- Recharts (Gráficos)
- Framer Motion (Animações)

## Estrutura do Projeto

- `/src/app/erp` - Módulo ERP com gestão de pessoas e produtos
- `/src/app/revendedores` - Módulo de Revendedores com gestão de licenças e financeiro
- `/src/components` - Componentes reutilizáveis
- `/src/components/layout` - Componentes de layout (AppLayout)
- `banco_supabase.txt` - Estrutura completa do banco de dados

## Banco de Dados

A estrutura completa do banco de dados está documentada no arquivo `banco_supabase.txt`. Este arquivo contém:
- Lista de todas as tabelas e views
- Estrutura de cada tabela (colunas, tipos, constraints)
- Relacionamentos e chaves
- Views e suas definições

Consulte este arquivo ao implementar novas funcionalidades para garantir consistência com o banco de dados.

## Como Instalar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Como Executar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Módulos

### ERP
- Dashboard com gráficos e métricas
- Gestão de Pessoas
- Gestão de Produtos
- Vendas e Pedidos
- Estoque
- Fiscal
- Financeiro
- OS (Ordens de Serviço)

### Revendedores
- Dashboard
- Gestão de Licenças
- Financeiro (A Receber e Vencidas)

## Funcionalidades

- Layout responsivo
- Tema claro/escuro
- Menu lateral retrátil
- Gráficos interativos
- Autenticação com Supabase
- Animações suaves
- Notificações
- Perfil de usuário
