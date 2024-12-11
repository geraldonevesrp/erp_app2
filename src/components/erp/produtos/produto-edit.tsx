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

  // Estados para os dados de referência
  const [tiposProduto, setTiposProduto] = useState([])
  const [generosProduto, setGenerosProduto] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [unidadesMedida, setUnidadesMedida] = useState([])
  const [produtos, setProdutos] = useState([])

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

      // Validação básica
      if (!produto.nome?.trim()) {
        toast({
          title: "Erro",
          description: "O nome do produto é obrigatório",
          variant: "destructive",
        })
        return
      }

      // Atualiza o produto
      const { error } = await supabase
        .from('produtos')
        .update({
          nome: produto.nome,
          cod_barras: produto.cod_barras,
          ref_fornecedor: produto.ref_fornecedor,
          sku: produto.sku,
          prod_tipos_id: produto.prod_tipos_id,
          prod_generos_id: produto.prod_generos_id,
          prod_categorias_id: produto.prod_categorias_id,
          prod_subcategorias_id: produto.prod_subcategorias_id,
          prod_marcas_id: produto.prod_marcas_id,
          ativo: produto.ativo,
          visivel_catalogo: produto.visivel_catalogo,
          unid_venda: produto.unid_venda,
          unid_compra: produto.unid_compra,
          unid_fator_conversao: produto.unid_fator_conversao,
          peso_bruto: produto.peso_bruto,
          peso_liquido: produto.peso_liquido,
          embalagem: produto.embalagem,
          estoque_ideal: produto.estoque_ideal,
          estoque_negativo: produto.estoque_negativo,
          controlado_lote: produto.controlado_lote,
          composto: produto.composto,
          food: produto.food,
          variacao1: produto.variacao1,
          variacao2: produto.variacao2,
          grade_de: produto.grade_de,
          updated_at: new Date().toISOString()
        })
        .eq('id', produtoId)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      })

      // Recarrega os dados
      await loadData()

      // Notifica o componente pai
      onSave()

    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para carregar dados de referência
  const loadReferenceData = async () => {
    try {
      // Carrega tipos de produto
      const { data: tipos } = await supabase
        .from('prod_tipos')
        .select('*')
        .order('tipo')
      setTiposProduto(tipos || [])

      // Carrega gêneros
      const { data: generos } = await supabase
        .from('prod_genero')
        .select('*')
        .order('genero')
      setGenerosProduto(generos || [])

      // Carrega categorias
      const { data: cats } = await supabase
        .from('prod_categorias')
        .select('*')
        .eq('perfis_id', perfil.id)
        .order('categoria')
      setCategorias(cats || [])

      // Carrega subcategorias
      const { data: subcats } = await supabase
        .from('prod_subcategorias')
        .select('*')
        .eq('perfis_id', perfil.id)
        .order('subcategoria')
      setSubcategorias(subcats || [])

      // Carrega marcas
      const { data: marcs } = await supabase
        .from('prod_marcas')
        .select('*')
        .eq('perfis_id', perfil.id)
        .order('marca')
      setMarcas(marcs || [])

      // Carrega unidades de medida
      const { data: unids } = await supabase
        .from('prod_unid_medidas')
        .select('*')
        .order('nome')
      setUnidadesMedida(unids || [])

      // Carrega produtos para seleção de "Grade De"
      const { data: prods } = await supabase
        .from('produtos')
        .select('id, nome')
        .eq('perfis_id', perfil.id)
        .eq('prod_tipos_id', 2) // Apenas produtos tipo grade
        .order('nome')
      setProdutos(prods || [])

    } catch (error) {
      console.error('Erro ao carregar dados de referência:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar alguns dados de referência",
        variant: "destructive",
      })
    }
  }

  // Função para manipular upload de imagem
  const handleImagemUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)

      // Gera um nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `perfis/${perfil.id}/produtos_imagens/${produtoId}/${fileName}`

      // Faz upload do arquivo para o Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obtém a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath)

      // Insere o registro na tabela prod_imagens
      const { error: dbError } = await supabase
        .from('prod_imagens')
        .insert({
          produtos_id: produtoId,
          url: publicUrl,
          nome: fileName,
          size: file.size
        })

      if (dbError) throw dbError

      // Recarrega os dados do produto
      await loadData()

      toast({
        title: "Sucesso",
        description: "Imagem adicionada com sucesso",
      })

    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para excluir imagem
  const handleDeleteImagem = async (imagemId: number) => {
    try {
      setLoading(true)

      // Obtém os dados da imagem
      const { data: imagem } = await supabase
        .from('prod_imagens')
        .select('*')
        .eq('id', imagemId)
        .single()

      if (!imagem) throw new Error('Imagem não encontrada')

      // Remove o arquivo do Storage
      const filePath = imagem.url.split('/').slice(-4).join('/')
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filePath])

      if (storageError) throw storageError

      // Remove o registro do banco
      const { error: dbError } = await supabase
        .from('prod_imagens')
        .delete()
        .eq('id', imagemId)

      if (dbError) throw dbError

      // Recarrega os dados do produto
      await loadData()

      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso",
      })

    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a imagem",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para reordenar imagens
  const handleReorderImagem = async (fromIndex: number, toIndex: number) => {
    if (!produto?.imagens) return

    try {
      setLoading(true)

      // Atualiza a ordem das imagens
      const updates = produto.imagens.map((imagem, index) => {
        if (index === fromIndex) {
          return { id: imagem.id, ordem: toIndex + 1 }
        }
        if (index === toIndex) {
          return { id: imagem.id, ordem: fromIndex + 1 }
        }
        return { id: imagem.id, ordem: index + 1 }
      })

      // Atualiza no banco
      for (const update of updates) {
        const { error } = await supabase
          .from('prod_imagens')
          .update({ ordem: update.ordem })
          .eq('id', update.id)

        if (error) throw error
      }

      // Recarrega os dados do produto
      await loadData()

    } catch (error) {
      console.error('Erro ao reordenar imagens:', error)
      toast({
        title: "Erro",
        description: "Não foi possível reordenar as imagens",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados de referência ao montar o componente
  useEffect(() => {
    loadReferenceData()
  }, [])

  const sections = [
    {
      id: "dados-basicos",
      title: "Dados Básicos",
      icon: <Package2 className="h-4 w-4" />,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome <span className="text-red-500">*</span></Label>
            <Input
              value={produto?.nome || ""}
              onChange={(e) => {
                setProduto(prev => ({ ...prev, nome: e.target.value }))
                markFieldAsTouched("nome")
              }}
              error={validationErrors.nome}
            />
          </div>

          <div className="space-y-2">
            <Label>Código de Barras</Label>
            <Input
              value={produto?.cod_barras || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, cod_barras: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>SKU</Label>
            <Input
              value={produto?.sku || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, sku: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ref. Fornecedor</Label>
            <Input
              value={produto?.ref_fornecedor || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, ref_fornecedor: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo <span className="text-red-500">*</span></Label>
            <Select
              value={String(produto?.prod_tipos_id || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, prod_tipos_id: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {tiposProduto.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select
              value={String(produto?.prod_generos_id || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, prod_generos_id: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {generosProduto.map((genero) => (
                  <SelectItem key={genero.id} value={String(genero.id)}>
                    {genero.genero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={String(produto?.prod_categorias_id || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, prod_categorias_id: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={String(categoria.id)}>
                    {categoria.categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subcategoria</Label>
            <Select
              value={String(produto?.prod_subcategorias_id || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, prod_subcategorias_id: Number(value) }))}
              disabled={!produto?.prod_categorias_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {subcategorias
                  .filter((sub) => sub.categoria_id === produto?.prod_categorias_id)
                  .map((subcategoria) => (
                    <SelectItem key={subcategoria.id} value={String(subcategoria.id)}>
                      {subcategoria.subcategoria}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Marca</Label>
            <Select
              value={String(produto?.prod_marcas_id || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, prod_marcas_id: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {marcas.map((marca) => (
                  <SelectItem key={marca.id} value={String(marca.id)}>
                    {marca.marca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={produto?.ativo || false}
              onCheckedChange={(checked) => setProduto(prev => ({ ...prev, ativo: checked }))}
            />
            <Label>Ativo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={produto?.visivel_catalogo || false}
              onCheckedChange={(checked) => setProduto(prev => ({ ...prev, visivel_catalogo: checked }))}
            />
            <Label>Visível no Catálogo</Label>
          </div>
        </div>
      )
    },
    {
      id: "unidades-medidas",
      title: "Unidades e Medidas",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Unidade de Venda <span className="text-red-500">*</span></Label>
            <Select
              value={String(produto?.unid_venda || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, unid_venda: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {unidadesMedida.map((unidade) => (
                  <SelectItem key={unidade.id} value={String(unidade.id)}>
                    {unidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Unidade de Compra</Label>
            <Select
              value={String(produto?.unid_compra || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, unid_compra: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {unidadesMedida.map((unidade) => (
                  <SelectItem key={unidade.id} value={String(unidade.id)}>
                    {unidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fator de Conversão</Label>
            <Input
              type="number"
              value={produto?.unid_fator_conversao || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, unid_fator_conversao: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Peso Bruto (kg)</Label>
            <Input
              type="number"
              step="0.001"
              value={produto?.peso_bruto || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, peso_bruto: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Peso Líquido (kg)</Label>
            <Input
              type="number"
              step="0.001"
              value={produto?.peso_liquido || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, peso_liquido: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Embalagem</Label>
            <Input
              value={produto?.embalagem || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, embalagem: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      id: "estoque-controles",
      title: "Estoque e Controles",
      icon: <Lock className="h-4 w-4" />,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Estoque Ideal</Label>
            <Input
              type="number"
              step="0.001"
              value={produto?.estoque_ideal || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, estoque_ideal: e.target.value }))}
            />
          </div>

          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={produto?.estoque_negativo || false}
                onCheckedChange={(checked) => setProduto(prev => ({ ...prev, estoque_negativo: checked }))}
              />
              <Label>Permite Estoque Negativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={produto?.controlado_lote || false}
                onCheckedChange={(checked) => setProduto(prev => ({ ...prev, controlado_lote: checked }))}
              />
              <Label>Controlado por Lote</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={produto?.composto || false}
                onCheckedChange={(checked) => setProduto(prev => ({ ...prev, composto: checked }))}
              />
              <Label>Produto Composto</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={produto?.food || false}
                onCheckedChange={(checked) => setProduto(prev => ({ ...prev, food: checked }))}
              />
              <Label>Food</Label>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "variacoes",
      title: "Variações",
      icon: <Tags className="h-4 w-4" />,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Variação 1</Label>
            <Input
              value={produto?.variacao1 || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, variacao1: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Variação 2</Label>
            <Input
              value={produto?.variacao2 || ""}
              onChange={(e) => setProduto(prev => ({ ...prev, variacao2: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Grade De</Label>
            <Select
              value={String(produto?.grade_de || "")}
              onValueChange={(value) => setProduto(prev => ({ ...prev, grade_de: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: "imagens",
      title: "Imagens",
      icon: <Camera className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {produto?.imagens?.map((imagem, index) => (
              <div
                key={imagem.id}
                className="relative group aspect-square rounded-lg overflow-hidden border"
              >
                <img
                  src={imagem.url}
                  alt={imagem.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleDeleteImagem(imagem.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleReorderImagem(index, index - 1)}
                    disabled={index === 0}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleReorderImagem(index, index + 1)}
                    disabled={index === produto.imagens.length - 1}
                  >
                    <ChevronsUpDown className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            ))}
            
            <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <Plus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Adicionar Imagem</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImagemUpload}
              />
            </label>
          </div>
        </div>
      )
    }
  ]

  if (!produto) {
    return null
  }

  return (
    <ProdutoEditSheet
      open={isOpen}
      onOpenChange={handleClose}
      loading={loading}
      hasChanges={hasChanges}
      produto={produto}
      onSave={handleSave}
    >
      <ProdutoEditSheetContent>
        <div className="space-y-6">
          {sections.map((section) => (
            <ExpandableCard
              key={section.id}
              title={section.title}
              icon={section.icon}
            >
              {section.content}
            </ExpandableCard>
          ))}
        </div>
      </ProdutoEditSheetContent>
    </ProdutoEditSheet>
  )
}
