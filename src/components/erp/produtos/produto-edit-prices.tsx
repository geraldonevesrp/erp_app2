"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProdutoEditPricesProps {
  produto: any
  setProduto: (produto: any) => void
}

export function ProdutoEditPrices({
  produto,
  setProduto
}: ProdutoEditPricesProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Preço de Custo <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            step="0.01"
            value={produto?.preco_custo || ""}
            onChange={(e) => setProduto(prev => ({ ...prev, preco_custo: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Preço de Venda <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            step="0.01"
            value={produto?.preco_venda || ""}
            onChange={(e) => setProduto(prev => ({ ...prev, preco_venda: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Margem de Lucro (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={produto?.margem_lucro || ""}
            onChange={(e) => setProduto(prev => ({ ...prev, margem_lucro: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Preço Promocional</Label>
          <Input
            type="number"
            step="0.01"
            value={produto?.preco_promocional || ""}
            onChange={(e) => setProduto(prev => ({ ...prev, preco_promocional: e.target.value }))}
          />
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={produto?.promocao_ativa || false}
              onCheckedChange={(checked) => setProduto(prev => ({ ...prev, promocao_ativa: checked }))}
            />
            <Label>Promoção Ativa</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={produto?.preco_variavel || false}
              onCheckedChange={(checked) => setProduto(prev => ({ ...prev, preco_variavel: checked }))}
            />
            <Label>Preço Variável</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
