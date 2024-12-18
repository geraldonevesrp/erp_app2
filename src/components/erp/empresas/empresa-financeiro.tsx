"use client"

import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmpresaFinanceiroProps {
  data: any
  onChange: (field: string, value: any) => void
}

export function EmpresaFinanceiro({ data, onChange }: EmpresaFinanceiroProps) {
  return (
    <ExpandableCard title="Dados Financeiros">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="banco">Banco</Label>
          <Input
            id="banco"
            value={data?.banco || ""}
            onChange={(e) => onChange("banco", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="agencia">Agência</Label>
          <Input
            id="agencia"
            value={data?.agencia || ""}
            onChange={(e) => onChange("agencia", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="conta">Conta</Label>
          <Input
            id="conta"
            value={data?.conta || ""}
            onChange={(e) => onChange("conta", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pix">PIX</Label>
          <Input
            id="pix"
            value={data?.pix || ""}
            onChange={(e) => onChange("pix", e.target.value)}
          />
        </div>
      </div>
    </ExpandableCard>
  )
}
