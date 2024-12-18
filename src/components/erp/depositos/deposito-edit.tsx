"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { usePerfil } from "@/contexts/perfil"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DepositoEditProps {
  depositoId: number | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function DepositoEdit({ 
  depositoId, 
  isOpen, 
  onClose, 
  onSave 
}: DepositoEditProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deposito, setDeposito] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  // Carrega os dados do depósito
  useEffect(() => {
    const loadData = async () => {
      if (!depositoId) {
        setDeposito({
          nome: "",
          principal: false,
          perfis_id: perfil.id
        })
        return
      }

      try {
        setLoading(true)
        setError("")

        const { data, error } = await supabase
          .from("depositos")
          .select()
          .eq("id", depositoId)
          .eq("perfis_id", perfil.id)
          .single()

        if (error) throw error

        setDeposito(data)
      } catch (error: any) {
        setError(error.message)
        toast({
          variant: "destructive",
          title: "Erro ao carregar depósito",
          description: error.message
        })
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [depositoId, isOpen])

  // Salva as alterações
  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      if (!deposito.nome?.trim()) {
        throw new Error("Nome é obrigatório")
      }

      if (depositoId) {
        // Atualiza depósito existente
        const { error } = await supabase
          .from("depositos")
          .update({
            nome: deposito.nome
          })
          .eq("id", depositoId)
          .eq("perfis_id", perfil.id)

        if (error) throw error
      } else {
        // Cria novo depósito
        const { error } = await supabase
          .from("depositos")
          .insert([{
            nome: deposito.nome,
            perfis_id: perfil.id
          }])

        if (error) throw error
      }

      toast({
        title: "Sucesso",
        description: "Depósito salvo com sucesso!"
      })

      onSave()
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Erro ao salvar depósito",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Exclui o depósito
  const handleDelete = async () => {
    if (!depositoId) return
    if (deposito.principal) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "O depósito principal não pode ser excluído."
      })
      return
    }

    try {
      setLoading(true)
      setError("")

      const { error } = await supabase
        .from("depositos")
        .delete()
        .eq("id", depositoId)
        .eq("perfis_id", perfil.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Depósito excluído com sucesso!"
      })

      onSave()
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Erro ao excluir depósito",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          value={deposito?.nome || ""}
          onChange={(e) => {
            setDeposito(prev => ({ ...prev, nome: e.target.value }))
            setHasChanges(true)
          }}
          placeholder="Nome do depósito"
        />
      </div>

      {deposito?.principal && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Depósito Principal</Badge>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          disabled={loading || !depositoId || deposito?.principal}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
