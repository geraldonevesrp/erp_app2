"use client"

import { useState } from "react"
import { User } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCPF, formatCNPJ } from "@/lib/masks"
import { PessoaFoto } from "./pessoa-foto"

interface PessoaDadosGeraisProps {
  pessoa: any
  loading: boolean
  validationErrors: { [key: string]: string }
  touchedFields: { [key: string]: boolean }
  onPessoaChange: (updates: any) => void
  onFotoUpdated: (novaUrl: string) => void
}

export function PessoaDadosGerais({
  pessoa,
  loading,
  validationErrors,
  touchedFields,
  onPessoaChange,
  onFotoUpdated
}: PessoaDadosGeraisProps) {
  const [mounted, setMounted] = useState(false)

  const RequiredLabel = ({ children, value }: { children: React.ReactNode, value: any }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className={`text-destructive ${(value !== null && value !== undefined && value !== '') && "invisible"}`}>*</span>
    </div>
  )

  const getGeneroPorteOptions = () => {
    if (pessoa?.tipo === "F") {
      return [
        { value: "M", label: "Masculino" },
        { value: "F", label: "Feminino" },
        { value: "O", label: "Outro" }
      ]
    } else {
      return [
        { value: "MEI", label: "Microempreendedor Individual" },
        { value: "ME", label: "Microempresa" },
        { value: "EPP", label: "Empresa de Pequeno Porte" },
        { value: "MEDIO", label: "Médio Porte" },
        { value: "GRANDE", label: "Grande Porte" }
      ]
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    if (field === "cpf_cnpj") {
      // Formatar CPF/CNPJ
      const cleanValue = value.replace(/\D/g, "")
      if (pessoa.tipo === "F") {
        value = formatCPF(cleanValue)
      } else {
        value = formatCNPJ(cleanValue)
      }
    }

    onPessoaChange({
      ...pessoa,
      [field]: value
    })
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>Dados Gerais</span>
        </div>
      }
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col items-center gap-4">
          <PessoaFoto
            pessoaId={pessoa.id}
            perfilId={pessoa.perfis_id}
            fotoUrl={pessoa.foto_url}
            onFotoUpdated={onFotoUpdated}
            disabled={loading}
          />
        </div>

        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <RequiredLabel value={pessoa?.apelido}>
              <Label htmlFor="apelido">{pessoa?.tipo === "F" ? "Apelido" : "Nome Fantasia"}</Label>
            </RequiredLabel>
            <Input
              id="apelido"
              value={pessoa?.apelido || ""}
              onChange={(e) => handleFieldChange("apelido", e.target.value)}
              disabled={loading}
              className={validationErrors?.apelido && touchedFields?.apelido ? "border-destructive" : ""}
            />
            {validationErrors?.apelido && touchedFields?.apelido && (
              <p className="text-sm text-destructive">{validationErrors.apelido}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <RequiredLabel value={pessoa?.nome_razao}>
              <Label htmlFor="nome_razao">{pessoa?.tipo === "F" ? "Nome Completo" : "Razão Social"}</Label>
            </RequiredLabel>
            <Input
              id="nome_razao"
              value={pessoa?.nome_razao || ""}
              onChange={(e) => handleFieldChange("nome_razao", e.target.value)}
              disabled={loading}
              className={validationErrors?.nome_razao && touchedFields?.nome_razao ? "border-destructive" : ""}
            />
            {validationErrors?.nome_razao && touchedFields?.nome_razao && (
              <p className="text-sm text-destructive">{validationErrors.nome_razao}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="cpf_cnpj">{pessoa?.tipo === "F" ? "CPF" : "CNPJ"}</Label>
            <Input
              id="cpf_cnpj"
              value={pessoa?.cpf_cnpj || ""}
              onChange={(e) => handleFieldChange("cpf_cnpj", e.target.value)}
              disabled={loading}
              className={validationErrors?.cpf_cnpj && touchedFields?.cpf_cnpj ? "border-destructive" : ""}
            />
            {validationErrors?.cpf_cnpj && touchedFields?.cpf_cnpj && (
              <p className="text-sm text-destructive">{validationErrors.cpf_cnpj}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="genero_porte">
              {pessoa?.tipo === "F" ? "Gênero" : "Porte da Empresa"}
            </Label>
            <Select
              value={pessoa?.genero_porte || ""}
              onValueChange={(value) => handleFieldChange("genero_porte", value)}
              disabled={loading}
            >
              <SelectTrigger id="genero_porte">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {getGeneroPorteOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </ExpandableCard>
  )
}
