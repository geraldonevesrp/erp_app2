"use client"

import { AppLayout } from '@/components/layout/app-layout'

const menuItems = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Home', href: '/revendedores' }
    ]
  },
  {
    title: 'Licenças',
    items: [
      { name: 'Lista', href: '/revendedores/licencas' }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      { name: 'A Receber', href: '/revendedores/financeiro/receber' },
      { name: 'Vencidas', href: '/revendedores/financeiro/vencidas' }
    ]
  }
]

export default function RevendedoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout menuItems={menuItems}>{children}</AppLayout>
}
