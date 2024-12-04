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

  // Garante que os arrays de IDs existam
  const gruposIds = pessoa?.grupos_ids || []
  const subgruposIds = pessoa?.subgrupos_ids || []

  const hasErrors = validationErrors?.grupos || validationErrors?.subgrupos

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
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
      className="mb-4"
    >
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="grupos">Grupos</Label>
          <MultiSelect
            options={grupos.map(g => ({
              value: g.id,
              label: g.grupo
            }))}
            selected={gruposIds}
            onChange={(values) => onGruposChange(values as number[])}
            placeholder="Selecione os grupos..."
            disabled={loading}
          />
          {validationErrors?.grupos && (
            <p className="text-sm font-medium text-destructive">{validationErrors.grupos}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="subgrupos">Subgrupos</Label>
          <MultiSelect
            options={getFilteredSubGrupos().map(sub => ({
              value: sub.id,
              label: `${getGrupoNome(sub.grupos_id)} > ${sub.subgrupo}`
            }))}
            selected={subgruposIds}
            onChange={(values) => onSubGruposChange(values as number[])}
            placeholder={gruposIds.length ? "Selecione os subgrupos..." : "Selecione um grupo primeiro"}
            disabled={loading || !gruposIds.length}
          />
          {validationErrors?.subgrupos && (
            <p className="text-sm font-medium text-destructive">{validationErrors.subgrupos}</p>
          )}
        </div>
      </div>
    </ExpandableCard>
  )
}
