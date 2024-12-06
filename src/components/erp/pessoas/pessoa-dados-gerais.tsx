"use client"

import { useState } from "react"
import { User, FileText, Briefcase, Calendar, Globe } from "lucide-react"
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
        <div className="space-y-6">
          {/* Identificação Principal */}
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
                <RequiredLabel value={pessoa?.nome_razao}>
                  <Label>{pessoa?.tipo === "J" ? "Razão Social" : "Nome"}</Label>
                </RequiredLabel>
                <Input
                  value={pessoa?.nome_razao || ""}
                  onChange={(e) => handleFieldChange("nome_razao", e.target.value)}
                  disabled={loading}
                />
                {validationErrors.nome_razao && touchedFields.nome_razao && (
                  <span className="text-sm text-destructive">{validationErrors.nome_razao}</span>
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
                <RequiredLabel value={pessoa?.pessoas_tipos}>
                  <Label>Tipo de Cadastro</Label>
                </RequiredLabel>
                <Select
                  value={pessoa?.pessoas_tipos || ""}
                  onValueChange={(value) => onPessoaChange({ ...pessoa, pessoas_tipos: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENTE">Cliente</SelectItem>
                    <SelectItem value="FORNECEDOR">Fornecedor</SelectItem>
                    <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                    <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                    <SelectItem value="TRANSPORTADOR">Transportador</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.pessoas_tipos && touchedFields.pessoas_tipos && (
                  <span className="text-sm text-destructive">{validationErrors.pessoas_tipos}</span>
                )}
              </div>

              <div>
                <Label>{pessoa?.tipo === "J" ? "Porte da Empresa" : "Gênero"}</Label>
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
            </div>
          </div>

          {/* Documentos */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              <h3 className="font-medium">Documentos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pessoa?.tipo === "F" ? (
                <>
                  <div>
                    <Label>RG</Label>
                    <Input
                      value={pessoa?.rg || ""}
                      onChange={(e) => onPessoaChange({ ...pessoa, rg: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Órgão Expedidor</Label>
                      <Input
                        value={pessoa?.rg_orgao || ""}
                        onChange={(e) => onPessoaChange({ ...pessoa, rg_orgao: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label>Data Expedição</Label>
                      <Input
                        type="date"
                        value={pessoa?.rg_data_expedicao || ""}
                        onChange={(e) => onPessoaChange({ ...pessoa, rg_data_expedicao: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Inscrição Estadual</Label>
                    <Input
                      value={pessoa?.inscricao_estadual || ""}
                      onChange={(e) => onPessoaChange({ ...pessoa, inscricao_estadual: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Inscrição Municipal</Label>
                    <Input
                      value={pessoa?.inscricao_municipal || ""}
                      onChange={(e) => onPessoaChange({ ...pessoa, inscricao_municipal: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dados Pessoais/Empresariais */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              {pessoa?.tipo === "J" ? (
                <Briefcase className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <h3 className="font-medium">
                {pessoa?.tipo === "J" ? "Dados Empresariais" : "Dados Pessoais"}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{pessoa?.tipo === "J" ? "Data de Fundação" : "Data de Nascimento"}</Label>
                <Input
                  type="date"
                  value={pessoa?.data_nascimento_fundacao || ""}
                  onChange={(e) => onPessoaChange({ ...pessoa, data_nascimento_fundacao: e.target.value })}
                  disabled={loading}
                />
              </div>

              {pessoa?.tipo === "F" ? (
                <>
                  <div>
                    <Label>Estado Civil</Label>
                    <Select
                      value={pessoa?.estado_civil || ""}
                      onValueChange={(value) => onPessoaChange({ ...pessoa, estado_civil: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                        <SelectItem value="CASADO">Casado(a)</SelectItem>
                        <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                        <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                        <SelectItem value="UNIAO_ESTAVEL">União Estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nome do Cônjuge</Label>
                    <Input
                      value={pessoa?.nome_conjuge || ""}
                      onChange={(e) => onPessoaChange({ ...pessoa, nome_conjuge: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <Label>Site</Label>
                  <Input
                    value={pessoa?.site || ""}
                    onChange={(e) => onPessoaChange({ ...pessoa, site: e.target.value })}
                    disabled={loading}
                    placeholder="https://"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Informações Complementares */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5" />
              <h3 className="font-medium">Informações Complementares</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nacionalidade</Label>
                <Input
                  value={pessoa?.nacionalidade || "Brasileira"}
                  onChange={(e) => onPessoaChange({ ...pessoa, nacionalidade: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Situação</Label>
                <Select
                  value={pessoa?.situacao || ""}
                  onValueChange={(value) => onPessoaChange({ ...pessoa, situacao: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Observações</Label>
                <textarea
                  className="w-full min-h-[100px] p-2 rounded-md border"
                  value={pessoa?.observacoes || ""}
                  onChange={(e) => onPessoaChange({ ...pessoa, observacoes: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExpandableCard>
  )
}
