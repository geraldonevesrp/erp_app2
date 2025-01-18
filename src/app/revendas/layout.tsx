'use client'

import { RevendasLayout } from '@/components/revendas/layout/revendas-layout'
import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'

const menuItems = [
  {
    title: 'Principal',
    items: [
      {
        name: 'Home',
        href: '/revendas'
      }
    ]
  },
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Visão Geral',
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
    title: 'Configurações',
    items: [
      {
        name: 'Perfil da Revenda',
        href: '/revendas/configuracoes/perfil'
      },
      {
        name: 'Personalização',
        href: '/revendas/configuracoes/personalizacao'
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
