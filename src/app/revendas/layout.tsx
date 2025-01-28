'use client'

import { useRevendaStatus } from '@/hooks/revendas/useRevendaStatus'
import { useRevendaAsaas } from '@/hooks/revendas/useRevendaAsaas'
import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'
import { RevendasLayout } from '@/components/revendas/layout/revendas-layout'
import { Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

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
  }
]

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading: isStatusLoading, isActive, status } = useRevendaStatus()
  const { isLoading: isAsaasLoading, hasAsaasAccount } = useRevendaAsaas()
  const pathname = usePathname()
  const router = useRouter()

  // Se estiver carregando o status da revenda, mostra um loader simples
  if (isStatusLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando status da revenda...</span>
      </div>
    )
  }

  // Se não estiver ativa e não estiver aguardando ativação
  if (!isActive && status !== 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Revenda Inativa
          </h1>
          <p className="text-gray-600">
            Sua revenda está inativa. Entre em contato com o suporte para mais informações.
          </p>
        </div>
      </div>
    )
  }

  // Se estiver na página de criar subconta, não usa o layout padrão
  if (pathname === '/revendas/criar_subconta_asaas') {
    return (
      <RevendaPerfilProvider>
        {children}
      </RevendaPerfilProvider>
    )
  }

  return (
    <RevendaPerfilProvider>
      <RevendasLayout menuItems={menuItems}>
        {children}
      </RevendasLayout>
    </RevendaPerfilProvider>
  )
}
