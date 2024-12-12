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

interface Produto {
  id?: number
  nome: string
  cod_barras?: string
  sku?: string
  ref_fornecedor?: string
  prod_tipos_id: number
  prod_generos_id?: number
  prod_categorias_id?: number
  prod_subcategorias_id?: number
  prod_marcas_id?: number
  ativo: boolean
  visivel_catalogo: boolean
}

interface ReferenceData {
  id: number
  [key: string]: any
}

interface ProdutoEditBasicProps {
  produto: Produto
  setProduto: (produto: Produto) => void
  validationErrors: { [key: string]: string }
  markFieldAsTouched: (field: string) => void
  isFieldInvalid: (field: string, value: any) => boolean
  tiposProduto: ReferenceData[]
  generosProduto: ReferenceData[]
  categorias: ReferenceData[]
  subcategorias: ReferenceData[]
  marcas: ReferenceData[]
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
      {/* Tag do Tipo no Card */}
      <div className="relative bg-white p-6 rounded-lg shadow-sm border">
        <div className="absolute top-2 right-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={produto?.ativo || false}
              onCheckedChange={(checked) => setProduto({ ...produto, ativo: checked })}
            />
            <Label>Ativo</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={produto?.visivel_catalogo || false}
              onCheckedChange={(checked) => setProduto({ ...produto, visivel_catalogo: checked })}
            />
            <Label>Visível no Catálogo</Label>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Tipo</span>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              {tiposProduto.find(tipo => tipo.id === produto?.prod_tipos_id)?.tipo}
            </span>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mt-12">
          {/* Identificação do Produto */}
          <div className="space-y-2">
            <Label>Nome {!produto?.nome && <span className="text-red-500">*</span>}</Label>
            <Input
              value={produto?.nome || ""}
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
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
              onChange={(e) => setProduto({ ...produto, cod_barras: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>SKU</Label>
            <Input
              value={produto?.sku || ""}
              onChange={(e) => setProduto({ ...produto, sku: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ref. Fornecedor</Label>
            <Input
              value={produto?.ref_fornecedor || ""}
              onChange={(e) => setProduto({ ...produto, ref_fornecedor: e.target.value })}
            />
          </div>

          {/* Classificação do Produto */}
          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select
              value={String(produto?.prod_generos_id || "")}
              onValueChange={(value) => setProduto({ ...produto, prod_generos_id: Number(value) })}
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
              onValueChange={(value) => {
                setProduto({ 
                  ...produto, 
                  prod_categorias_id: Number(value),
                  prod_subcategorias_id: undefined // Limpa subcategoria ao mudar categoria
                })
              }}
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
              onValueChange={(value) => setProduto({ ...produto, prod_subcategorias_id: Number(value) })}
              disabled={!produto?.prod_categorias_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={!produto?.prod_categorias_id ? "Selecione uma categoria" : "Selecione..."} />
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
              onValueChange={(value) => setProduto({ ...produto, prod_marcas_id: Number(value) })}
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
        </div>
      </div>
    </div>
  )
}
