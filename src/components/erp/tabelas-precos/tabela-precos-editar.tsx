"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { useSupabase } from "@/contexts/supabase"
import { toast } from "sonner"
import { NumericFormat } from "react-number-format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clsx } from "clsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Search } from "lucide-react"
import { useHeader } from '@/contexts/header-context'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TabelaPrecosEditar {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabelaId?: number
  loadTabelas: () => void
}

interface TabelaPrecoItem {
  id: number
  tabelas_precos_id: number
  custo: number
  margem_lucro: number
  margem_lucro_p: number
  preco: number
  frete: number
  frete_p: number
  ipi: number
  ipi_p: number
  icms_st: number
  icms_st_p: number
  produto?: {
    nome: string
    cod_sequencial: string
    sub_codigo_sequencial: string
    cod_barras: string
  }
}

interface EditableNumericCellProps {
  value: number
  id: number
  field: string
  isPercentage?: boolean
  onUpdate: (id: number, field: string, value: number) => Promise<void>
  isUpdating: boolean
  className?: string
}

const EditableNumericCell = ({
  value,
  id,
  field,
  isPercentage,
  onUpdate,
  isUpdating,
  className,
}: EditableNumericCellProps) => {
  return (
    <NumericFormat
      value={value}
      displayType="input"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      suffix={isPercentage ? " %" : ""}
      prefix={!isPercentage ? "R$ " : ""}
      placeholder="0,00"
      className={clsx(
        "w-full text-right",
        "border border-input dark:border-slate-700 rounded-md px-2 py-1",
        "bg-white dark:bg-slate-900",
        "hover:bg-gray-50 dark:hover:bg-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        isUpdating && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isUpdating}
      onValueChange={(values) => {
        if (!isUpdating) {
          onUpdate(id, field, values.floatValue || 0)
        }
      }}
    />
  )
}

const ReadOnlyNumericCell = ({ value, isPercentage }: { value: number, isPercentage?: boolean }) => {
  return (
    <NumericFormat
      value={value}
      displayType="input"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      suffix={isPercentage ? " %" : ""}
      prefix={!isPercentage ? "R$ " : ""}
      placeholder="0,00"
      className={clsx(
        "w-full text-right",
        "border border-input dark:border-slate-700 rounded-md px-2 py-1",
        "bg-gray-100 dark:bg-slate-800",
        "cursor-not-allowed"
      )}
      disabled
      readOnly
    />
  )
}

export function TabelaPrecosEditar({
  open,
  onOpenChange,
  tabelaId,
  loadTabelas
}: TabelaPrecosEditar) {
  const { supabase } = useSupabase()
  const { setTitle, setSubtitle } = useHeader()
  const [loading, setLoading] = useState(false)
  const [itens, setItens] = useState<TabelaPrecoItem[]>([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [updatingFields, setUpdatingFields] = useState<Record<string, boolean>>({})
  const [tabelaNome, setTabelaNome] = useState("")
  const [nomeOriginal, setNomeOriginal] = useState("")
  const [salvandoNome, setSalvandoNome] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setTitle('Comercial - Editar Tabela de Preços')
      setSubtitle('Edite os detalhes da tabela de preços.')
    }
  }, [open, setTitle, setSubtitle])

  // Filtra os itens baseado na busca
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return itens;
    
    const query = searchQuery.toLowerCase().trim();
    return itens.filter((item) => {
      const produto = item.produto;
      if (!produto) return false;
      
      return (
        String(produto.nome || '').toLowerCase().includes(query) ||
        String(produto.cod_sequencial || '').toLowerCase().includes(query) ||
        String(produto.sub_codigo_sequencial || '').toLowerCase().includes(query) ||
        String(produto.cod_barras || '').toLowerCase().includes(query)
      );
    });
  }, [itens, searchQuery]);

  // Função para atualizar o nome da tabela
  const handleSaveNome = async () => {
    if (tabelaNome === nomeOriginal) {
      return
    }

    try {
      setSalvandoNome(true)
      const { error } = await supabase
        .from("tabelas_precos")
        .update({ nome: tabelaNome })
        .eq("id", tabelaId)

      if (error) throw error

      setNomeOriginal(tabelaNome)
      toast.success("Nome da tabela atualizado com sucesso!")
      loadTabelas();
    } catch (error) {
      console.error("Erro ao atualizar nome da tabela:", error)
      setTabelaNome(nomeOriginal)
      toast.error("Erro ao atualizar nome da tabela")
    } finally {
      setSalvandoNome(false)
    }
  }

  const handleCancelarNome = () => {
    setTabelaNome(nomeOriginal)
  }

  const loadItens = useCallback(async () => {
    if (!tabelaId) return
    
    setLoading(true)
    try {
      const { count } = await supabase
        .from("tabelas_precos_itens")
        .select("*", { count: "exact", head: true })
        .eq("tabelas_precos_id", tabelaId)

      setTotalItems(count || 0)

      const { data, error } = await supabase
        .from("tabelas_precos_itens")
        .select(`
          id,
          tabelas_precos_id,
          custo,
          margem_lucro,
          margem_lucro_p,
          preco,
          frete,
          frete_p,
          ipi,
          ipi_p,
          icms_st,
          icms_st_p,
          produto:produtos(nome, cod_sequencial, sub_codigo_sequencial, cod_barras)
        `)
        .eq("tabelas_precos_id", tabelaId)
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('id', { ascending: true })

      if (error) throw error
      setItens(data || [])
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
      toast.error("Erro ao carregar itens")
    } finally {
      setLoading(false)
    }
  }, [tabelaId, page, pageSize, supabase])

  const handleUpdateItem = useCallback(async (id: number, field: string, value: number) => {
    // Marca o campo como atualizando
    setUpdatingFields(prev => ({ ...prev, [`${id}-${field}`]: true }))
    
    try {
      const { data, error } = await supabase
        .from("tabelas_precos_itens")
        .update({ [field]: value })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Atualiza o item com todos os valores calculados pelo trigger
      if (data) {
        setItens(prevItens =>
          prevItens.map(item =>
            item.id === id ? { ...item, ...data } : item
          )
        )
        toast.success("Item atualizado com sucesso")
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error("Erro ao atualizar item")
      
      // Em caso de erro, reverte o valor no estado local
      setItens(prevItens =>
        prevItens.map(item =>
          item.id === id ? { ...item } : item
        )
      )
    } finally {
      // Remove o estado de atualização
      setUpdatingFields(prev => {
        const newState = { ...prev }
        delete newState[`${id}-${field}`]
        return newState
      })
    }
  }, [supabase])

  const renderNumericCell = (value: number, id: number, field: string, isPercentage = false) => {
    const isUpdating = updatingFields[`${id}-${field}`]
    return (
      <EditableNumericCell
        value={value}
        id={id}
        field={field}
        isPercentage={isPercentage}
        onUpdate={handleUpdateItem}
        isUpdating={isUpdating}
      />
    )
  }

  useEffect(() => {
    const fetchTabelaPreco = async () => {
      try {
        const { data, error } = await supabase
          .from("tabelas_precos")
          .select("nome")
          .eq("id", tabelaId)
          .single()

        if (error) throw error
        if (data) {
          setTabelaNome(data.nome || "")
          setNomeOriginal(data.nome || "")
        }
      } catch (error) {
        console.error("Erro ao carregar nome da tabela:", error)
        toast.error("Erro ao carregar nome da tabela")
      }
    }

    if (open && tabelaId) {
      fetchTabelaPreco()
      loadItens()
    }
  }, [open, tabelaId, supabase, loadItens])

  return (
    <div
      className={cn(
        "fixed top-16 bottom-0 right-0 z-50 flex flex-col border-l",
        "transition-transform duration-300 ease-in-out",
        "bg-background dark:bg-gray-800",
        "dark:border-slate-800",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{
        width: '100%',
        maxWidth: 'calc(100vw - 16rem)'
      }}
    >
      <div className="h-14 border-b flex items-center px-6 flex-none bg-background dark:bg-gray-800">
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-foreground dark:text-white">Nome:</Label>
          <Input
            value={tabelaNome}
            onChange={(e) => setTabelaNome(e.target.value)}
            className="w-[300px] bg-white dark:bg-slate-900 dark:text-white"
            placeholder="Nome da tabela"
            disabled={salvandoNome}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleCancelarNome}
              disabled={salvandoNome || tabelaNome === nomeOriginal}
              size="sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNome}
              disabled={salvandoNome || tabelaNome === nomeOriginal}
              size="sm"
            >
              {salvandoNome ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <div className="mb-4 sticky top-0 bg-background dark:bg-gray-800 z-10">
          <Label htmlFor="search" className="text-foreground dark:text-white">Buscar Produto</Label>
          <Input
            id="search"
            placeholder="Digite o nome ou código do produto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100vh-280px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center min-w-[300px]">Produto</TableHead>
                <TableHead className="text-center min-w-[120px]">Custo</TableHead>
                <TableHead className="text-center min-w-[120px]">Custo Total</TableHead>
                <TableHead className="text-center min-w-[120px]">Margem Lucro</TableHead>
                <TableHead className="text-center min-w-[120px]">Margem Lucro %</TableHead>
                <TableHead className="text-center min-w-[120px]">Frete</TableHead>
                <TableHead className="text-center min-w-[120px]">Frete %</TableHead>
                <TableHead className="text-center min-w-[120px]">IPI</TableHead>
                <TableHead className="text-center min-w-[120px]">IPI %</TableHead>
                <TableHead className="text-center min-w-[120px]">ICMS ST</TableHead>
                <TableHead className="text-center min-w-[120px]">ICMS ST %</TableHead>
                <TableHead className="text-center min-w-[120px]">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado para a busca realizada
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>  
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.produto?.nome}</span>
                        <div className="text-sm text-muted-foreground">
                          <div>Cód: {item.produto?.cod_sequencial}</div>
                          {item.produto?.sub_codigo_sequencial && (
                            <div>Sub-cód: {item.produto?.sub_codigo_sequencial}</div>
                          )}
                          {item.produto?.cod_barras && (
                            <div>Cód. Barras: {item.produto?.cod_barras}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.custo, item.id, "custo")}
                    </TableCell>
                    <TableCell className="text-right">
                      <ReadOnlyNumericCell value={item.custo} />
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.margem_lucro, item.id, "margem_lucro")}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.margem_lucro_p, item.id, "margem_lucro_p", true)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.frete, item.id, "frete")}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.frete_p, item.id, "frete_p", true)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.ipi, item.id, "ipi")}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.ipi_p, item.id, "ipi_p", true)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.icms_st, item.id, "icms_st")}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderNumericCell(item.icms_st_p, item.id, "icms_st_p", true)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="relative group">
                        <NumericFormat
                          value={item.preco}
                          displayType="input"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="R$ "
                          placeholder="0,00"
                          className={clsx(
                            "w-full text-right",
                            "border-2 border-green-500 dark:border-green-600 rounded-md px-2 py-1",
                            "bg-gray-100 dark:bg-slate-800",
                            "cursor-not-allowed"
                          )}
                          disabled
                          readOnly
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="border-t p-4 bg-background dark:bg-gray-800">
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {(page - 1) * pageSize + 1} até {Math.min(page * pageSize, totalItems)} de {totalItems} itens
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Registros por página</p>
              <Select
                value={pageSize === totalItems ? 'all' : pageSize.toString()}
                onValueChange={(value) => {
                  const newSize = value === 'all' ? totalItems : Number(value);
                  setPageSize(newSize);
                  setPage(1); // Reset to first page when changing page size
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue>
                    {pageSize === totalItems ? 'Todos' : pageSize}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50, 100, 300, 500, 1000].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                  <SelectItem key="all" value="all">
                    Todos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Ir para primeira página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Ir para página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Página {page} de {Math.ceil(totalItems / pageSize)}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= totalItems}
              >
                <span className="sr-only">Ir para próxima página</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(Math.ceil(totalItems / pageSize))}
                disabled={page * pageSize >= totalItems}
              >
                <span className="sr-only">Ir para última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
