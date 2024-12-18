"use client"

import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmpresaEnderecoProps {
  data: any
  onChange: (field: string, value: any) => void
}

export function EmpresaEndereco({ data, onChange }: EmpresaEnderecoProps) {
  return (
    <ExpandableCard title="Endereço">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={data?.cep || ""}
            onChange={(e) => onChange("cep", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input
            id="logradouro"
            value={data?.logradouro || ""}
            onChange={(e) => onChange("logradouro", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            value={data?.numero || ""}
            onChange={(e) => onChange("numero", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            value={data?.complemento || ""}
            onChange={(e) => onChange("complemento", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            value={data?.bairro || ""}
            onChange={(e) => onChange("bairro", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={data?.cidade || ""}
            onChange={(e) => onChange("cidade", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="uf">UF</Label>
          <Input
            id="uf"
            value={data?.uf || ""}
            onChange={(e) => onChange("uf", e.target.value)}
          />
        </div>
      </div>
    </ExpandableCard>
  )
}
