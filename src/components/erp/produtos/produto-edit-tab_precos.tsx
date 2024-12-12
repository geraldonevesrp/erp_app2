"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { NumericFormat } from "react-number-format"

interface ProdutoEditTabPrecosProps {
  produto: any
  setProduto: (produto: any) => void
}

interface TabelaPrecoItem {
  id: number
  tabelas_precos_id: number
  produtos_id: number
  custo: number
  custo_total: number
  margem_lucro: number
  margem_lucro_p: number
  preco: number
  frete: number
  frete_p: number
  ipi: number
  ipi_p: number
  icms_st: number
  icms_st_p: number
  icms: number
  icms_p: number
  fcp_st: number
  fcp_st_p: number
  seguro: number
  seguro_p: number
  despesas: number
  despesas_p: number
}

const inputStyles = `
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`

interface CurrencyInputProps {
  value: number
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

interface PercentageInputProps {
  value: number
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const CurrencyInput = ({ value, onChange, ...props }: CurrencyInputProps) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={({ floatValue }) => {
        onChange(floatValue?.toString() || "0")
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      customInput={Input}
      {...props}
    />
  )
}

const PercentageInput = ({ value, onChange, ...props }: PercentageInputProps) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={({ floatValue }) => {
        onChange(floatValue?.toString() || "0")
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      customInput={Input}
      {...props}
    />
  )
}

export function ProdutoEditTabPrecos({ produto }: ProdutoEditTabPrecosProps) {
  const [tabelasPrecos, setTabelasPrecos] = useState<any[]>([])
  const [tabelasPrecosItens, setTabelasPrecosItens] = useState<TabelaPrecoItem[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const loadTabelasPrecos = async () => {
      try {
        setLoading(true)
        
        const { data: tabelasData, error: tabelasError } = await supabase
          .from("tabelas_precos")
          .select("*")
          .order("padrao", { ascending: false })

        if (tabelasError) throw tabelasError

        const { data: itensData, error: itensError } = await supabase
          .from("tabelas_precos_itens")
          .select("*")
          .eq("produtos_id", produto.id)

        if (itensError) throw itensError

        setTabelasPrecos(tabelasData || [])
        setTabelasPrecosItens(itensData || [])

      } catch (error: any) {
        toast({
          title: "Erro ao carregar tabelas de preços",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (produto?.id) {
      loadTabelasPrecos()
    }
  }, [produto?.id, supabase, toast])

  const handleUpdateItem = async (tabelaId: number, field: string, value: string) => {
    try {
      const numericValue = parseFloat(value) || 0
      const item = tabelasPrecosItens.find(item => item.tabelas_precos_id === tabelaId)
      
      if (!item) {
        const { data, error } = await supabase
          .from("tabelas_precos_itens")
          .insert({
            tabelas_precos_id: tabelaId,
            produtos_id: produto.id,
            [field]: numericValue
          })
          .select()
          .single()

        if (error) throw error
        
        setTabelasPrecosItens(prev => [...prev, data])
      } else {
        const { data, error } = await supabase
          .from("tabelas_precos_itens")
          .update({ [field]: numericValue })
          .eq("id", item.id)
          .select()
          .single()

        if (error) throw error

        setTabelasPrecosItens(prev => 
          prev.map(i => i.id === item.id ? data : i)
        )
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar preço",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getItemValue = (tabelaId: number, field: string) => {
    const item = tabelasPrecosItens.find(item => item.tabelas_precos_id === tabelaId)
    return item ? item[field as keyof TabelaPrecoItem] : 0
  }

  return (
    <div className="space-y-6">
      {tabelasPrecos.map(tabela => (
        <div key={tabela.id} className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            {tabela.nome}
            {tabela.padrao && (
              <span className="ml-2 text-sm text-blue-600">(Padrão)</span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custos Básicos */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Custo sem acréscimos</Label>
                  <CurrencyInput
                    value={getItemValue(tabela.id, "custo")}
                    onChange={(value) => handleUpdateItem(tabela.id, "custo", value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>Custo com acréscimos</Label>
                  <CurrencyInput
                    value={getItemValue(tabela.id, "custo_total")}
                    onChange={(value) => handleUpdateItem(tabela.id, "custo_total", value)}
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Margem de Lucro R$</Label>
                  <CurrencyInput
                    value={getItemValue(tabela.id, "margem_lucro")}
                    onChange={(value) => handleUpdateItem(tabela.id, "margem_lucro", value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>Margem de Lucro %</Label>
                  <PercentageInput
                    value={getItemValue(tabela.id, "margem_lucro_p")}
                    onChange={(value) => handleUpdateItem(tabela.id, "margem_lucro_p", value)}
                  />
                </div>
              </div>

              <div>
                <Label>Preço de venda</Label>
                <CurrencyInput
                  value={getItemValue(tabela.id, "preco")}
                  onChange={(value) => handleUpdateItem(tabela.id, "preco", value)}
                  className="bg-green-50"
                />
              </div>
            </div>

            {/* Impostos e Despesas */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Frete</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "frete")}
                      onChange={(value) => handleUpdateItem(tabela.id, "frete", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "frete_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "frete_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>IPI</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "ipi")}
                      onChange={(value) => handleUpdateItem(tabela.id, "ipi", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "ipi_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "ipi_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>ICMS ST</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "icms_st")}
                      onChange={(value) => handleUpdateItem(tabela.id, "icms_st", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "icms_st_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "icms_st_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>ICMS</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "icms")}
                      onChange={(value) => handleUpdateItem(tabela.id, "icms", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "icms_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "icms_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>FCP ST</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "fcp_st")}
                      onChange={(value) => handleUpdateItem(tabela.id, "fcp_st", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "fcp_st_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "fcp_st_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>Seguro</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "seguro")}
                      onChange={(value) => handleUpdateItem(tabela.id, "seguro", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "seguro_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "seguro_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>

                <div>
                  <Label>Despesas Operacionais</Label>
                  <div className="flex gap-2">
                    <CurrencyInput
                      value={getItemValue(tabela.id, "despesas")}
                      onChange={(value) => handleUpdateItem(tabela.id, "despesas", value)}
                    />
                    <PercentageInput
                      value={getItemValue(tabela.id, "despesas_p")}
                      onChange={(value) => handleUpdateItem(tabela.id, "despesas_p", value)}
                      className="w-20"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
