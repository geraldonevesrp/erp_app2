'use client'

import { RevendasLayout } from '@/components/revendas/layout/revendas-layout'
import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'
import { useRevendaAsaas } from '@/hooks/revendas/useRevendaAsaas'
import { useRevendaStatus } from '@/hooks/revendas/useRevendaStatus'
import { StatusBar } from '@/components/ui/status-bar'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

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
  const { isLoading: isStatusLoading, isActive } = useRevendaStatus()
  const { isLoading: isAsaasLoading, hasAsaasAccount, progress, error } = useRevendaAsaas()

  // Se estiver carregando o status da revenda, mostra um loader simples
  if (isStatusLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Se não estiver ativa
  if (!isActive) {
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

  // Se estiver configurando a conta Asaas
  if (isAsaasLoading || !hasAsaasAccount) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Configurando sua Conta
          </h1>

          {error ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na Configuração</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              <StatusBar 
                message={isAsaasLoading 
                  ? "Verificando sua conta..." 
                  : "Configurando sua conta no Asaas..."}
                progress={progress}
              />
              <p className="text-sm text-muted-foreground">
                Isso pode levar alguns instantes. Por favor, não feche esta página.
              </p>
            </>
          )}
        </div>
      </div>
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
