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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Maximize2 } from "lucide-react";

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
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null)
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

      // Primeiro, carrega os dados básicos do produto
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

      // Agora carrega as imagens do produto
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

      console.log('Query imagens resultado:', { data: imagensData, error: imagensError });

      if (imagensError) {
        console.error("Erro ao carregar imagens:", imagensError);
        throw new Error(`Erro ao carregar imagens: ${imagensError.message}`);
      }

      // Combina os dados do produto com as imagens
      const produtoCompleto = {
        ...viewData,
        imagens: imagensData || []
      };

      console.log('Produto completo:', produtoCompleto);

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

  // Função para salvar imagens independentemente
  const handleSaveImages = async (images: any[]) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('produtos_imagens')
        .upsert(
          images.map((img, index) => ({
            id: img.id,
            produtos_id: produtoId,
            url: img.url,
            ordem: index,
            perfis_id: perfil.id
          }))
        );

      if (error) throw error;

      toast({
        title: "Imagens atualizadas com sucesso!",
        variant: "success",
      });

      // Recarrega os dados das imagens
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar imagens:', error);
      toast({
        title: "Erro ao salvar imagens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir imagem com confirmação
  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('produtos_imagens')
        .delete()
        .eq('id', imageId)
        .eq('perfis_id', perfil.id);

      if (error) throw error;

      toast({
        title: "Imagem excluída com sucesso!",
        variant: "success",
      });

      // Recarrega os dados das imagens
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast({
        title: "Erro ao excluir imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para reordenar imagens
  const handleReorderImages = async (reorderedImages: any[]) => {
    await handleSaveImages(reorderedImages);
  };

  // Função para atualizar a ordem das imagens
  const updateImageOrder = async (imagens: any[]) => {
    try {
      console.log('Atualizando ordem das imagens:', imagens);
      
      const updates = imagens.map((imagem, index) => ({
        id: imagem.id,
        ordem: index + 1,
        produtos_id: produtoId // Mantém o produtos_id
      }));

      console.log('Updates a serem enviados:', updates);

      const { data, error } = await supabase
        .from('prod_imagens')
        .upsert(updates, { 
          onConflict: 'id',
          returning: 'minimal' // Não precisa retornar os dados
        });

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Ordem das imagens atualizada",
      });
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error.message || error);
      toast({
        title: "Erro ao atualizar ordem",
        description: error.message || "Erro ao atualizar ordem das imagens",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setProduto((prev) => {
        const oldIndex = prev.imagens.findIndex((img) => img.id === active.id);
        const newIndex = prev.imagens.findIndex((img) => img.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) {
          console.error('Índices inválidos:', { oldIndex, newIndex, active, over });
          return prev;
        }
        
        const newImages = arrayMove(prev.imagens, oldIndex, newIndex);
        
        // Atualiza a ordem no banco de dados
        updateImageOrder(newImages);
        
        return {
          ...prev,
          imagens: newImages,
        };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `produtos/${produtoId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('produtos')
        .getPublicUrl(filePath);

      // Salvar na tabela prod_imagens
      const { error: dbError } = await supabase
        .from('prod_imagens')
        .insert({
          produtos_id: produtoId,
          url: publicUrl,
          nome: file.name,
          size: file.size,
        });

      if (dbError) throw dbError;

      // Recarregar dados
      loadData();
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sections = [
    {
      id: 'dadosBasicos',
      title: "Dados Básicos",
      icon: <Package2 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
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
        </div>
      )
    },
    {
      id: 'unidadesMedidas',
      title: "Unidades e Medidas",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
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
        </div>
      )
    },
    {
      id: 'estoqueControles',
      title: "Estoque e Controles",
      icon: <Lock className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
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
        </div>
      )
    },
    {
      id: 'variacoes',
      title: "Variações",
      icon: <Tags className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
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
        </div>
      )
    },
    {
      id: 'imagens',
      title: "Imagens",
      icon: <Camera className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <SortableContext 
                items={produto?.imagens?.map(img => img.id) || []}
                strategy={verticalListSortingStrategy}
              >
                {produto?.imagens && produto.imagens.length > 0 ? (
                  produto.imagens.map((imagem: any) => (
                    <SortableImageItem 
                      key={imagem.id} 
                      imagem={imagem}
                      onDelete={() => setDeleteImageId(imagem.id)}
                      onZoom={() => setSelectedImage(imagem.url)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground">
                    Nenhuma imagem cadastrada
                  </div>
                )}
              </SortableContext>
            </div>
          </DndContext>
            
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button variant="outline" type="button">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Imagem
              </Button>
            </label>
          </div>
        </div>
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

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <DialogContent>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <p>Tem certeza que deseja excluir esta imagem?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteImageId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteImage(deleteImageId!)}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de zoom */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Visualizar Imagem</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video">
              <img
                src={selectedImage}
                alt="Imagem em tamanho grande"
                className="object-contain w-full h-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ProdutoEditSheet>
  )
}

// Componente para item arrastável
const SortableImageItem = ({ imagem, onDelete, onZoom }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: imagem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group aspect-square rounded-lg overflow-hidden border bg-slate-50 cursor-move"
    >
      <img
        src={imagem.url}
        alt={imagem.nome}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
          onClick={onZoom}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
        <p className="text-xs text-white truncate text-center">
          {imagem.nome}
        </p>
      </div>
    </div>
  );
};
