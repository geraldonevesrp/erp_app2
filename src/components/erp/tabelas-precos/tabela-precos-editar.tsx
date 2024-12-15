"use client"

import { useCallback, useEffect, useState } from "react"
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

interface TabelaPrecosEditar {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabelaId?: number
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
  tabela?: {
    nome: string
  }
}

interface EditableNumericCellProps {
  value: number
  id: number
  field: string
  isPercentage?: boolean
  onUpdate: (id: number, field: string, value: number) => Promise<void>
  isUpdating: boolean
}

const EditableNumericCell = ({ value, id, field, isPercentage, onUpdate, isUpdating }: EditableNumericCellProps) => {
  const [localValue, setLocalValue] = useState(value)

  // Atualiza o valor local quando o valor da prop muda
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
        placeholder="Clique para editar"
        className={clsx(
          "w-full text-right bg-transparent",
          "border border-transparent hover:border-input rounded-sm px-2",
          "focus:ring-1 focus:ring-primary focus:border-primary transition-all",
          "hover:bg-muted/50 cursor-text",
          isUpdating && "opacity-50"
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

export function TabelaPrecosEditar({
  open,
  onOpenChange,
  tabelaId
}: TabelaPrecosEditar) {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [itens, setItens] = useState<TabelaPrecoItem[]>([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [updatingFields, setUpdatingFields] = useState<Record<string, boolean>>({})
  const [tabelaNome, setTabelaNome] = useState("")
  const [nomeOriginal, setNomeOriginal] = useState("")
  const [salvandoNome, setSalvandoNome] = useState(false)

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
          tabela:tabelas_precos(nome)
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
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:border-slate-800",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{
        width: '100%',
        maxWidth: 'calc(100vw - 16rem)'
      }}
    >
      <div className="h-16 border-b flex items-center px-8 flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-slate-800">
        <div className="flex items-center gap-3 flex-1">
          <Label className="text-sm font-medium">Nome:</Label>
          <Input
            value={tabelaNome}
            onChange={(e) => setTabelaNome(e.target.value)}
            className="w-[300px]"
            placeholder="Nome da tabela"
            disabled={salvandoNome}
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Nome Tabela</TableHead>
              <TableHead className="text-right w-[100px] group">
                Custo
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[100px] group">
                Margem Lucro
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[100px] group">
                Margem Lucro %
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                Frete
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                Frete %
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                IPI
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                IPI %
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                ICMS ST
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[80px] group">
                ICMS ST %
                <span className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100">(editável)</span>
              </TableHead>
              <TableHead className="text-right w-[100px]">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.tabela?.nome}</TableCell>
                <TableCell>{renderNumericCell(item.custo, item.id, 'custo')}</TableCell>
                <TableCell>{renderNumericCell(item.margem_lucro, item.id, 'margem_lucro')}</TableCell>
                <TableCell>{renderNumericCell(item.margem_lucro_p, item.id, 'margem_lucro_p', true)}</TableCell>
                <TableCell>{renderNumericCell(item.frete, item.id, 'frete')}</TableCell>
                <TableCell>{renderNumericCell(item.frete_p, item.id, 'frete_p', true)}</TableCell>
                <TableCell>{renderNumericCell(item.ipi, item.id, 'ipi')}</TableCell>
                <TableCell>{renderNumericCell(item.ipi_p, item.id, 'ipi_p', true)}</TableCell>
                <TableCell>{renderNumericCell(item.icms_st, item.id, 'icms_st')}</TableCell>
                <TableCell>{renderNumericCell(item.icms_st_p, item.id, 'icms_st_p', true)}</TableCell>
                <TableCell className="text-right">
                  <NumericFormat
                    value={item.preco}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="R$ "
                  />
                </TableCell>
              </TableRow>
            ))}
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
