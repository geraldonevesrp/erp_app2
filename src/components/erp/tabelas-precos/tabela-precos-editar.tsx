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

const EditableNumericCell = ({ value, id, field, isPercentage, onUpdate, isUpdating, className }: EditableNumericCellProps) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative group">
      <NumericFormat
        value={localValue}
        onValueChange={({ floatValue }) => setLocalValue(floatValue || 0)}
        onBlur={() => {
          if (localValue !== value) {
            onUpdate(id, field, localValue)
          }
        }}
        displayType="input"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        prefix={isPercentage ? undefined : "R$ "}
        suffix={isPercentage ? " %" : undefined}
        placeholder="0,00"
        className={clsx(
          "w-full text-right",
          "border border-input rounded-md px-2 py-1",
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
          "hover:border-primary transition-colors",
          isUpdating && "opacity-50 cursor-not-allowed",
          "bg-background",
          className
        )}
        disabled={isUpdating}
      />
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}

const ReadOnlyNumericCell = ({ value, isPercentage }: { value: number, isPercentage?: boolean }) => {
  return (
    <div className="relative group">
      <NumericFormat
        value={value}
        displayType="input"
        thousandSeparator="."
        decimalSeparator=","  
        decimalScale={2}
        fixedDecimalScale  
        prefix={isPercentage ? undefined : "R$ "}
        suffix={isPercentage ? " %" : undefined}
        placeholder="0,00"
        className={clsx(
          "w-full text-right",
          "border border-input rounded-md px-2 py-1",
          "bg-gray-100 dark:bg-gray-600",  
          "cursor-not-allowed"
        )}
        disabled
        readOnly
      />
    </div>
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
        .range((page - 1) * 20, page * 20 - 1)
        .order('id', { ascending: true })

      if (error) throw error
      setItens(data || [])
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
      toast.error("Erro ao carregar itens")
    } finally {
      setLoading(false)
    }
  }, [tabelaId, page, supabase])

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

  const renderNumericCell = (value: number, id: number, field: string, isPercentage = false, className?: string) => {
    const isUpdating = updatingFields[`${id}-${field}`]
    return (
      <EditableNumericCell
        value={value}
        id={id}
        field={field}
        isPercentage={isPercentage}
        onUpdate={handleUpdateItem}
        isUpdating={isUpdating}
        className={className}
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
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:border-slate-800",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{
        width: '100%',
        maxWidth: 'calc(100vw - 16rem)'
      }}
    >
      <div className="h-14 border-b flex items-center px-6 flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <Label>Nome:</Label>
          <Input
            value={tabelaNome}
            onChange={(e) => setTabelaNome(e.target.value)}
            className="w-[300px]"
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
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Buscar por nome, código ou código de barras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[300px]">Produto</TableHead>
              <TableHead className="text-right min-w-[120px]">Custo</TableHead>
              <TableHead className="text-right min-w-[120px]">Custo Total</TableHead>
              <TableHead className="text-right min-w-[120px]">Margem Lucro</TableHead>
              <TableHead className="text-right min-w-[120px]">Margem Lucro %</TableHead>
              <TableHead className="text-right min-w-[120px]">Frete</TableHead>
              <TableHead className="text-right min-w-[120px]">Frete %</TableHead>
              <TableHead className="text-right min-w-[120px]">IPI</TableHead>
              <TableHead className="text-right min-w-[120px]">IPI %</TableHead>
              <TableHead className="text-right min-w-[120px]">ICMS ST</TableHead>
              <TableHead className="text-right min-w-[120px]">ICMS ST %</TableHead>
              <TableHead className="text-right min-w-[120px]">Preço</TableHead>
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
                    {renderNumericCell(item.custo, item.id, 'custo')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative group">
                      <NumericFormat
                        value={item.custo}
                        displayType="input"
                        thousandSeparator="."
                        decimalSeparator=","  
                        decimalScale={2}
                        fixedDecimalScale  
                        prefix="R$ "
                        placeholder="0,00"
                        className={clsx(
                          "w-full text-right",
                          "border border-input rounded-md px-2 py-1",
                          "bg-gray-100 dark:bg-gray-600",  
                          "cursor-not-allowed"
                        )}
                        disabled
                        readOnly
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.margem_lucro, item.id, 'margem_lucro')}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.margem_lucro_p, item.id, 'margem_lucro_p', true)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.frete, item.id, 'frete')}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.frete_p, item.id, 'frete_p', true)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.ipi, item.id, 'ipi')}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.ipi_p, item.id, 'ipi_p', true)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.icms_st, item.id, 'icms_st')}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderNumericCell(item.icms_st_p, item.id, 'icms_st_p', true)}
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
                          "border-2 border-green-500 rounded-md px-2 py-1",
                          "bg-gray-100 dark:bg-gray-600",  
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
      <div className="border-t p-4 bg-white">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * 20) + 1} até {Math.min(page * 20, totalItems)} de {totalItems} itens
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= totalItems}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
