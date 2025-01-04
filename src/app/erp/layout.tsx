"use client"

import { ErpLayout } from '@/components/erp/layout/erp-layout'
import { HeaderProvider } from '@/contexts/header-context'

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
        href: '/erp/pessoas'
      },
      {
        name: 'Pessoas Grupos',
        href: '/erp/pessoas/grupos'
      },
      {
        name: 'Empresas',
        href: '/erp/empresas'
      },
      {
        name: 'Depósitos',
        href: '/erp/depositos'
      },
    ]
  },
  {
    title: 'Estoque',
    items: [
      {
        name: 'Produtos',
        href: '/erp/produtos'
      },
      {
        name: 'Produtos Categorias',
        href: '/erp/produtos/categorias'
      },
      {
        name: 'Movimentações',
        href: '/erp/movimentacoes',
        disabled: true
      },
      {
        name: 'Inventário',
        href: '/erp/inventario',
        disabled: true
      }
    ]
  },
  {
    title: 'Fiscal',
    items: [
      {
        name: 'Emissão de NFe',
        href: '/erp/nfe_edit'
      },
      {
        name: 'Notas Fiscais',
        href: '/erp/nfe_list'
      },
    ]
  },
  {
    title: 'Comercial',
    items: [
      {
        name: 'Tabelas de Preços',
        href: '/erp/tabelas-precos'
      },
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
        name: 'Bancos',
        href: '/erp/financeiro/bancos',
        disabled: true
      }
    ]
  },
  {
    title: 'Configurações',
    items: [
      {
        name: 'Perfil',
        href: '/erp/configuracoes/perfil',
        disabled: true
      },
      {
        name: 'Usuários',
        href: '/erp/configuracoes/usuarios',
        disabled: true
      },
      {
        name: 'Permissões',
        href: '/erp/configuracoes/permissoes',
        disabled: true
      }
    ]
  }
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HeaderProvider>
      <ErpLayout menuItems={menuItems}>
        {children}
      </ErpLayout>
    </HeaderProvider>
  )
}
