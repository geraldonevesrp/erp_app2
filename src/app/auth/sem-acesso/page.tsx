'use client'

import { AlertCircle } from 'lucide-react'

export default function SemAcessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Perfil Não Encontrado</h1>
          <p className="text-muted-foreground">
            O subdomínio acessado não está associado a nenhum perfil no sistema.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-4">
            <p>
              Para acessar seu sistema digite seu domínio corretamente
            </p>
            <p className="font-mono bg-muted p-2 rounded">
              Ex: seudominio.erp1.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
