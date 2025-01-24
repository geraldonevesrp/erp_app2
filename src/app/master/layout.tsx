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
    title: 'Asaas',
    items: [
      {
        name: 'Clientes',
        href: '/master/asaas/testes/clientes'
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
  }
]

export default function MasterRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MasterLayout menuItems={menuItems}>{children}</MasterLayout>
}
