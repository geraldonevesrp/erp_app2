"use client"

import { Tags } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Pessoa } from "@/types/pessoa"

interface Grupo {
  id: number
  grupo: string
  tipo: number
  perfis_id: string
}

interface SubGrupo {
  id: number
  grupos_id: number
  subgrupo: string
}

interface PessoaGruposProps {
  pessoa: Pessoa
  loading: boolean
  grupos: Grupo[]
  subGrupos: SubGrupo[]
  validationErrors?: Record<string, string>
  onGruposChange: (selectedGrupos: number[]) => void
  onSubGruposChange: (selectedSubGrupos: number[]) => void
}

export function PessoaGrupos({
  pessoa,
  loading,
  grupos,
  subGrupos,
  validationErrors,
  onGruposChange,
  onSubGruposChange
}: PessoaGruposProps) {
  // Função para obter o nome do grupo pai do subgrupo
  const getGrupoNome = (grupoId: number) => {
    const grupo = grupos.find(g => g.id === grupoId)
    return grupo?.grupo || ""
  }

  // Filtra subgrupos baseado nos grupos selecionados
  const getFilteredSubGrupos = () => {
    if (!pessoa?.grupos_ids?.length) return []
    return subGrupos.filter(sub => 
      pessoa.grupos_ids?.includes(sub.grupos_id)
    )
  }

  const hasErrors = validationErrors?.grupos || validationErrors?.subgrupos

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5" />
          <span>Grupos</span>
          {hasErrors && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{validationErrors.grupos || validationErrors.subgrupos}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      }
      defaultExpanded={false}
    >
      <div className="space-y-4 p-6 dark:bg-background">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="grupos" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Grupos
          </Label>
          <MultiSelect
            id="grupos"
            options={grupos.map(g => ({
              value: g.id,
              label: g.grupo
            }))}
            selected={pessoa?.grupos_ids || []}
            onChange={onGruposChange}
            placeholder="Selecione os grupos..."
            disabled={loading}
            error={!!validationErrors?.grupos}
          />
          {validationErrors?.grupos && (
            <p className="text-sm font-medium text-destructive">{validationErrors.grupos}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="subgrupos" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Subgrupos
          </Label>
          <MultiSelect
            id="subgrupos"
            options={getFilteredSubGrupos().map(sub => ({
              value: sub.id,
              label: `${getGrupoNome(sub.grupos_id)} > ${sub.subgrupo}`
            }))}
            selected={pessoa?.subgrupos_ids || []}
            onChange={onSubGruposChange}
            placeholder={pessoa?.grupos_ids?.length ? "Selecione os subgrupos..." : "Selecione um grupo primeiro"}
            disabled={loading || !pessoa?.grupos_ids?.length}
            error={!!validationErrors?.subgrupos}
          />
          {validationErrors?.subgrupos && (
            <p className="text-sm font-medium text-destructive">{validationErrors.subgrupos}</p>
          )}
        </div>
      </div>
    </ExpandableCard>
  )
}
