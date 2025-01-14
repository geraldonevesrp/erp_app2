'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCircle, AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { usePerfil } from '@/contexts/perfil'
import { PERFIL_TIPOS } from '@/types/perfil'
import { getVersionString } from '@/config/version'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { perfil, perfilPublico, refreshPerfil } = usePerfil()

  useEffect(() => {
    // Se já tem perfil e está autenticado, redireciona baseado no tipo
    if (perfil) {
      switch (perfil.tipo) {
        case PERFIL_TIPOS.REVENDA:
          router.push('/revendas')
          break
        case PERFIL_TIPOS.ERP:
          router.push('/erp/dashboard')
          break
        case PERFIL_TIPOS.MASTER:
          router.push('/master')
          break
        default:
          router.push('/auth/sem-acesso')
      }
      return
    }
  }, [perfil])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Aguarda o refresh do perfil
      await refreshPerfil()
      
      // Aguarda um momento para ter certeza que o perfil foi carregado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verifica novamente o perfil após o refresh
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Sessão não encontrada após login')
      }

      // Busca o perfil do usuário
      const { data: perfilUser, error: perfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (perfilError) {
        throw new Error('Erro ao buscar perfil do usuário')
      }

      if (!perfilUser) {
        throw new Error('Perfil do usuário não encontrado')
      }

      // Redireciona baseado no tipo do perfil
      switch (perfilUser.tipo) {
        case PERFIL_TIPOS.REVENDA:
          router.push('/revendas')
          break
        case PERFIL_TIPOS.ERP:
          router.push('/erp/dashboard')
          break
        case PERFIL_TIPOS.MASTER:
          router.push('/master')
          break
        default:
          router.push('/auth/sem-acesso')
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
              {perfilPublico?.nome || 'Bem-vindo'}
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
