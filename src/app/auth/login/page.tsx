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
import { PERFIL_ROTAS } from '@/types/perfil'
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
    // Se já tem perfil e está autenticado, redireciona
    if (perfil) {
      // Redireciona para o dashboard se já estiver logado
      router.push('/erp/dashboard')
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

      await refreshPerfil()
      router.push('/erp/dashboard')
    } catch (error: any) {
      console.error('Erro no login:', error)
      setError('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {perfilPublico?.foto_url ? (
            <Image
              src={perfilPublico.foto_url}
              alt="Logo"
              width={200}
              height={200}
              className="rounded-lg"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
              <UserCircle className="w-32 h-32 text-gray-400" />
            </div>
          )}

          {perfilPublico?.apelido && (
            <h1 className="text-2xl font-semibold text-gray-900">
              {perfilPublico.apelido}
            </h1>
          )}

          <p className="text-sm text-gray-500">
            Entre com suas credenciais para acessar
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
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
          <div className="absolute bottom-2 right-2">
            <span className="text-xs text-muted-foreground">
              {getVersionString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
