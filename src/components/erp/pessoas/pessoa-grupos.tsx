"use client"

import { Tags } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { MultiSelect } from "@/components/ui/multi-select"

interface PessoaGruposProps {
  pessoa: any
  loading: boolean
  grupos: any[]
  subGrupos: any[]
  onGruposChange: (selectedGrupos: number[]) => void
  onSubGruposChange: (selectedSubGrupos: number[]) => void
}

export function PessoaGrupos({
  pessoa,
  loading,
  grupos,
  subGrupos,
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
    return subGrupos.filter(sub => 
      pessoa?.grupos_ids?.includes(sub.grupos_id)
    )
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5" />
          <span>Grupos</span>
        </div>
      }
      defaultExpanded={false}
    >
      <div className="space-y-4 p-6">
        <div className="grid w-full items-center gap-1.5">
          <MultiSelect
            label="Grupos"
            options={grupos.map(g => ({
              value: g.id,
              label: g.grupo
            }))}
            selected={pessoa?.grupos_ids || []}
            onChange={onGruposChange}
            placeholder="Selecione os grupos..."
            disabled={loading}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <MultiSelect
            label="Subgrupos"
            options={getFilteredSubGrupos().map(sub => ({
              value: sub.id,
              label: `${getGrupoNome(sub.grupos_id)} > ${sub.subgrupo}`
            }))}
            selected={pessoa?.subgrupos_ids || []}
            onChange={onSubGruposChange}
            disabled={loading || !pessoa?.grupos_ids?.length}
          />
        </div>
      </div>
    </ExpandableCard>
  )
}
