"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProdutoEditUnitsProps {
  produto: any
  setProduto: (produto: any) => void
  unidadesMedida: any[]
}

export function ProdutoEditUnits({
  produto,
  setProduto,
  unidadesMedida
}: ProdutoEditUnitsProps) {
  return (
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
}
