'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCircle, AlertCircle, Building2, Store, Crown } from 'lucide-react'
import { usePerfil } from '@/contexts/perfil'
import { PERFIL_TIPOS, Perfil } from '@/types/perfil'
import { getVersionString } from '@/config/version'

export default function SelecionarPerfilPage() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { refreshPerfil } = usePerfil()

  useEffect(() => {
    loadPerfis()
  }, [])

  const loadPerfis = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Verifica a sessão
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Busca os perfis do usuário
      const { data: perfisData, error: perfisError } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', session.user.id)

      if (perfisError) throw perfisError

      if (!perfisData || perfisData.length === 0) {
        throw new Error('Nenhum perfil encontrado')
      }

      setPerfis(perfisData)
    } catch (error: any) {
      console.error('Erro ao carregar perfis:', error)
      setError('Ocorreu um erro ao carregar seus perfis. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPerfil = async (perfil: Perfil) => {
    try {
      setIsLoading(true)
      setError(null)

      // Se tem domínio, redireciona para ele
      if (perfil.dominio) {
        const protocol = window.location.protocol
        const domain = window.location.host.split('.').slice(1).join('.')
        window.location.href = `${protocol}//${perfil.dominio}.${domain}/auth/login`
        return
      }

      // Se não tem domínio, atualiza o perfil e redireciona
      await refreshPerfil()

      switch (perfil.tipo) {
        case PERFIL_TIPOS.REVENDA:
          router.push('/revendas/dashboard')
          break
        case PERFIL_TIPOS.ERP:
          router.push('/erp/dashboard')
          break
        case PERFIL_TIPOS.MASTER:
          router.push('/master/dashboard')
          break
        default:
          throw new Error('Tipo de perfil não reconhecido')
      }
    } catch (error: any) {
      console.error('Erro ao selecionar perfil:', error)
      setError('Ocorreu um erro ao selecionar o perfil. Por favor, tente novamente.')
      setIsLoading(false)
    }
  }

  const getPerfilIcon = (tipo: number) => {
    switch (tipo) {
      case PERFIL_TIPOS.ERP:
        return <Building2 className="w-6 h-6" />
      case PERFIL_TIPOS.REVENDA:
        return <Store className="w-6 h-6" />
      case PERFIL_TIPOS.MASTER:
        return <Crown className="w-6 h-6" />
      default:
        return <UserCircle className="w-6 h-6" />
    }
  }

  const getPerfilTipo = (tipo: number) => {
    switch (tipo) {
      case PERFIL_TIPOS.ERP:
        return 'ERP'
      case PERFIL_TIPOS.REVENDA:
        return 'Revenda'
      case PERFIL_TIPOS.MASTER:
        return 'Master'
      default:
        return 'Perfil'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="w-full max-w-4xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Selecione um Perfil
          </h1>
          <p className="text-muted-foreground">
            Escolha qual perfil você deseja acessar
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perfis.map((perfil) => (
            <Card 
              key={perfil.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => !isLoading && handleSelectPerfil(perfil)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {perfil.nome_completo || perfil.apelido || 'Sem nome'}
                  </CardTitle>
                  {getPerfilIcon(perfil.tipo)}
                </div>
                <CardDescription>
                  {getPerfilTipo(perfil.tipo)}
                  {perfil.dominio && ` • ${perfil.dominio}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center p-1">
                    {perfil.foto_url ? (
                      <Image
                        src={perfil.foto_url}
                        alt="Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UserCircle className="w-10 h-10 text-primary/60" />
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Acessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 text-center text-xs text-muted-foreground/80 border-t border-border/40">
          {getVersionString()}
        </div>
      </div>
    </div>
  )
}
