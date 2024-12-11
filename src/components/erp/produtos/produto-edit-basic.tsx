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
import { Switch } from "@/components/ui/switch"

interface ProdutoEditBasicProps {
  produto: any
  setProduto: (produto: any) => void
  validationErrors: { [key: string]: string }
  markFieldAsTouched: (field: string) => void
  isFieldInvalid: (field: string, value: any) => boolean
  tiposProduto: any[]
  generosProduto: any[]
  categorias: any[]
  subcategorias: any[]
  marcas: any[]
}

export function ProdutoEditBasic({
  produto,
  setProduto,
  validationErrors,
  markFieldAsTouched,
  isFieldInvalid,
  tiposProduto,
  generosProduto,
  categorias,
  subcategorias,
  marcas
}: ProdutoEditBasicProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nome <span className="text-red-500">*</span></Label>
          <Input
            value={produto?.nome || ""}
            onChange={(e) => setProduto(prev => ({ ...prev, nome: e.target.value }))}
            onBlur={() => markFieldAsTouched("nome")}
            className={isFieldInvalid("nome", produto?.nome) ? "border-red-500" : ""}
          />
          {validationErrors.nome && (
            <div className="text-red-500 text-sm">{validationErrors.nome}</div>
          )}
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
}
