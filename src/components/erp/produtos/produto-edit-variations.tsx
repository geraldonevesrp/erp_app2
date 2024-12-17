"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2 } from "lucide-react"
import { TagInput } from "@/components/ui/tag-input"

interface ProdutoEditVariationsProps {
  produto: any
  setProduto: (produto: any) => void
  onProdutoChange?: (field: string, value: any) => void
}

export function ProdutoEditVariations({
  produto,
  setProduto,
  onProdutoChange
}: ProdutoEditVariationsProps) {
  const supabase = createClientComponentClient()
  const [variacoes1, setVariacoes1] = useState<string[]>([])
  const [variacoes2, setVariacoes2] = useState<string[]>([])
  const [gradeItems, setGradeItems] = useState<any[]>([])
  const [isGrade, setIsGrade] = useState(produto?.prod_tipos_id === 2)

  // Carrega as variações existentes
  useEffect(() => {
    const loadVariacoes = async () => {
      const { data: var1 } = await supabase
        .from('prod_variacao1')
        .select('nome')
        .eq('produtos_id', produto.id)
      
      const { data: var2 } = await supabase
        .from('prod_variacao2')
        .select('nome')
        .eq('produtos_id', produto.id)

      setVariacoes1(var1?.map(v => v.nome) || [])
      setVariacoes2(var2?.map(v => v.nome) || [])
    }

    if (produto?.id) {
      loadVariacoes()
    }
  }, [produto?.id])

  // Carrega os itens da grade
  useEffect(() => {
    const loadGradeItems = async () => {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('grade_de', produto.id)
      
      setGradeItems(data || [])
    }

    if (produto?.id && produto?.prod_tipos_id === 2) {
      loadGradeItems()
    }
  }, [produto?.id, produto?.prod_tipos_id])

  // Altera o tipo do produto entre Simples e Grade
  const handleGradeChange = async (checked: boolean) => {
    const newTipoId = checked ? 2 : 1
    
    if (onProdutoChange) {
      onProdutoChange('prod_tipos_id', newTipoId)
    } else {
      setProduto(prev => ({ ...prev, prod_tipos_id: newTipoId }))
    }
    
    setIsGrade(checked)
  }

  // Funções para gerenciar as variações
  const handleCreateVariacao1 = async (nome: string) => {
    const { data, error } = await supabase
      .from('prod_variacao1')
      .insert([{ produtos_id: produto.id, nome }])
      .select()
      .single()

    if (data) {
      // Não atualiza o campo variacao1 do produto
      // Apenas adiciona à lista de variações
      setVariacoes1(prev => [...prev, nome])
    }
  }

  const handleCreateVariacao2 = async (nome: string) => {
    const { data, error } = await supabase
      .from('prod_variacao2')
      .insert([{ produtos_id: produto.id, nome }])
      .select()
      .single()

    if (data) {
      // Não atualiza o campo variacao2 do produto
      // Apenas adiciona à lista de variações
      setVariacoes2(prev => [...prev, nome])
    }
  }

  const handleRemoveVariacao1 = async (nome: string) => {
    await supabase
      .from('prod_variacao1')
      .delete()
      .eq('produtos_id', produto.id)
      .eq('nome', nome)
    
    setVariacoes1(prev => prev.filter(v => v !== nome))
  }

  const handleRemoveVariacao2 = async (nome: string) => {
    await supabase
      .from('prod_variacao2')
      .delete()
      .eq('produtos_id', produto.id)
      .eq('nome', nome)
    
    setVariacoes2(prev => prev.filter(v => v !== nome))
  }

  // Gera os itens da grade
  const handleGerarGrade = async () => {
    if (!produto.variacao1 || !variacoes1.length || 
        !produto.variacao2 || !variacoes2.length) {
      return
    }

    const { data, error } = await supabase
      .rpc('criar_itens_grade', {
        produto_grade_id: produto.id
      })

    if (!error) {
      // Recarrega os itens da grade
      const { data: newItems } = await supabase
        .from('produtos')
        .select('*')
        .eq('grade_de', produto.id)
      
      setGradeItems(newItems || [])
    }
  }

  // Verifica se pode gerar a grade
  const canGenerateGrid = produto?.variacao1 && variacoes1.length > 0 && 
                         produto?.variacao2 && variacoes2.length > 0

  // Só exibe se for produto Simples ou Grade
  if (produto?.prod_tipos_id !== 1 && produto?.prod_tipos_id !== 2) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={isGrade}
          onCheckedChange={handleGradeChange}
        />
        <Label>Produto com Variações</Label>
      </div>

      {isGrade && (
        <>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={produto?.variacao1 || ""}
                onChange={(e) => {
                  if (onProdutoChange) {
                    onProdutoChange('variacao1', e.target.value)
                  } else {
                    setProduto(prev => ({ ...prev, variacao1: e.target.value }))
                  }
                }}
                placeholder="Descrição (Ex: COR)"
                className="w-[200px]"
              />
              <TagInput
                value={variacoes1}
                onChange={setVariacoes1}
                onTagCreate={handleCreateVariacao1}
                onTagRemove={handleRemoveVariacao1}
                placeholder="Digite e pressione Enter para adicionar"
                className="flex-1"
              />
            </div>

            <div className="flex gap-2">
              <Input
                value={produto?.variacao2 || ""}
                onChange={(e) => {
                  if (onProdutoChange) {
                    onProdutoChange('variacao2', e.target.value)
                  } else {
                    setProduto(prev => ({ ...prev, variacao2: e.target.value }))
                  }
                }}
                placeholder="Descrição (Ex: TAMANHO)"
                className="w-[200px]"
              />
              <TagInput
                value={variacoes2}
                onChange={setVariacoes2}
                onTagCreate={handleCreateVariacao2}
                onTagRemove={handleRemoveVariacao2}
                placeholder="Digite e pressione Enter para adicionar"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleGerarGrade}
              disabled={!canGenerateGrid}
            >
              Gerar Grade
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variação</TableHead>
                  <TableHead>Código Barras</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.cod_barras}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.preco_venda}</TableCell>
                    <TableCell>{item.estoque_atual}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
