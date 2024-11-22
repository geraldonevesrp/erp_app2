"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'empty' | 'notEmpty' | 'in' | 'between' | 'greaterThan' | 'lessThan'

export interface FilterOption {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'multiSelect' | 'boolean'
  operators: FilterOperator[]
  options?: { label: string; value: any }[]
  relationTable?: string
  relationLabelField?: string
  relationValueField?: string
}

export interface Filter {
  id: string
  field: string
  operator: FilterOperator
  value: any
}

interface DataTableFiltersProps {
  filters: Filter[]
  filterOptions: FilterOption[]
  onFiltersChange: (filters: Filter[]) => void
}

export function DataTableFilters({
  filters,
  filterOptions,
  onFiltersChange,
}: DataTableFiltersProps) {
  const [open, setOpen] = React.useState(false)
  const [openOperator, setOpenOperator] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<FilterOption | null>(null)
  const [selectedOperator, setSelectedOperator] = React.useState<FilterOperator | null>(null)
  const [filterValue, setFilterValue] = React.useState<any>(null)

  const operatorLabels: Record<FilterOperator, string> = {
    equals: 'é igual a',
    contains: 'contém',
    startsWith: 'começa com',
    endsWith: 'termina com',
    empty: 'está vazio',
    notEmpty: 'não está vazio',
    in: 'está em',
    between: 'está entre',
    greaterThan: 'maior que',
    lessThan: 'menor que'
  }

  const addFilter = () => {
    if (selectedOption && selectedOperator) {
      const newFilter: Filter = {
        id: Math.random().toString(36).substr(2, 9),
        field: selectedOption.id,
        operator: selectedOperator,
        value: filterValue
      }
      onFiltersChange([...filters, newFilter])
      setSelectedOption(null)
      setSelectedOperator(null)
      setFilterValue(null)
      setOpen(false)
      setOpenOperator(false)
    }
  }

  const removeFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const option = filterOptions.find(o => o.id === filter.field)
          if (!option) return null

          return (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 h-7"
            >
              <span className="font-medium">{option.label}</span>
              <span className="text-muted-foreground">{operatorLabels[filter.operator]}</span>
              <span>{filter.value?.toString()}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        })}
        
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              {!selectedOption ? (
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-8 justify-between"
                >
                  <span>Adicionar filtro</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-8 justify-between"
                >
                  {selectedOption.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar campo..." />
                <CommandList>
                  <CommandEmpty>Nenhum campo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {filterOptions.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.label}
                        onSelect={() => {
                          setSelectedOption(option)
                          setOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        <div 
                          className="flex items-center w-full"
                          onClick={() => {
                            setSelectedOption(option)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedOption?.id === option.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedOption && (
            <Popover open={openOperator} onOpenChange={setOpenOperator}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openOperator}
                  className="h-8 justify-between"
                >
                  {selectedOperator ? operatorLabels[selectedOperator] : "Selecionar operador"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar operador..." />
                  <CommandList>
                    <CommandEmpty>Nenhum operador encontrado.</CommandEmpty>
                    <CommandGroup>
                      {selectedOption.operators.map((operator) => (
                        <CommandItem
                          key={operator}
                          value={operatorLabels[operator]}
                          onSelect={() => {
                            setSelectedOperator(operator)
                            setOpenOperator(false)
                            if (operator === 'empty' || operator === 'notEmpty') {
                              setFilterValue(true)
                              setTimeout(addFilter, 0)
                            }
                          }}
                          className="cursor-pointer"
                        >
                          <div 
                            className="flex items-center w-full"
                            onClick={() => {
                              setSelectedOperator(operator)
                              setOpenOperator(false)
                              if (operator === 'empty' || operator === 'notEmpty') {
                                setFilterValue(true)
                                setTimeout(addFilter, 0)
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedOperator === operator ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {operatorLabels[operator]}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {selectedOption && selectedOperator && !['empty', 'notEmpty'].includes(selectedOperator) && (
            <div className="flex gap-2">
              {selectedOption.type === 'select' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-8 justify-between"
                    >
                      {filterValue ? 
                        selectedOption.options?.find(o => o.value === filterValue)?.label || "Selecionar valor"
                        : "Selecionar valor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar valor..." />
                      <CommandList>
                        <CommandEmpty>Nenhum valor encontrado.</CommandEmpty>
                        <CommandGroup>
                          {selectedOption.options?.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                setFilterValue(option.value)
                                setTimeout(addFilter, 0)
                              }}
                              className="cursor-pointer"
                            >
                              <div 
                                className="flex items-center w-full"
                                onClick={() => {
                                  setFilterValue(option.value)
                                  setTimeout(addFilter, 0)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    filterValue === option.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {option.label}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              
              {selectedOption.type === 'text' && (
                <input
                  type="text"
                  className="h-8 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Digite o valor..."
                  value={filterValue || ''}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filterValue) {
                      addFilter()
                    }
                  }}
                />
              )}
              
              {selectedOption.type === 'number' && (
                <input
                  type="number"
                  className="h-8 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Digite o valor..."
                  value={filterValue || ''}
                  onChange={(e) => setFilterValue(parseFloat(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filterValue) {
                      addFilter()
                    }
                  }}
                />
              )}
              
              {selectedOption.type === 'date' && (
                <input
                  type="date"
                  className="h-8 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filterValue || ''}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filterValue) {
                      addFilter()
                    }
                  }}
                />
              )}

              {filterValue && (
                <Button
                  variant="default"
                  size="sm"
                  className="h-8"
                  onClick={addFilter}
                >
                  Aplicar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
