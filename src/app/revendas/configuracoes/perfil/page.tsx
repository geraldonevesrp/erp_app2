'use client'

import { useState } from "react"
import { useRevendaPerfil } from "@/contexts/revendas/perfil"
import { LogoUpload } from "@/components/revendas/logo-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function PerfilPage() {
  const { perfil, refreshPerfil } = useRevendaPerfil()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleLogoUpdate = async (newLogoUrl: string) => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase
        .from("perfis")
        .update({ foto_url: newLogoUrl })
        .eq("id", perfil?.id)

      if (error) throw error

      await refreshPerfil()

      toast({
        title: "Logo atualizada",
        description: "A logo da sua revenda foi atualizada com sucesso"
      })

    } catch (error: any) {
      toast({
        title: "Erro ao atualizar logo",
        description: error.message || "Ocorreu um erro ao atualizar a logo",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!perfil) {
    return null
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Configurações do Perfil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logo da Revenda</CardTitle>
          </CardHeader>
          <CardContent>
            <LogoUpload
              revendaId={perfil.id}
              fotoUrl={perfil.foto_url || undefined}
              onLogoUpdate={handleLogoUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Revenda</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input
                  value={perfil.nome_completo || ""}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Fantasia</label>
                <Input
                  value={perfil.apelido || ""}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={perfil.email || ""}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={perfil.fone || ""}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Celular</label>
                <Input
                  value={perfil.celular || ""}
                  disabled
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 