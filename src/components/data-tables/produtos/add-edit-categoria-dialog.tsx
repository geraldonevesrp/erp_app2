"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const supabase = createClientComponentClient<Database>()

type Categoria = Database['public']['Tables']['prod_categorias']['Row']
type Subcategoria = Database['public']['Tables']['prod_subcategorias']['Row']

interface CategoriaWithSubcategorias extends Categoria {
  subcategorias: Subcategoria[]
}

interface AddEditCategoriaDialogProps {
  categoria: CategoriaWithSubcategorias | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function AddEditCategoriaDialog({
  categoria,
  open,
  onOpenChange,
  onSave,
}: AddEditCategoriaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [categoriaName, setCategoriaName] = useState("")
  const [subcategoriaName, setSubcategoriaName] = useState("")
  const [subcategorias, setSubcategorias] = useState<string[]>([])

  useEffect(() => {
    if (categoria) {
      setCategoriaName(categoria.categoria || "")
      setSubcategorias(categoria.subcategorias?.map(sub => sub.subcategoria) || [])
    } else {
      setCategoriaName("")
      setSubcategorias([])
    }
  }, [categoria])

  const handleAddSubcategoria = () => {
    if (subcategoriaName.trim() && !subcategorias.includes(subcategoriaName.trim())) {
      setSubcategorias([...subcategorias, subcategoriaName.trim()])
      setSubcategoriaName("")
    }
  }

  const handleRemoveSubcategoria = (index: number) => {
    setSubcategorias(subcategorias.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      // Salvar ou atualizar categoria
      const categoriaData = {
        categoria: categoriaName,
      }

      let categoriaId = categoria?.id

      if (!categoria) {
        const { data: newCategoria, error: categoriaError } = await supabase
          .from('prod_categorias')
          .insert([categoriaData])
          .select()
          .single()

        if (categoriaError) throw categoriaError
        categoriaId = newCategoria.id
      } else {
        const { error: categoriaError } = await supabase
          .from('prod_categorias')
          .update(categoriaData)
          .eq('id', categoria.id)

        if (categoriaError) throw categoriaError
      }

      // Remover subcategorias antigas se estiver editando
      if (categoria?.id) {
        const { error: deleteError } = await supabase
          .from('prod_subcategorias')
          .delete()
          .eq('categoria_id', categoria.id)

        if (deleteError) throw deleteError
      }

      // Adicionar novas subcategorias
      if (subcategorias.length > 0) {
        const subcategoriasData = subcategorias.map(sub => ({
          categoria_id: categoriaId,
          subcategoria: sub,
        }))

        const { error: subcategoriasError } = await supabase
          .from('prod_subcategorias')
          .insert(subcategoriasData)

        if (subcategoriasError) throw subcategoriasError
      }

      toast.success(categoria ? 'Categoria atualizada com sucesso' : 'Categoria criada com sucesso')
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      toast.error('Erro ao salvar categoria')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{categoria ? 'Editar' : 'Nova'} Categoria</DialogTitle>
          <DialogDescription>
            Preencha os dados da categoria e suas subcategorias.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoria" className="text-right">
              Categoria
            </Label>
            <Input
              id="categoria"
              value={categoriaName}
              onChange={(e) => setCategoriaName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subcategoria" className="text-right">
              Subcategoria
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="subcategoria"
                  value={subcategoriaName}
                  onChange={(e) => setSubcategoriaName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSubcategoria()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSubcategoria}>
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subcategorias.map((sub, index) => (
                  <Badge key={index} variant="secondary">
                    {sub}
                    <Button
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => handleRemoveSubcategoria(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
