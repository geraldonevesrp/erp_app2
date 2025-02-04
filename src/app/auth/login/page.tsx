'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCircle, AlertCircle, Mail, Lock, Eye, EyeOff, Loader2, Globe } from 'lucide-react'
import { usePerfil } from '@/contexts/perfil'
import { PERFIL_TIPOS } from '@/types/perfil'
import { getVersionString } from '@/config/version'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dominio, setDominio] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLocalhostWithoutSubdomain, setIsLocalhostWithoutSubdomain] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { perfil, perfilPublico, refreshPerfil } = usePerfil()

  useEffect(() => {
    checkHostname()
  }, [])

  const checkHostname = () => {
    const hostname = window.location.hostname
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
    
    // Em localhost, verifica se tem ponto no hostname
    if (isLocalhost) {
      setIsLocalhostWithoutSubdomain(!hostname.includes('.'))
      return
    }
    
    // Em produção, verifica se está acessando o domínio base (erp1.com.br)
    const isBaseDomain = hostname === 'erp1.com.br'
    if (isBaseDomain) {
      setIsLocalhostWithoutSubdomain(true)
    }
  }

  const handleDominioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dominio) {
      setError('Por favor, informe o domínio')
      return
    }

    const hostname = window.location.hostname
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
    const protocol = window.location.protocol
    const port = isLocalhost ? ':3000' : ''

    // Constrói a URL baseada no ambiente
    const baseUrl = isLocalhost ? 'localhost' : 'erp1.com.br'
    window.location.href = `${protocol}//${dominio}.${baseUrl}${port}/auth/login`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 1. Tenta fazer login
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Login bem sucedido:', authData)

      // 2. Aguarda o refresh do perfil
      await refreshPerfil()
      
      // 3. Verifica a sessão
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Sessão não encontrada após login')
      }

      console.log('Sessão encontrada:', session.user.id)

      // 4. Busca todos os perfis do usuário
      const { data: perfis, error: perfisError } = await supabase
        .from('perfis')
        .select(`
          *,
          perfis_tipos (
            id,
            tipo
          )
        `)
        .eq('user_id', session.user.id)

      console.log('Perfis encontrados:', perfis)

      if (perfisError) {
        throw new Error(`Erro ao buscar perfis: ${perfisError.message}`)
      }

      if (!perfis || perfis.length === 0) {
        throw new Error('Nenhum perfil encontrado para este usuário')
      }

      // 5. Verifica se há um subdomínio
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
      
      // Se não tem subdomínio ou é localhost, usa a lógica padrão
      if (isLocalhost || subdomain === hostname) {
        // Se tem apenas um perfil, redireciona direto
        if (perfis.length === 1) {
          const perfil = perfis[0]
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
          return
        }

        // Se tem múltiplos perfis, redireciona para página de seleção
        router.push('/auth/selecionar-perfil')
        return
      }

      // Se tem subdomínio, continua com a lógica de verificação de perfil por subdomínio
      if (subdomain !== 'localhost') {
        console.log('=== Login Debug ===')
        console.log('Verificando subdomínio:', subdomain)

        const { data: perfilSubdominio, error: perfilError } = await supabase
          .from('perfis')
          .select('*, perfis_tipos(*)')
          .eq('dominio', subdomain)
          .single()

        console.log('Perfil do subdomínio:', perfilSubdominio)
        console.log('Erro ao buscar perfil:', perfilError)

        if (perfilError || !perfilSubdominio) {
          console.error('Erro ao buscar perfil do subdomínio:', perfilError)
          setError('Perfil não encontrado para este domínio. Por favor, verifique se o domínio está correto.')
          return
        }

        // Verifica se o usuário tem acesso ao perfil do subdomínio
        const { data: perfilAccess, error: accessError } = await supabase
          .from('perfis_users')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('perfil_id', perfilSubdominio.id)
          .single()

        const userHasAccess = perfis.some(p => p.id === perfilSubdominio.id) || !!perfilAccess

        console.log('Acesso do usuário:', userHasAccess)
        console.log('Perfil Access:', perfilAccess)
        console.log('Access Error:', accessError)
        console.log('Tipo do perfil:', perfilSubdominio.tipo)
        console.log('User ID:', session.user.id)
        console.log('Perfil ID:', perfilSubdominio.id)

        if (!userHasAccess) {
          console.log('Usuário não tem acesso ao perfil')
          setError('Você não tem permissão para acessar este perfil')
          return
        }

        // Atualiza o contexto com o perfil do subdomínio
        await refreshPerfil()

        // Redireciona baseado no tipo do perfil do subdomínio
        const tipo = perfilSubdominio.tipo || 0
        console.log('Tipo final do perfil:', tipo)

        switch (tipo) {
          case PERFIL_TIPOS.REVENDA:
            console.log('Redirecionando para revenda')
            router.push('/revendas/dashboard')
            break
          case PERFIL_TIPOS.ERP:
            console.log('Redirecionando para ERP')
            router.push('/erp/dashboard')
            break
          case PERFIL_TIPOS.MASTER:
            console.log('Redirecionando para master')
            router.push('/master/dashboard')
            break
          default:
            console.error('Tipo de perfil não reconhecido:', tipo)
            setError('Tipo de perfil não reconhecido')
        }
        console.log('=== Fim Login Debug ===')
        return
      }

      if (!perfis || perfis.length === 0) {
        throw new Error('Nenhum perfil encontrado para este usuário')
      }

      // Se não há subdomínio ou perfil associado, usa a lógica padrão
      const perfilERP = perfis.find(p => p.tipo === PERFIL_TIPOS.ERP)
      const perfilUser = perfis.find(p => p.tipo !== PERFIL_TIPOS.ERP)

      console.log('Perfil ERP:', perfilERP)
      console.log('Perfil User:', perfilUser)

      // Redireciona baseado nos perfis encontrados
      if (perfilERP) {
        // Se tem perfil ERP, usa ele como perfil principal
        router.push('/erp/dashboard')
      } else if (perfilUser?.tipo === PERFIL_TIPOS.REVENDA) {
        // Se é revenda
        router.push('/revendas/dashboard')
      } else if (perfilUser?.tipo === PERFIL_TIPOS.MASTER) {
        // Se é master
        router.push('/master/dashboard')
      } else {
        throw new Error('Tipo de perfil não reconhecido')
      }
    } catch (error: any) {
      console.error('Erro durante login:', error)
      if (error.message === 'Invalid login credentials') {
        setError('Email ou senha incorretos. Por favor, verifique suas credenciais.')
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserAccess = async (userId: string, perfilId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis_users')
        .select('*')
        .eq('user_id', userId)
        .eq('perfil_id', perfilId)
        .single()

      if (error) {
        console.error('Erro ao verificar acesso do usuário:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Erro ao verificar acesso do usuário:', error)
      return false
    }
  }

  // Se é localhost sem subdomínio, mostra o formulário de domínio
  if (isLocalhostWithoutSubdomain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/10">
        <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-3xl shadow-lg dark:shadow-primary/5 border-2 border-gray-200 dark:border-gray-800 space-y-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center p-1">
              <Globe className="w-20 h-20 text-primary/60" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Informe o Domínio
              </h1>
              <p className="text-sm text-muted-foreground">
                Digite o domínio para acessar o sistema
              </p>
            </div>
          </div>

          <form onSubmit={handleDominioSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dominio" className="text-sm font-medium">Domínio</Label>
              <div className="relative">
                <Input
                  id="dominio"
                  type="text"
                  value={dominio}
                  onChange={(e) => setDominio(e.target.value)}
                  className="pl-10 bg-white dark:bg-card border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20"
                  placeholder="exemplo"
                  required
                />
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Exemplo: se seu domínio é empresa.app.com, digite apenas "empresa"
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="border border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Acessar'
              )}
            </Button>
          </form>

          <div className="pt-4 text-center text-xs text-muted-foreground/80 border-t border-border/40">
            {getVersionString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-3xl shadow-lg dark:shadow-primary/5 border-2 border-gray-200 dark:border-gray-800 space-y-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center p-1">
            {perfilPublico?.foto_url ? (
              <Image
                src={perfilPublico.foto_url}
                alt="Logo"
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-primary/60" />
            )}
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {perfilPublico?.nome_completo || 'Bem-vindo'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para acessar
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white dark:bg-card border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20"
                placeholder="seu@email.com"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-white dark:bg-card border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="pt-4 text-center text-xs text-muted-foreground/80 border-t border-border/40">
          {getVersionString()}
        </div>
      </div>
    </div>
  )
}
