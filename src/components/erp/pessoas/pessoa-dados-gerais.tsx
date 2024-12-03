"use client"

import { useState } from "react"
import { User } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhotoModal } from "@/components/ui/photo-modal"
import { formatCPF, formatCNPJ } from "@/lib/masks"
import { PessoaFoto } from "./pessoa-foto"
import { PessoaFotoUpload } from "./pessoa-foto-upload"
import { Camera } from "lucide-react"

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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

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
      <div className="grid grid-cols-1 gap-6 p-6">
        {/* Seção da Foto */}
        <div className="flex flex-col items-center gap-4">
          {/* Área da foto */}
          <div>
            {pessoa?.foto_url ? (
              <div 
                onClick={() => setIsPhotoModalOpen(true)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <PessoaFoto
                  pessoaId={pessoa?.id}
                  perfilId={pessoa?.perfis_id}
                  fotoUrl={pessoa?.foto_url}
                  onFotoUpdated={onFotoUpdated}
                  disabled={loading}
                />
              </div>
            ) : (
              <PessoaFoto
                pessoaId={pessoa?.id}
                perfilId={pessoa?.perfis_id}
                fotoUrl={null}
                onFotoUpdated={onFotoUpdated}
                disabled={loading}
              />
            )}
          </div>

          {/* Botão de upload em componente separado */}
          <PessoaFotoUpload
            pessoaId={pessoa?.id}
            perfilId={pessoa?.perfis_id}
            fotoUrl={pessoa?.foto_url}
            onFotoUpdated={onFotoUpdated}
            disabled={loading}
          />

          {/* Modal de preview */}
          <PhotoModal
            isOpen={isPhotoModalOpen}
            onClose={() => setIsPhotoModalOpen(false)}
            photoUrl={pessoa?.foto_url || ""}
            alt={`Foto de ${pessoa?.nome || 'perfil'}`}
          />
        </div>

        {/* Seção dos Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <RequiredLabel value={pessoa?.tipo}>
                <Label>Tipo de Pessoa</Label>
              </RequiredLabel>
              <Select
                value={pessoa?.tipo || ""}
                onValueChange={(value) => onPessoaChange({ ...pessoa, tipo: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Física</SelectItem>
                  <SelectItem value="J">Jurídica</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.tipo && touchedFields.tipo && (
                <span className="text-sm text-destructive">{validationErrors.tipo}</span>
              )}
            </div>

            <div>
              <RequiredLabel value={pessoa?.nome}>
                <Label>{pessoa?.tipo === "J" ? "Razão Social" : "Nome"}</Label>
              </RequiredLabel>
              <Input
                value={pessoa?.nome || ""}
                onChange={(e) => onPessoaChange({ ...pessoa, nome: e.target.value })}
                disabled={loading}
              />
              {validationErrors.nome && touchedFields.nome && (
                <span className="text-sm text-destructive">{validationErrors.nome}</span>
              )}
            </div>

            <div>
              <Label>{pessoa?.tipo === "J" ? "Nome Fantasia" : "Apelido"}</Label>
              <Input
                value={pessoa?.apelido || ""}
                onChange={(e) => onPessoaChange({ ...pessoa, apelido: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <RequiredLabel value={pessoa?.cpf_cnpj}>
                <Label>{pessoa?.tipo === "J" ? "CNPJ" : "CPF"}</Label>
              </RequiredLabel>
              <Input
                value={pessoa?.cpf_cnpj ? (pessoa.tipo === "J" ? formatCNPJ(pessoa.cpf_cnpj) : formatCPF(pessoa.cpf_cnpj)) : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  onPessoaChange({ ...pessoa, cpf_cnpj: value })
                }}
                maxLength={pessoa?.tipo === "J" ? 18 : 14}
                disabled={loading}
              />
              {validationErrors.cpf_cnpj && touchedFields.cpf_cnpj && (
                <span className="text-sm text-destructive">{validationErrors.cpf_cnpj}</span>
              )}
            </div>

            <div>
              <Label>{pessoa?.tipo === "J" ? "Porte" : "Gênero"}</Label>
              <Select
                value={pessoa?.genero_porte || ""}
                onValueChange={(value) => onPessoaChange({ ...pessoa, genero_porte: value })}
                disabled={loading}
              >
                <SelectTrigger>
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

            <div>
              <Label>Observações</Label>
              <Input
                value={pessoa?.observacoes || ""}
                onChange={(e) => onPessoaChange({ ...pessoa, observacoes: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </ExpandableCard>
  )
}
