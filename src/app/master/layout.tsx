"use client"

import { MasterLayout } from '@/components/master/layout/master-layout'

const menuItems = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Home',
        href: '/master/dashboard'
      },
      {
        name: 'Métricas',
        href: '/master/dashboard/metricas'
      }
    ]
  },
  {
    title: 'Gestão',
    items: [
      {
        name: 'Perfis',
        href: '/master/gestao/perfis'
      },
      {
        name: 'Usuários',
        href: '/master/gestao/usuarios'
      },
      {
        name: 'Revendas',
        href: '/master/gestao/revendas'
      }
    ]
  },
  {
    title: 'Configurações',
    items: [
      {
        name: 'Sistema',
        href: '/master/config/sistema'
      },
      {
        name: 'Integrações',
        href: '/master/config/integracoes'
      },
      {
        name: 'Logs',
        href: '/master/config/logs'
      }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      {
        name: 'Assinaturas',
        href: '/master/financeiro/assinaturas'
      },
      {
        name: 'Comissões',
        href: '/master/financeiro/comissoes'
      },
      {
        name: 'Relatórios',
        href: '/master/financeiro/relatorios'
      }
    ]
  }
]

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MasterLayout menuItems={menuItems}>{children}</MasterLayout>
}
