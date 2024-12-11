"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProdutoEditStockProps {
  produto: any
  setProduto: (produto: any) => void
}

export function ProdutoEditStock({
  produto,
  setProduto
}: ProdutoEditStockProps) {
  return (
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
}
