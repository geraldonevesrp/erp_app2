"use client"

import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmpresaContatosProps {
  data: any
  onChange: (field: string, value: any) => void
}

export function EmpresaContatos({ data, onChange }: EmpresaContatosProps) {
  return (
    <ExpandableCard title="Contatos">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={data?.telefone || ""}
            onChange={(e) => onChange("telefone", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="celular">Celular</Label>
          <Input
            id="celular"
            value={data?.celular || ""}
            onChange={(e) => onChange("celular", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data?.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data?.website || ""}
            onChange={(e) => onChange("website", e.target.value)}
          />
        </div>
      </div>
    </ExpandableCard>
  )
}
