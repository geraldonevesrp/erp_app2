"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePerfil } from "@/contexts/perfil"
import { 
  Package2,
  Tags,
  FileText,
  Lock,
  Check,
  ChevronsUpDown,
  Asterisk,
  Plus
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"
import { useHeader } from "@/contexts/header-context"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Camera, PencilLine, X } from "lucide-react"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"
import { ProdutoEditSheet, ProdutoEditSheetContent } from "./produto-edit-sheet"

interface ProdutoEditProps {
  produtoId: number
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function ProdutoEdit({ produtoId, isOpen, onClose, onSave }: ProdutoEditProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [produto, setProduto] = useState<any>(null)
  const [originalProduto, setOriginalProduto] = useState<any>(null)
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({})
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [hasChanges, setHasChanges] = useState(false)
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  // Carrega os dados do produto
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      setOriginalProduto(null)

      const { data: viewData, error: viewError } = await supabase
        .from("v_produtos")
        .select()
        .eq("id", produtoId)
        .eq("perfis_id", perfil.id)
        .single()

      if (viewError) {
        console.error("Erro ao carregar dados da view:", viewError)
        throw new Error(`Erro ao carregar dados: ${viewError.message}`)
      }

      if (!viewData) {
        throw new Error("Dados não encontrados")
      }

      const { data: produtoData, error: produtoError } = await supabase
        .from("produtos")
        .select(`
          *
        `)
        .single()
        .eq("id", produtoId)
        .eq("perfis_id", perfil.id)

      if (produtoError) {
        console.error("Erro ao carregar dados do produto:", produtoError)
        throw new Error(`Erro ao carregar dados: ${produtoError.message}`)
      }

      if (!produtoData) {
        throw new Error("Dados não encontrados")
      }

      const mergedData = {
        ...produtoData,
        ...viewData
      }

      setProduto(mergedData)
      setOriginalProduto(mergedData)

    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados ao montar o componente
  useEffect(() => {
    if (isOpen && produtoId) {
      loadData()
    }
  }, [isOpen, produtoId])

  // Monitora mudanças nos campos
  useEffect(() => {
    if (produto && originalProduto) {
      const changed = JSON.stringify(produto) !== JSON.stringify(originalProduto)
      setHasChanges(changed)
    }
  }, [produto, originalProduto])

  // Valida campos
  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    
    if (!produto) {
      errors.geral = "Dados do produto não encontrados"
      return errors
    }

    // Validação do nome
    if (!produto.nome?.trim()) {
      errors.nome = "Nome é obrigatório"
    } else if (produto.nome.trim().length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres"
    }

    // Validação do código
    if (!produto.codigo?.trim()) {
      errors.codigo = "Código é obrigatório"
    }

    setValidationErrors(errors)
    return errors
  }

  // Marca campo como tocado
  const markFieldAsTouched = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
  }

  // Verifica se campo é inválido
  const isFieldInvalid = (field: string, value: any) => {
    if (!touchedFields[field]) return false
    return !value || value.trim() === ""
  }

  // Fecha o componente
  const handleClose = () => {
    if (hasChanges) {
      // TODO: Mostrar confirmação antes de fechar
      if (confirm("Existem alterações não salvas. Deseja realmente fechar?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  // Salva as alterações
  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      // Validação dos campos
      const errors = validateFields()
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join("\n")
        throw new Error(errorMessages)
      }

      if (!produto || !produtoId || !perfil?.id) {
        throw new Error("Dados necessários não encontrados")
      }

      // Atualizar produto
      const { error: updateError } = await supabase
        .from("produtos")
        .update({
          nome: produto.nome,
          codigo: produto.codigo,
          descricao: produto.descricao,
          status_id: produto.status_id,
          perfis_id: perfil.id
        })
        .eq('id', produtoId)

      if (updateError) throw updateError

      // Limpar estados locais
      setTouchedFields({})
      setHasChanges(false)
      
      // Recarregar dados
      const { data: refreshedData, error: refreshError } = await supabase
        .from("produtos")
        .select(`*`)
        .eq('id', produtoId)
        .single()

      if (refreshError) throw refreshError

      // Atualizar estados com os dados atualizados
      setProduto(refreshedData)
      setOriginalProduto(refreshedData)

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!",
        variant: "success"
      })

      onSave()
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!produto) {
    return null
  }

  return (
    <ProdutoEditSheet 
      open={isOpen} 
      onOpenChange={handleClose} 
      className="w-full lg:max-w-[1000px]"
      loading={loading}
      hasChanges={hasChanges}
      produto={produto}
      onSave={handleSave}
    >
      <ProdutoEditSheetContent>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 pb-6">
              {/* Dados Básicos */}
              <ExpandableCard
                icon={<Package2 className="w-4 h-4" />}
                title="Dados Básicos"
                defaultExpanded
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">
                      Nome
                      <Asterisk className="w-3 h-3 text-destructive inline ml-1" />
                    </Label>
                    <Input
                      id="nome"
                      value={produto.nome || ""}
                      onChange={e => {
                        setProduto(prev => ({ ...prev, nome: e.target.value }))
                        markFieldAsTouched("nome")
                      }}
                      className={cn(
                        isFieldInvalid("nome", produto.nome) && "border-destructive"
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="codigo">
                      Código
                      <Asterisk className="w-3 h-3 text-destructive inline ml-1" />
                    </Label>
                    <Input
                      id="codigo"
                      value={produto.codigo || ""}
                      onChange={e => {
                        setProduto(prev => ({ ...prev, codigo: e.target.value }))
                        markFieldAsTouched("codigo")
                      }}
                      className={cn(
                        isFieldInvalid("codigo", produto.codigo) && "border-destructive"
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      value={produto.descricao || ""}
                      onChange={e => setProduto(prev => ({ ...prev, descricao: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={String(produto.status_id || 1)}
                      onValueChange={value => setProduto(prev => ({ ...prev, status_id: Number(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ativo</SelectItem>
                        <SelectItem value="2">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ExpandableCard>
            </div>
          </div>
        </div>
      </ProdutoEditSheetContent>
    </ProdutoEditSheet>
  )
}
