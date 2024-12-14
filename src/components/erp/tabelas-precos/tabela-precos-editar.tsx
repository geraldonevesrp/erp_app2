"use client"

import { useCallback, useEffect, useState } from "react"
import { useSupabase } from "@/contexts/supabase"
import { toast } from "sonner"
import { NumericFormat } from "react-number-format"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TabelaPrecosEditar {
  open: boolean
  setOpen: (open: boolean) => void
  tabelaId?: number
}

export function TabelaPrecosEditar({ open, setOpen, tabelaId }: TabelaPrecosEditar) {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [itens, setItens] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 20

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
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order('id', { ascending: true })

      if (error) throw error
      setItens(data || [])
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
      toast.error("Erro ao carregar itens")
    } finally {
      setLoading(false)
    }
  }, [tabelaId, page, itemsPerPage, supabase])

  const handleUpdateItem = useCallback(async (id: number, field: string, value: number) => {
    try {
      const { error } = await supabase
        .from("tabelas_precos_itens")
        .update({ [field]: value })
        .eq("id", id)

      if (error) throw error

      setItens(prevItens =>
        prevItens.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error("Erro ao atualizar item")
    }
  }, [supabase])

  useEffect(() => {
    if (open && tabelaId) {
      loadItens()
    }
  }, [open, tabelaId, loadItens])

  const renderNumericCell = (value: number, id: number, field: string, isPercentage = false) => (
    <NumericFormat
      value={value}
      onValueChange={({ floatValue }) => handleUpdateItem(id, field, floatValue || 0)}
      displayType="input"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix={isPercentage ? undefined : "R$ "}
      suffix={isPercentage ? " %" : undefined}
      className="w-full text-right bg-transparent border-none focus:ring-1 focus:ring-primary"
    />
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent 
        side="right" 
        className="w-full p-0 sm:max-w-none"
        style={{
          width: '100%',
          maxWidth: 'calc(100vw - 16rem)'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <SheetTitle className="text-lg font-semibold">Editar Tabela</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button>
                Salvar
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Nome Tabela</TableHead>
                    <TableHead className="text-right w-[100px]">Custo</TableHead>
                    <TableHead className="text-right w-[100px]">Margem Lucro</TableHead>
                    <TableHead className="text-right w-[100px]">Margem Lucro %</TableHead>
                    <TableHead className="text-right w-[80px]">Frete</TableHead>
                    <TableHead className="text-right w-[80px]">Frete %</TableHead>
                    <TableHead className="text-right w-[80px]">IPI</TableHead>
                    <TableHead className="text-right w-[80px]">IPI %</TableHead>
                    <TableHead className="text-right w-[80px]">ICMS ST</TableHead>
                    <TableHead className="text-right w-[80px]">ICMS ST %</TableHead>
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

            <div className="border-t p-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Mostrando {((page - 1) * itemsPerPage) + 1} até {Math.min(page * itemsPerPage, totalItems)} de {totalItems} itens
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
                    disabled={page * itemsPerPage >= totalItems}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
