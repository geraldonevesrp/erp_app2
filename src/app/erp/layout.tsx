"use client"

import { AppLayout } from '@/components/layout/app-layout'

const menuItems = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Home',
        href: '/erp/dashboard'
      },
      {
        name: 'Vendas',
        href: '/erp/dashboard/vendas'
      }
    ]
  },
  {
    title: 'Cadastros',
    items: [
      {
        name: 'Pessoas',
        href: '/erp/cadastros/pessoas'
      },
      {
        name: 'Grupo de Pessoas',
        href: '/erp/cadastros/grupos'
      },
      {
        name: 'Empresas',
        href: '/erp/cadastros/empresas'
      }
    ]
  },
  {
    title: 'Estoque',
    items: [
      {
        name: 'Categorias',
        href: '/erp/estoque/categorias'
      },
      {
        name: 'Produtos',
        href: '/erp/estoque/produtos'
      },
      {
        name: 'Tabela de Preços',
        href: '/erp/estoque/precos'
      },
      {
        name: 'Depósitos',
        href: '/erp/estoque/depositos'
      },
      {
        name: 'Compras',
        href: '/erp/estoque/compras'
      }
    ]
  },
  {
    title: 'Vendas',
    items: [
      {
        name: 'Orçamentos',
        href: '/erp/vendas/orcamentos'
      },
      {
        name: 'Pedidos',
        href: '/erp/vendas/pedidos'
      }
    ]
  },
  {
    title: 'OS',
    items: [
      {
        name: 'OS Equipamentos',
        href: '/erp/os/equipamentos'
      },
      {
        name: 'OS Veículos',
        href: '/erp/os/veiculos'
      },
      {
        name: 'OS Serviços Gerais',
        href: '/erp/os/servicos'
      }
    ]
  },
  {
    title: 'Fiscal',
    items: [
      {
        name: 'NF-e',
        href: '/erp/fiscal/nfe'
      },
      {
        name: 'NFC-e',
        href: '/erp/fiscal/nfce'
      },
      {
        name: 'NFS-e',
        href: '/erp/fiscal/nfse'
      }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      {
        name: 'Contas a Receber',
        href: '/erp/financeiro/receber'
      },
      {
        name: 'Contas a Pagar',
        href: '/erp/financeiro/pagar'
      },
      {
        name: 'Fluxo de Caixa',
        href: '/erp/financeiro/fluxo'
      },
      {
        name: 'Relatórios',
        href: '/erp/financeiro/relatorios'
      }
    ]
  },
  {
    title: 'Configurações',
    items: [
      {
        name: 'Tema',
        href: '/erp/configuracoes/tema'
      }
    ]
  }
]

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout menuItems={menuItems}>{children}</AppLayout>
}
