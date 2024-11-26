"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Option = {
  value: string | number
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: (string | number)[]
  onChange: (values: (string | number)[]) => void
  className?: string
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Selecione...",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Fecha o dropdown quando clica fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: Option) => {
    onChange([...selected, option.value])
    setSearch("")
    setOpen(false)
  }

  const handleRemove = (optionValue: string | number) => {
    onChange(selected.filter((value) => value !== optionValue))
  }

  const handleContainerClick = () => {
    setOpen(true)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (!open) setOpen(true)
  }

  // Filtra apenas as opções não selecionadas e que correspondem à busca
  const availableOptions = options.filter((option) => 
    !selected.includes(option.value) &&
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={handleContainerClick}
        className={cn(
          "relative flex min-h-[42px] w-full items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value)
            if (!option) return null
            return (
              <Badge
                key={option.value}
                variant="secondary"
                className="rounded-sm px-1 pl-2 font-normal hover:bg-secondary/80"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:bg-secondary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(option.value)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
            placeholder={selected.length === 0 ? placeholder : ""}
          />
        </div>
      </div>
      
      {open && availableOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border border-input bg-background shadow-md">
          <div className="max-h-[200px] overflow-auto p-1">
            {availableOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="text-foreground">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {open && search && availableOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border border-input bg-background shadow-md">
          <div className="p-2 text-sm text-muted-foreground">
            Nenhum resultado encontrado
          </div>
        </div>
      )}
    </div>
  )
}
