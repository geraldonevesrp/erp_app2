"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2 } from "lucide-react"

interface ProdutoEditVariationsProps {
  produto: any
  setProduto: (produto: any) => void
}

export function ProdutoEditVariations({
  produto,
  setProduto
}: ProdutoEditVariationsProps) {
  const handleAddVariacao = () => {
    setProduto(prev => ({
      ...prev,
      variacoes: [
        ...(prev.variacoes || []),
        {
          id: Date.now(),
          nome: "",
          sku: "",
          codigo_barras: "",
          preco_custo: "",
          preco_venda: "",
          ativo: true
        }
      ]
    }))
  }

  const handleRemoveVariacao = (index: number) => {
    setProduto(prev => ({
      ...prev,
      variacoes: prev.variacoes.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleVariacaoChange = (index: number, field: string, value: any) => {
    setProduto(prev => ({
      ...prev,
      variacoes: prev.variacoes.map((variacao: any, i: number) =>
        i === index ? { ...variacao, [field]: value } : variacao
      )
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            checked={produto?.tem_variacoes || false}
            onCheckedChange={(checked) => setProduto(prev => ({ ...prev, tem_variacoes: checked }))}
          />
          <Label>Produto com Variações</Label>
        </div>
        {produto?.tem_variacoes && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddVariacao}
          >
            Adicionar Variação
          </Button>
        )}
      </div>

      {produto?.tem_variacoes && produto?.variacoes?.map((variacao: any, index: number) => (
        <div key={variacao.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Variação {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveVariacao(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={variacao.nome || ""}
                onChange={(e) => handleVariacaoChange(index, "nome", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={variacao.sku || ""}
                onChange={(e) => handleVariacaoChange(index, "sku", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Código de Barras</Label>
              <Input
                value={variacao.codigo_barras || ""}
                onChange={(e) => handleVariacaoChange(index, "codigo_barras", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Preço de Custo</Label>
              <Input
                type="number"
                step="0.01"
                value={variacao.preco_custo || ""}
                onChange={(e) => handleVariacaoChange(index, "preco_custo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Preço de Venda</Label>
              <Input
                type="number"
                step="0.01"
                value={variacao.preco_venda || ""}
                onChange={(e) => handleVariacaoChange(index, "preco_venda", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={variacao.ativo || false}
                onCheckedChange={(checked) => handleVariacaoChange(index, "ativo", checked)}
              />
              <Label>Ativo</Label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
