"use client"

import { ErpLayout } from '@/components/erp/layout/erp-layout'

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
        href: '/erp/dashboard/vendas',
        disabled: true
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
        href: '/erp/cadastros/grupos',
        disabled: true
      },
      {
        name: 'Empresas',
        href: '/erp/cadastros/empresas',
        disabled: true
      }
    ]
  },
  {
    title: 'Estoque',
    items: [
      {
        name: 'Categorias',
        href: '/erp/estoque/categorias',
        disabled: true
      },
      {
        name: 'Produtos',
        href: '/erp/estoque/produtos',
        disabled: true
      },
      {
        name: 'Tabela de Preços',
        href: '/erp/estoque/precos',
        disabled: true
      },
      {
        name: 'Depósitos',
        href: '/erp/estoque/depositos',
        disabled: true
      },
      {
        name: 'Compras',
        href: '/erp/estoque/compras',
        disabled: true
      }
    ]
  },
  {
    title: 'Vendas',
    items: [
      {
        name: 'Orçamentos',
        href: '/erp/vendas/orcamentos',
        disabled: true
      },
      {
        name: 'Pedidos',
        href: '/erp/vendas/pedidos',
        disabled: true
      }
    ]
  },
  {
    title: 'OS',
    items: [
      {
        name: 'OS Equipamentos',
        href: '/erp/os/equipamentos',
        disabled: true
      },
      {
        name: 'OS Veículos',
        href: '/erp/os/veiculos',
        disabled: true
      },
      {
        name: 'OS Serviços Gerais',
        href: '/erp/os/servicos',
        disabled: true
      }
    ]
  },
  {
    title: 'Fiscal',
    items: [
      {
        name: 'NF-e',
        href: '/erp/fiscal/nfe',
        disabled: true
      },
      {
        name: 'NFC-e',
        href: '/erp/fiscal/nfce',
        disabled: true
      },
      {
        name: 'NFS-e',
        href: '/erp/fiscal/nfse',
        disabled: true
      }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      {
        name: 'Contas a Receber',
        href: '/erp/financeiro/receber',
        disabled: true
      },
      {
        name: 'Contas a Pagar',
        href: '/erp/financeiro/pagar',
        disabled: true
      },
      {
        name: 'Fluxo de Caixa',
        href: '/erp/financeiro/fluxo',
        disabled: true
      },
      {
        name: 'Relatórios',
        href: '/erp/financeiro/relatorios',
        disabled: true
      }
    ]
  },
  {
    title: 'Configurações',
    items: [
      {
        name: 'Tema',
        href: '/erp/configuracoes/tema',
        disabled: true
      }
    ]
  }
]

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErpLayout menuItems={menuItems}>{children}</ErpLayout>
}
