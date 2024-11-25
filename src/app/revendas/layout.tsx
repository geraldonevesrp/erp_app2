"use client"

import { RevendasLayout } from '@/components/revendas/layout/revendas-layout'

const menuItems = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Home',
        href: '/revendas/dashboard'
      },
      {
        name: 'Vendas',
        href: '/revendas/dashboard/vendas'
      }
    ]
  },
  {
    title: 'Clientes',
    items: [
      {
        name: 'Meus Clientes',
        href: '/revendas/clientes'
      },
      {
        name: 'Leads',
        href: '/revendas/clientes/leads'
      }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      {
        name: 'Comissões',
        href: '/revendas/financeiro/comissoes'
      },
      {
        name: 'Extratos',
        href: '/revendas/financeiro/extratos'
      }
    ]
  }
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RevendasLayout menuItems={menuItems}>{children}</RevendasLayout>
}
