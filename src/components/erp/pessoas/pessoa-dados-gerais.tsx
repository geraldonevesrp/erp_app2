"use client"

import { useState, useEffect } from "react"
import { User, FileText, Briefcase, Calendar, Globe, Camera, Check, X, ChevronDown, Plus } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { formatCPF, formatCNPJ } from "@/lib/masks"
import { PessoaFoto } from "./pessoa-foto"
import { PessoaFotoUpload } from "./pessoa-foto-upload"
import { createClient } from "@/lib/supabase/client"

interface PessoaTipo {
  id: number
  tipo: string
}

interface PessoaDadosGeraisProps {
  pessoa: {
    id?: number
    perfis_id?: string
    foto_url?: string | null
    nome_razao?: string
    apelido?: string
    cpf_cnpj?: string
    tipo?: string
    pessoas_tipos?: number[]
    genero?: string
  }
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
  const [isViewPhotoOpen, setIsViewPhotoOpen] = useState(false)
  const [pessoasTipos, setPessoasTipos] = useState<PessoaTipo[]>([])
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const { data: tipos, error } = await supabase
          .from('pessoas_tipos')
          .select('id, tipo')
          .order('id')
        
        if (error) {
          console.error('Erro ao carregar tipos:', error)
          return
        }

        if (tipos) {
          console.log('Tipos carregados:', tipos)
          setPessoasTipos(tipos)
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    }

    fetchTipos()
  }, [])

  useEffect(() => {
    if (pessoa?.pessoas_tipos) {
      console.log('Valores atuais pessoas_tipos:', pessoa.pessoas_tipos)
    }
  }, [pessoa?.pessoas_tipos])

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
    <div className="space-y-4">
      <ExpandableCard
        title={
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>Dados Gerais</span>
          </div>
        }
        defaultExpanded={true}
      >
        <div className="p-6 space-y-6">
          {/* Header com Foto e Campos */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Coluna da Foto */}
            <div className="flex-shrink-0 mx-auto sm:mx-0 space-y-2 px-8">
              <div className="relative">
                <div 
                  onClick={() => pessoa?.foto_url && setIsViewPhotoOpen(true)} 
                  className={cn(
                    "transition-transform",
                    pessoa?.foto_url && "cursor-pointer hover:scale-105"
                  )}
                >
                  <PessoaFoto
                    pessoaId={pessoa?.id}
                    perfilId={pessoa?.perfis_id}
                    fotoUrl={pessoa?.foto_url}
                    onFotoUpdated={onFotoUpdated}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <label 
                htmlFor="foto-upload"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-colors cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Camera className="h-4 w-4" />
                {isUploadingPhoto ? "Processando..." : "Alterar foto"}
              </label>

              <PessoaFotoUpload
                open={isPhotoModalOpen}
                onOpenChange={setIsPhotoModalOpen}
                onFotoUpdated={(url) => {
                  if (onFotoUpdated) {
                    onFotoUpdated(url)
                  }
                  onPessoaChange({ ...pessoa, foto_url: url })
                  setIsPhotoModalOpen(false)
                }}
                onLoadingChange={setIsUploadingPhoto}
                pessoaId={pessoa?.id}
                perfilId={pessoa?.perfis_id}
                fotoUrl={pessoa?.foto_url}
              />
              
              {/* Modal de Visualização da Foto */}
              <Dialog open={isViewPhotoOpen} onOpenChange={setIsViewPhotoOpen}>
                <DialogContent className="max-w-4xl p-1">
                  <DialogTitle className="sr-only">Visualização da foto</DialogTitle>
                  <div className="relative">
                    {pessoa?.foto_url && (
                      <img
                        src={pessoa.foto_url}
                        alt="Foto do perfil"
                        className="w-full h-auto rounded-md object-contain"
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Coluna dos Campos Principais */}
            <div className="flex-grow space-y-4">
              {/* Linha 1: Tipo de Pessoa e Gênero alinhados à direita */}
              <div className="flex justify-end items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Label className="font-medium">Tipo de Pessoa:</Label>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                    {pessoa?.tipo === "F" ? "Física" : "Jurídica"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label>{pessoa?.tipo === "J" ? "Porte da Empresa" : "Gênero"}</Label>
                  <Select
                    value={pessoa?.genero_porte || ""}
                    onValueChange={(value) => onPessoaChange({ ...pessoa, genero_porte: value })}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
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

              {/* Linha 2: Dados Principais em Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>{pessoa?.tipo === "J" ? "Nome Fantasia" : "Apelido"}</Label>
                  <Input
                    value={pessoa?.apelido || ""}
                    onChange={(e) => onPessoaChange({ ...pessoa, apelido: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="sm:col-span-2">
                  <RequiredLabel value={pessoa?.nome_razao}>
                    <Label>{pessoa?.tipo === "J" ? "Razão Social" : "Nome Completo"}</Label>
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
              </div>

              {/* Linha 3: Tipos de Cadastro */}
              <div className="mt-4">
                <RequiredLabel value={pessoa?.pessoas_tipos}>
                  <Label>Tipos de Cadastro</Label>
                </RequiredLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full min-h-[2.5rem] h-auto justify-start font-normal",
                        !pessoa?.pessoas_tipos?.length && "text-muted-foreground"
                      )}
                    >
                      <div className="flex flex-wrap gap-1 pr-6">
                        {pessoa?.pessoas_tipos?.length ? (
                          pessoa.pessoas_tipos.map((tipoId) => {
                            const tipo = pessoasTipos.find(t => t.id === tipoId)
                            return tipo && (
                              <Badge 
                                key={tipo.id} 
                                variant="secondary"
                                className="flex items-center gap-1 max-w-[150px] truncate"
                              >
                                <span className="truncate">{tipo.tipo}</span>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const newTipos = pessoa.pessoas_tipos?.filter(id => id !== tipo.id) || []
                                    onPessoaChange({ ...pessoa, pessoas_tipos: newTipos })
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      const newTipos = pessoa.pessoas_tipos?.filter(id => id !== tipo.id) || []
                                      onPessoaChange({ ...pessoa, pessoas_tipos: newTipos })
                                    }
                                  }}
                                >
                                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </div>
                              </Badge>
                            )
                          })
                        ) : (
                          <span>Selecione...</span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <ScrollArea className="h-80">
                      <div className="grid gap-1 p-2">
                        {pessoasTipos
                          .filter(tipo => !pessoa?.pessoas_tipos?.includes(tipo.id))
                          .map((tipo) => (
                            <Button
                              key={tipo.id}
                              variant="ghost"
                              role="option"
                              className="justify-start font-normal hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                const currentTipos = pessoa?.pessoas_tipos || []
                                const newTipos = [...currentTipos, tipo.id]
                                onPessoaChange({ ...pessoa, pessoas_tipos: newTipos })
                              }}
                            >
                              <Check className="mr-2 h-3 w-3 text-muted-foreground" />
                              {tipo.tipo}
                            </Button>
                          ))}
                          {pessoasTipos
                            .filter(tipo => !pessoa?.pessoas_tipos?.includes(tipo.id))
                            .length === 0 && (
                              <div className="p-4 text-sm text-center text-muted-foreground">
                                Nenhum tipo disponível
                              </div>
                          )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                {validationErrors.pessoas_tipos && touchedFields.pessoas_tipos && (
                  <span className="text-sm text-destructive">{validationErrors.pessoas_tipos}</span>
                )}
              </div>
            </div>
          </div>

          {/* Seções em 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Documentos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Documentos</h3>
              </div>

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

            {/* Dados Pessoais/Empresariais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {pessoa?.tipo === "J" ? (
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
                <h3 className="font-medium text-sm">
                  {pessoa?.tipo === "J" ? "Dados Empresariais" : "Dados Pessoais"}
                </h3>
              </div>

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

            {/* Informações Complementares */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Informações Complementares</h3>
              </div>

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
            </div>
          </div>

          {/* Observações no rodapé */}
          <div className="mt-6 pt-6 border-t">
            <Label>Observações</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Adicione observações relevantes..."
              value={pessoa?.observacoes || ""}
              onChange={(e) => onPessoaChange({ ...pessoa, observacoes: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>
      </ExpandableCard>
    </div>
  )
}
