"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table } from "@tanstack/react-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Pessoa } from "@/types/pessoas"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilterSheetProps {
  table: Table<Pessoa>
}

export function FilterSheet({ table }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [tiposPessoas, setTiposPessoas] = useState<{value: string, label: string}[]>([])
  const [grupos, setGrupos] = useState<{value: string, label: string}[]>([])
  const [subGrupos, setSubGrupos] = useState<{value: string, label: string}[]>([])
  const [atividades, setAtividades] = useState<{value: string, label: string}[]>([])
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([])
  const [municipiosOptions, setMunicipiosOptions] = useState<{ label: string; value: string }[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchSubGrupos() {
      if (selectedGrupos.length > 0) {
        try {
          const { data: subGruposData, error: subGruposError } = await supabase
            .from('sub_grupos')
            .select('id, subgrupo')
            .in('grupos_id', selectedGrupos)
            .order('subgrupo')
          
          if (subGruposError) {
            console.error('Erro ao buscar subgrupos:', subGruposError)
            return
          }

          if (subGruposData) {
            setSubGrupos(subGruposData.map(sub => ({
              value: sub.id.toString(),
              label: sub.subgrupo || ''
            })))
          }
        } catch (error) {
          console.error('Erro ao buscar subgrupos:', error)
        }
      } else {
        setSubGrupos([])
      }
    }

    fetchSubGrupos()
  }, [selectedGrupos])

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar tipos de pessoas
        const { data: tiposData, error: tiposError } = await supabase
          .from('pessoas_tipos')
          .select('id, tipo')
          .order('tipo')
        
        if (tiposError) {
          console.error('Erro ao buscar tipos:', tiposError)
        }
        
        if (tiposData) {
          console.log('Tipos de pessoa carregados:', tiposData)
          setTiposPessoas(tiposData.map(tipo => ({
            value: tipo.id.toString(),
            label: tipo.tipo || ''
          })))
        }

        // Buscar grupos (apenas tipo 1 - grupos de pessoas)
        const { data: gruposData, error: gruposError } = await supabase
          .from('grupos')
          .select('id, grupo')
          .eq('tipo', 1)
          .order('grupo')
        
        if (gruposError) {
          console.error('Erro ao buscar grupos:', gruposError)
        }

        if (gruposData) {
          setGrupos(gruposData.map(grupo => ({
            value: grupo.id.toString(),
            label: grupo.grupo || ''
          })))
        }

        // Buscar atividades
        const { data: atividadesData, error: atividadesError } = await supabase
          .from('pessoas_atividades')
          .select('id, atividade')
          .order('atividade')
        
        if (atividadesError) {
          console.error('Erro ao buscar atividades:', atividadesError)
        }

        if (atividadesData) {
          setAtividades(atividadesData.map(atividade => ({
            value: atividade.id.toString(),
            label: atividade.atividade || ''
          })))
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const estados = activeFilters["endereco_uf"] as string[] || []
    if (!estados.length) {
      setMunicipiosOptions([])
      return
    }

    // Pega todos os dados da tabela
    const data = table.getCoreRowModel().rows

    // Filtra as linhas pelos estados selecionados e extrai os municípios
    const municipiosPorEstado = estados.flatMap(estado => {
      return data
        .filter(row => row.getValue('endereco_uf') === estado)
        .map(row => row.getValue('endereco_localidade'))
        .filter(Boolean)
    })
    
    // Remove duplicatas e ordena
    const municipiosUnicos = [...new Set(municipiosPorEstado)].sort()

    console.log('Estados selecionados:', estados)
    console.log('Municípios encontrados:', municipiosUnicos)

    // Converte para o formato do MultiSelect
    setMunicipiosOptions(municipiosUnicos.map(municipio => ({
      label: municipio,
      value: municipio
    })))
  }, [activeFilters["endereco_uf"], table])

  // Função para contar filtros ativos
  const countActiveFilters = () => {
    return Object.values(activeFilters).filter(value => value !== undefined && value !== "").length
  }

  // Função para limpar todos os filtros
  const clearFilters = () => {
    table.resetColumnFilters()
    setActiveFilters({})
    setOpen(false)
  }

  // Função para aplicar os filtros
  const applyFilters = () => {
    Object.entries(activeFilters).forEach(([columnId, value]) => {
      if (value !== undefined && value !== "") {
        table.getColumn(columnId)?.setFilterValue(value)
      } else {
        table.getColumn(columnId)?.setFilterValue(undefined)
      }
    })
    setOpen(false)
  }

  // Função para atualizar um filtro
  const updateFilter = (columnId: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [columnId]: value }))
    table.getColumn(columnId)?.setFilterValue(value)
  }

  const getMunicipiosPorEstados = (estados: string[]) => {
    if (!estados.length) return []

    // Pega todos os dados da tabela
    const data = table.getCoreRowModel().rows

    // Filtra as linhas pelos estados selecionados e extrai os municípios
    const municipiosDosEstados = data
      .filter(row => {
        const uf = row.getValue('endereco_uf')
        return uf && estados.includes(uf)
      })
      .map(row => row.getValue('endereco_localidade'))
      .filter(Boolean) // Remove valores null/undefined
    
    // Remove duplicatas e ordena
    const municipiosUnicos = [...new Set(municipiosDosEstados)].sort()

    // Converte para o formato do MultiSelect
    return municipiosUnicos.map(municipio => ({
      label: municipio,
      value: municipio
    }))
  }

  const getEstadosUnicos = () => {
    // Pega todos os dados da tabela
    const data = table.getCoreRowModel().rows

    // Extrai os estados únicos
    const estados = data
      .map(row => row.getValue('endereco_uf'))
      .filter(Boolean) // Remove valores null/undefined

    // Remove duplicatas e ordena
    const estadosUnicos = [...new Set(estados)].sort()

    // Mapa de siglas para nomes dos estados
    const nomesEstados: { [key: string]: string } = {
      'AC': 'Acre',
      'AL': 'Alagoas',
      'AP': 'Amapá',
      'AM': 'Amazonas',
      'BA': 'Bahia',
      'CE': 'Ceará',
      'DF': 'Distrito Federal',
      'ES': 'Espírito Santo',
      'GO': 'Goiás',
      'MA': 'Maranhão',
      'MT': 'Mato Grosso',
      'MS': 'Mato Grosso do Sul',
      'MG': 'Minas Gerais',
      'PA': 'Pará',
      'PB': 'Paraíba',
      'PR': 'Paraná',
      'PE': 'Pernambuco',
      'PI': 'Piauí',
      'RJ': 'Rio de Janeiro',
      'RN': 'Rio Grande do Norte',
      'RS': 'Rio Grande do Sul',
      'RO': 'Rondônia',
      'RR': 'Roraima',
      'SC': 'Santa Catarina',
      'SP': 'São Paulo',
      'SE': 'Sergipe',
      'TO': 'Tocantins'
    }

    // Converte para o formato do MultiSelect
    return estadosUnicos.map(uf => ({
      label: `${nomesEstados[uf]} (${uf})`,
      value: uf
    }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full relative">
                  <Filter className="h-4 w-4" />
                  {countActiveFilters() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {countActiveFilters()}
                    </span>
                  )}
                  <span className="sr-only">Filtrar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar dados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>
      <SheetContent 
        className="w-3/4 sm:w-[500px] md:w-[500px] lg:w-[500px] border-l shadow-lg !max-w-[500px]" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="px-4"> 
          <SheetHeader className="mb-4">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Configure os filtros para refinar sua busca
            </SheetDescription>
          </SheetHeader>
          <div className="px-2"> 
            <ScrollArea className="h-[calc(100vh-10rem)] pr-6">
              <div className="space-y-5 pb-16"> 
                {/* Linha 1: Tipo e Gênero */}
                <div className="grid grid-cols-2 gap-4 px-2">
                  <div className="grid gap-2">
                    <Label className="text-sm">Tipo</Label>
                    <Select
                      value={activeFilters["tipo"] || undefined}
                      onValueChange={(value) => {
                        if (value === "all") {
                          const { tipo, ...rest } = activeFilters
                          setActiveFilters(rest)
                        } else {
                          updateFilter("tipo", value)
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="F">Pessoa Física</SelectItem>
                        <SelectItem value="J">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Gênero</Label>
                    <Select
                      value={activeFilters["genero"] || "all"}
                      onValueChange={(value) => {
                        if (value === "all") {
                          const { genero, ...rest } = activeFilters
                          setActiveFilters(rest)
                          table.getColumn("genero")?.setFilterValue(undefined)
                        } else {
                          updateFilter("genero", value)
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione um gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                        <SelectItem value="O">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 2: Tipos de Pessoa */}
                <div className="grid gap-2 px-2">
                  <Label className="text-sm">Tipos de Pessoa</Label>
                  <MultiSelect
                    options={tiposPessoas}
                    selected={activeFilters["tipospessoas"] || []}
                    onChange={(values) => {
                      console.log('Tipos selecionados:', values)
                      if (values.length === 0) {
                        const { tipospessoas, ...rest } = activeFilters
                        setActiveFilters(rest)
                        table.getColumn("tipospessoas")?.setFilterValue(undefined)
                      } else {
                        setActiveFilters(prev => ({ ...prev, tipospessoas: values }))
                        table.getColumn("tipospessoas")?.setFilterValue(values)
                      }
                    }}
                    placeholder="Selecione os tipos"
                  />
                </div>

                {/* Linha 3: Grupos */}
                <div className="grid gap-2 px-2">
                  <Label className="text-sm">Grupos</Label>
                  <MultiSelect
                    options={grupos}
                    selected={selectedGrupos}
                    onChange={(values) => {
                      setSelectedGrupos(values)
                      updateFilter("grupos", values)
                    }}
                    placeholder="Selecione os grupos"
                  />
                </div>

                {/* Linha 4: Subgrupos */}
                {selectedGrupos.length > 0 && (
                  <div className="grid gap-2 px-2">
                    <Label className="text-sm">Subgrupos</Label>
                    <MultiSelect
                      options={subGrupos}
                      selected={activeFilters["subgrupos"] || []}
                      onChange={(values) => updateFilter("subgrupos", values)}
                      placeholder="Selecione os subgrupos"
                    />
                  </div>
                )}

                {/* Linha 5: Ramo */}
                <div className="flex flex-col px-2">
                  <Label>Ramo</Label>
                  <MultiSelect
                    options={Array.from(
                      new Set(
                        table.getRowModel().rows
                          .map(row => {
                            const ramo = row.getValue("ramo")
                            const ramoId = row.original.ramo_id
                            // Só retorna se tiver tanto o id quanto o nome do ramo
                            if (ramo && ramoId) {
                              return {
                                value: String(ramoId),
                                label: String(ramo)
                              }
                            }
                            return null
                          })
                          .filter(Boolean) // Remove os itens null
                      ),
                      JSON.stringify
                    ).map(str => JSON.parse(str))}
                    selected={activeFilters["ramo"] || []}
                    onChange={(values) => updateFilter("ramo", values)}
                    placeholder="Selecione o ramo"
                  />
                </div>

                {/* Linha 6: Atividades */}
                <div className="grid gap-2 px-2">
                  <Label className="text-sm">Atividades</Label>
                  <MultiSelect
                    options={atividades}
                    selected={activeFilters["atividades"] || []}
                    onChange={(values) => updateFilter("atividades", values)}
                    placeholder="Selecione as atividades"
                  />
                </div>

                {/* Linha 7: Estados UFs */}
                <div className="grid gap-2 px-2">
                  <Label className="text-sm">Estado (UF)</Label>
                  <MultiSelect
                    options={getEstadosUnicos()}
                    selected={activeFilters["endereco_uf"] || []}
                    onChange={(values) => updateFilter("endereco_uf", values)}
                    placeholder="Selecione os estados"
                  />
                </div>

                {/* Linha 8: Municípios */}
                <div className="grid gap-2 px-2">
                  <Label className="text-sm">Município</Label>
                  <MultiSelect
                    options={municipiosOptions}
                    selected={activeFilters["endereco_localidade"] || []}
                    onChange={(values) => updateFilter("endereco_localidade", values)}
                    placeholder="Selecione os municípios"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-6"> 
              <SheetFooter className="flex justify-end gap-4 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveFilters({})
                    Object.keys(activeFilters).forEach((columnId) => {
                      table.getColumn(columnId)?.setFilterValue(undefined)
                    })
                    setOpen(false)
                  }}
                >
                  Limpar Filtros
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Aplicar Filtros
                </Button>
              </SheetFooter>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
