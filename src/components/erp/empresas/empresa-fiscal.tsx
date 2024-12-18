"use client"

import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmpresaFiscalProps {
  data: any
  onChange: (field: string, value: any) => void
}

export function EmpresaFiscal({ data, onChange }: EmpresaFiscalProps) {
  return (
    <ExpandableCard title="Dados Fiscais">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
          <Input
            id="inscricao_estadual"
            value={data?.inscricao_estadual || ""}
            onChange={(e) => onChange("inscricao_estadual", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
          <Input
            id="inscricao_municipal"
            value={data?.inscricao_municipal || ""}
            onChange={(e) => onChange("inscricao_municipal", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="regime_tributario">Regime Tributário</Label>
          <Input
            id="regime_tributario"
            value={data?.regime_tributario || ""}
            onChange={(e) => onChange("regime_tributario", e.target.value)}
          />
        </div>
      </div>
    </ExpandableCard>
  )
}
