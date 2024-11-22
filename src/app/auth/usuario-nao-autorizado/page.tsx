'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ShieldOff } from 'lucide-react'

export default function UsuarioNaoAutorizadoPage() {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldOff className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Usuário Não Autorizado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar este perfil.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Para obter acesso, solicite ao proprietário do perfil que adicione
            seu usuário como membro autorizado.
          </p>

          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full"
              onClick={handleLogout}
            >
              Voltar para Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
