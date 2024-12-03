"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePerfil } from "@/contexts/perfil"
import { useToast } from "@/components/ui/use-toast"

interface AddProdutoDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (id: number) => void
}

export function AddProdutoDialog({ isOpen, onClose, onSuccess }: AddProdutoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [codBarras, setCodBarras] = useState("")
  const [sku, setSku] = useState("")
  const [descricao, setDescricao] = useState("")
  const [ativo, setAtivo] = useState(false)
  const [visivelCatalogo, setVisivelCatalogo] = useState(false)
  
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('produtos')
        .insert({
          nome,
          cod_barras: codBarras,
          sku,
          descricao,
          ativo,
          visivel_catalogo: visivelCatalogo,
          perfis_id: perfil?.id
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
        variant: "success"
      })

      // Limpa o formulário
      setNome("")
      setCodBarras("")
      setSku("")
      setDescricao("")
      setAtivo(false)
      setVisivelCatalogo(false)

      // Fecha o diálogo e notifica sucesso
      onClose()
      if (onSuccess && data) {
        onSuccess(data.id)
      }

    } catch (error: any) {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="codBarras">Código de Barras</Label>
              <Input
                id="codBarras"
                placeholder="Código de barras"
                value={codBarras}
                onChange={(e) => setCodBarras(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="SKU do produto"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Descrição do produto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={ativo}
                onCheckedChange={setAtivo}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visivelCatalogo"
                checked={visivelCatalogo}
                onCheckedChange={setVisivelCatalogo}
              />
              <Label htmlFor="visivelCatalogo">Visível no Catálogo</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
