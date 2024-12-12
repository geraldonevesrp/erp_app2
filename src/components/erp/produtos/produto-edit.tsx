"use client"

import { ProdutoEditBasic } from "./produto-edit-basic"
import { ProdutoEditUnits } from "./produto-edit-units"
import { ProdutoEditStock } from "./produto-edit-stock"
import { ProdutoEditVariations } from "./produto-edit-variations"
import { ProdutoEditImages } from "./produto-edit-images"
import { ProdutoEditPrices } from "./produto-edit-prices"
import { ProdutoEditTabPrecos } from "./produto-edit-tab_precos"
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
  FileText,
  Lock,
  Layers,
  Image,
  DollarSign
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"
import { useHeader } from "@/contexts/header-context"
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

  // Carrega dados de referência ao montar o componente
  useEffect(() => {
    loadReferenceData()
  }, [])

  // Carrega os dados do produto
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      setOriginalProduto(null)

      console.log('Carregando produto ID:', produtoId);

      // Carrega os dados básicos do produto
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

      // Carrega as imagens do produto
      const { data: imagensData, error: imagensError } = await supabase
        .from("prod_imagens")
        .select(`
          id,
          url,
          ordem,
          produtos_id,
          nome,
          size
        `)
        .eq("produtos_id", produtoId)
        .order('ordem', { ascending: true });

      if (imagensError) {
        console.error("Erro ao carregar imagens:", imagensError);
        throw new Error(`Erro ao carregar imagens: ${imagensError.message}`);
      }

      // Combina os dados do produto com as imagens
      const produtoCompleto = {
        ...viewData,
        imagens: imagensData || []
      };

      setProduto(produtoCompleto)
      setOriginalProduto(produtoCompleto)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setError(error.message)
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega os dados quando o componente monta ou quando o ID muda
  useEffect(() => {
    if (produtoId) {
      loadData()
    }
  }, [produtoId])

  // Monitora mudanças nos campos
  useEffect(() => {
    if (produto && originalProduto) {
      const changed = JSON.stringify(produto) !== JSON.stringify(originalProduto)
      setHasChanges(changed)
    }
  }, [produto, originalProduto])

  // Carrega dados de referência
  const loadReferenceData = async () => {
    try {
      const [
        { data: tiposData },
        { data: generosData },
        { data: categoriasData },
        { data: subcategoriasData },
        { data: marcasData },
        { data: unidadesData },
        { data: produtosData }
      ] = await Promise.all([
        supabase.from("prod_tipos").select(),
        supabase.from("prod_genero").select(),
        supabase.from("prod_categorias").select(),
        supabase.from("prod_subcategorias").select(),
        supabase.from("prod_marcas").select(),
        supabase.from("prod_unid_medidas").select(),
        supabase.from("produtos").select("id, nome")
      ])

      setTiposProduto(tiposData || [])
      setGenerosProduto(generosData || [])
      setCategorias(categoriasData || [])
      setSubcategorias(subcategoriasData || [])
      setMarcas(marcasData || [])
      setUnidadesMedida(unidadesData || [])
      setProdutos(produtosData || [])
    } catch (error) {
      console.error("Erro ao carregar dados de referência:", error)
      toast({
        title: "Erro ao carregar dados de referência",
        description: error.message,
        variant: "destructive"
      })
    }
  }

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
      if (confirm("Existem alterações não salvas. Deseja realmente sair?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  // Salva as alterações
  const handleSave = async () => {
    try {
      const errors = validateFields()
      if (Object.keys(errors).length > 0) {
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os erros antes de salvar",
          variant: "destructive"
        })
        return
      }

      setLoading(true)

      const { error: updateError } = await supabase
        .from("produtos")
        .update({
          nome: produto.nome,
          codigo: produto.codigo,
          codigo_barras: produto.codigo_barras,
          sku: produto.sku,
          ref_fornecedor: produto.ref_fornecedor,
          tipos_produto_id: produto.tipos_produto_id,
          generos_produto_id: produto.generos_produto_id,
          categorias_id: produto.categorias_id,
          subcategorias_id: produto.subcategorias_id,
          marcas_id: produto.marcas_id,
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
          tem_variacoes: produto.tem_variacoes,
          variacoes: produto.variacoes,
          preco_custo: produto.preco_custo,
          preco_venda: produto.preco_venda,
          margem_lucro: produto.margem_lucro,
          preco_promocional: produto.preco_promocional,
          promocao_ativa: produto.promocao_ativa,
          preco_variavel: produto.preco_variavel,
          ativo: produto.ativo,
          visivel_catalogo: produto.visivel_catalogo,
          perfis_id: perfil.id
        })
        .eq("id", produtoId)
        .eq("perfis_id", perfil.id)

      if (updateError) throw updateError

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      })

      setOriginalProduto(produto)
      setHasChanges(false)
      onSave()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    {
      id: 'dadosBasicos',
      title: "Dados Básicos",
      icon: <Package2 className="h-4 w-4" />,
      content: (
        <ProdutoEditBasic
          produto={produto}
          setProduto={setProduto}
          validationErrors={validationErrors}
          markFieldAsTouched={markFieldAsTouched}
          isFieldInvalid={isFieldInvalid}
          tiposProduto={tiposProduto}
          generosProduto={generosProduto}
          categorias={categorias}
          subcategorias={subcategorias}
          marcas={marcas}
        />
      )
    },
    {
      id: 'unidadesMedidas',
      title: "Unidades e Medidas",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <ProdutoEditUnits
          produto={produto}
          setProduto={setProduto}
          unidadesMedida={unidadesMedida}
        />
      )
    },
    {
      id: 'estoqueControles',
      title: "Estoque e Controles",
      icon: <Lock className="h-4 w-4" />,
      content: (
        <ProdutoEditStock
          produto={produto}
          setProduto={setProduto}
        />
      )
    },
    {
      id: 'variacoes',
      title: "Variações",
      icon: <Layers className="h-4 w-4" />,
      content: (
        <ProdutoEditVariations
          produto={produto}
          setProduto={setProduto}
        />
      )
    },
    {
      id: 'precos',
      title: "Custos e Precificações",
      icon: <DollarSign className="h-4 w-4" />,
      content: (
        <ProdutoEditTabPrecos
          produto={produto}
          setProduto={setProduto}
        />
      )
    },
    {
      id: 'imagens',
      title: "Imagens",
      icon: <Image className="h-4 w-4" />,
      content: (
        <ProdutoEditImages
          produto={produto}
          setProduto={setProduto}
          supabase={supabase}
        />
      )
    }
  ];

  if (!produto) {
    return null
  }

  return (
    <ProdutoEditSheet
      open={isOpen}
      onOpenChange={onClose}
      loading={loading}
      hasChanges={hasChanges}
      produto={produto}
      onSave={handleSave}
    >
      <ProdutoEditSheetContent>
        <div className="p-6 space-y-6 pb-32">
          {sections.map((section) => (
            <ExpandableCard
              key={section.id}
              title={section.title}
              icon={section.icon}
              defaultExpanded={section.id === 'dadosBasicos'}
            >
              {section.content}
            </ExpandableCard>
          ))}
        </div>
      </ProdutoEditSheetContent>
    </ProdutoEditSheet>
  )
}
