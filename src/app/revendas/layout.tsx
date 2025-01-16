'use client'

import { RevendasLayout } from '@/components/revendas/layout/revendas-layout'
import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'

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
  },
  {
    title: 'Asaas',
    items: [
      {
        name: 'Criar Subconta',
        href: '/revendas/criar_subconta_asaas'
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
    <RevendaPerfilProvider>
      <RevendasLayout menuItems={menuItems}>
        {children}
      </RevendasLayout>
    </RevendaPerfilProvider>
  )
}
