"use client"

import { useEffect, useState } from "react"
import { PessoaEditSheet, PessoaEditSheetContent } from "./pessoa-edit-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePerfil } from "@/contexts/perfil"
import { 
  User, 
  MapPin, 
  Phone, 
  Receipt, 
  Building2, 
  Tags,
  FileText,
  Lock,
  Check,
  ChevronsUpDown,
  X,
  Asterisk
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCPF, formatCNPJ, formatPhone, formatCEP } from "@/lib/masks"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"
import { useHeader } from "@/contexts/header-context"

interface PessoaEditProps {
  pessoaId: number | null
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
}

interface PessoaTipo {
  id: number
  tipo: string
}

export function PessoaEdit({ pessoaId, isOpen, onClose, onSave }: PessoaEditProps) {
  const [loading, setLoading] = useState(true)  // Iniciando como true
  const [error, setError] = useState("")
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()
  const [pessoa, setPessoa] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [tiposPessoa, setTiposPessoa] = useState<PessoaTipo[]>([])
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({})
  const { setSubtitle } = useHeader()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pessoaId && isOpen && mounted) {
      loadPessoa()
    }
  }, [pessoaId, isOpen, mounted])

  useEffect(() => {
    if (pessoa) {
      const subtitle = pessoa.tipo === 'F' 
        ? `${pessoa.nome_razao} - ${formatCPF(pessoa.cpf_cnpj)}`
        : `${pessoa.nome_razao} - ${formatCNPJ(pessoa.cpf_cnpj)}`
      setSubtitle(subtitle)
    }
    return () => {
      setSubtitle(null)
    }
  }, [pessoa, setSubtitle])

  const loadPessoa = async () => {
    try {
      setLoading(true)
      setError("")

      // Primeiro carrega os dados da view para ter todos os campos calculados
      const { data: viewData, error: viewError } = await supabase
        .from("v_pessoas")
        .select("*")
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)
        .single()

      if (viewError) throw viewError

      // Depois carrega os dados relacionados
      const { data: relData, error: relError } = await supabase
        .from("pessoas")
        .select(`
          pessoas_enderecos(*),
          pessoas_contatos(*)
        `)
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)
        .single()

      if (relError) throw relError

      // Combina os dados da view com os relacionamentos
      setPessoa({
        ...viewData,
        pessoas_enderecos: relData?.pessoas_enderecos || [],
        pessoas_contatos: relData?.pessoas_contatos || []
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const validateFields = () => {
    const errors: string[] = []
    
    if (!pessoa) {
      errors.push("Dados da pessoa não encontrados")
      return errors
    }

    if (!pessoa.nome_razao?.trim()) {
      errors.push("Nome/Razão Social é obrigatório")
    }

    return errors
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      // Validação dos campos
      const validationErrors = validateFields()
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"))
      }

      if (!pessoa || !pessoaId || !perfil?.id) {
        throw new Error("Dados necessários não encontrados")
      }

      // Atualiza a pessoa
      const { data: pessoaData, error: pessoaError } = await supabase
        .from("pessoas")
        .update({
          nome_razao: pessoa.nome_razao,
          apelido: pessoa.apelido,
          tipo: pessoa.tipo,
          cpf_cnpj: pessoa.cpf_cnpj || null,
          rg_ie: pessoa.rg_ie || null,
          "IM": pessoa.IM || null,
          nascimento: pessoa.nascimento || null,
          renda: pessoa.renda || null,
          obs: pessoa.obs || null,
          "indIEDest": pessoa.indIEDest || null,
          "ISUF": pessoa.ISUF || null,
          pessoas_tipos: pessoa.pessoas_tipos || null,
          status_id: pessoa.status_id || 1,
          genero: pessoa.genero || null,
          grupos_ids: pessoa.grupos_ids || null,
          subgrupos_ids: pessoa.subgrupos_ids || null,
          ramo_id: pessoa.ramo_id || null,
          atividades_ids: pessoa.atividades_ids || null,
          natureza_juridica: pessoa.natureza_juridica || null,
          porte: pessoa.porte || null,
          situacao_cadastral: pessoa.situacao_cadastral || null,
          atividade_principal: pessoa.atividade_principal || null,
          atividades_secundarias: pessoa.atividades_secundarias || null,
          socios: pessoa.socios || null,
          capital_social: pessoa.capital_social || null,
          data_inicio_atividades: pessoa.data_inicio_atividades || null,
          matriz: pessoa.matriz || null
        })
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)
        .select()

      if (pessoaError) {
        console.error("Erro ao atualizar pessoa:", pessoaError)
        throw new Error(`Erro ao atualizar pessoa: ${pessoaError.message}`)
      }

      if (!pessoaData || pessoaData.length === 0) {
        throw new Error("Não foi possível atualizar a pessoa")
      }

      // Atualiza os endereços
      if (pessoa.pessoas_enderecos?.length > 0) {
        for (const endereco of pessoa.pessoas_enderecos) {
          if (endereco.id) {
            const { error: enderecoError } = await supabase
              .from("pessoas_enderecos")
              .update({
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf: endereco.uf,
                ibge: endereco.ibge,
                principal: endereco.principal,
                sem_numero: endereco.sem_numero
              })
              .eq("id", endereco.id)
              .eq("pessoa_id", pessoaId)

            if (enderecoError) {
              console.error("Erro ao atualizar endereço:", enderecoError)
              throw new Error(`Erro ao atualizar endereço: ${enderecoError.message}`)
            }
          }
        }
      }

      // Atualiza os contatos
      if (pessoa.pessoas_contatos?.length > 0) {
        for (const contato of pessoa.pessoas_contatos) {
          if (contato.id) {
            const { error: contatoError } = await supabase
              .from("pessoas_contatos")
              .update({
                tipo: contato.tipo,
                valor: contato.valor,
                observacao: contato.observacao,
                principal: contato.principal
              })
              .eq("id", contato.id)
              .eq("pessoa_id", pessoaId)

            if (contatoError) {
              console.error("Erro ao atualizar contato:", contatoError)
              throw new Error(`Erro ao atualizar contato: ${contatoError.message}`)
            }
          }
        }
      }

      toast({
        title: "Sucesso",
        description: "Pessoa atualizada com sucesso!",
        variant: "success"
      })

      // Notifica que salvou com sucesso
      onSave?.()
      onClose()
    } catch (err: any) {
      const errorMessage = err?.message || "Ocorreu um erro ao salvar os dados"
      console.error("Erro ao salvar:", errorMessage)
      setError(errorMessage)
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEndereco = async () => {
    try {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("pessoas_enderecos")
        .insert({
          pessoa_id: pessoaId,
          principal: pessoa.pessoas_enderecos.length === 0
        })
        .select()

      if (error) throw error

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_enderecos: [...prevPessoa.pessoas_enderecos, data[0]]
      }))

      toast({
        title: "Sucesso",
        description: "Novo endereço adicionado!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveEndereco = async (enderecoId: number) => {
    try {
      setLoading(true)
      setError("")

      const { error } = await supabase
        .from("pessoas_enderecos")
        .delete()
        .eq("id", enderecoId)

      if (error) throw error

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_enderecos: prevPessoa.pessoas_enderecos.filter((endereco: any) => endereco.id !== enderecoId)
      }))

      toast({
        title: "Sucesso",
        description: "Endereço removido com sucesso!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrincipal = async (enderecoId: number) => {
    try {
      setLoading(true)
      setError("")

      // Primeiro, remove o principal de todos os endereços
      const { error: updateError } = await supabase
        .from("pessoas_enderecos")
        .update({ principal: false })
        .eq("pessoa_id", pessoaId)

      if (updateError) throw updateError

      // Depois, define o novo endereço principal
      const { error: setPrincipalError } = await supabase
        .from("pessoas_enderecos")
        .update({ principal: true })
        .eq("id", enderecoId)

      if (setPrincipalError) throw setPrincipalError

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_enderecos: prevPessoa.pessoas_enderecos.map((endereco: any) => ({
          ...endereco,
          principal: endereco.id === enderecoId
        }))
      }))

      toast({
        title: "Sucesso",
        description: "Endereço principal atualizado!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnderecoChange = (index: number, field: string, value: string) => {
    setPessoa((prevPessoa: any) => {
      const newPessoasEnderecos = prevPessoa.pessoas_enderecos.map((endereco: any, enderecoIndex: number) => {
        if (enderecoIndex === index) {
          endereco[field] = value
        }
        return endereco
      })
      return { ...prevPessoa, pessoas_enderecos: newPessoasEnderecos }
    })
  }

  const handleCepChange = async (index: number, value: string) => {
    // Limita a 8 dígitos e remove caracteres não numéricos
    const cepNumerico = value.replace(/\D/g, '')
    if (cepNumerico.length > 8) return

    // Atualiza o valor do CEP com a máscara
    handleEnderecoChange(index, "cep", formatCEP(cepNumerico))
    
    // Se o CEP estiver completo (8 dígitos), faz a busca
    if (cepNumerico.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`)
        const data = await response.json()

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "O CEP informado não foi encontrado na base dos Correios.",
            variant: "destructive"
          })
          return
        }

        const newEnderecos = [...pessoa.pessoas_enderecos]
        newEnderecos[index] = {
          ...newEnderecos[index],
          logradouro: data.logradouro || newEnderecos[index].logradouro,
          bairro: data.bairro || newEnderecos[index].bairro,
          cidade: data.localidade || newEnderecos[index].cidade,
          uf: data.uf || newEnderecos[index].uf
        }
        setPessoa(prev => ({
          ...prev,
          pessoas_enderecos: newEnderecos
        }))

        toast({
          title: "CEP encontrado",
          description: "Endereço preenchido automaticamente.",
          variant: "success"
        })
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        toast({
          title: "Erro ao buscar CEP",
          description: "Ocorreu um erro ao buscar o CEP. Tente novamente.",
          variant: "destructive"
        })
      }
    }
  }

  const handleAddContato = async () => {
    try {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("pessoas_contatos")
        .insert({
          pessoa_id: pessoaId,
          principal: pessoa.pessoas_contatos.length === 0
        })
        .select()

      if (error) throw error

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_contatos: [...prevPessoa.pessoas_contatos, data[0]]
      }))

      toast({
        title: "Sucesso",
        description: "Novo contato adicionado!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveContato = async (contatoId: number) => {
    try {
      setLoading(true)
      setError("")

      const { error } = await supabase
        .from("pessoas_contatos")
        .delete()
        .eq("id", contatoId)

      if (error) throw error

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_contatos: prevPessoa.pessoas_contatos.filter((contato: any) => contato.id !== contatoId)
      }))

      toast({
        title: "Sucesso",
        description: "Contato removido com sucesso!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrincipalContato = async (contatoId: number) => {
    try {
      setLoading(true)
      setError("")

      // Primeiro, remove o principal de todos os contatos
      const { error: updateError } = await supabase
        .from("pessoas_contatos")
        .update({ principal: false })
        .eq("pessoa_id", pessoaId)

      if (updateError) throw updateError

      // Depois, define o novo contato principal
      const { error: setPrincipalError } = await supabase
        .from("pessoas_contatos")
        .update({ principal: true })
        .eq("id", contatoId)

      if (setPrincipalError) throw setPrincipalError

      setPessoa((prevPessoa: any) => ({
        ...prevPessoa,
        pessoas_contatos: prevPessoa.pessoas_contatos.map((contato: any) => ({
          ...contato,
          principal: contato.id === contatoId
        }))
      }))

      toast({
        title: "Sucesso",
        description: "Contato principal atualizado!",
        variant: "success"
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContatoChange = (index: number, field: string, value: string) => {
    setPessoa((prevPessoa: any) => {
      const newPessoasContatos = prevPessoa.pessoas_contatos.map((contato: any, contatoIndex: number) => {
        if (contatoIndex === index) {
          contato[field] = value
        }
        return contato
      })
      return { ...prevPessoa, pessoas_contatos: newPessoasContatos }
    })
  }

  const handlePessoaChange = (field: string, value: string) => {
    setPessoa((prevPessoa: any) => ({
      ...prevPessoa,
      [field]: value
    }))
  }

  const tiposOptions = tiposPessoa.map(tipo => ({
    value: tipo.id,
    label: tipo.tipo
  }))

  const handleTiposChange = (values: (string | number)[]) => {
    setPessoa(prev => ({
      ...prev,
      pessoas_tipos: values
    }))
  }

  const getFieldLabel = (field: string) => {
    const labels = {
      nome_razao: pessoa?.tipo === "F" ? "Nome Completo" : "Razão Social",
      apelido: pessoa?.tipo === "F" ? "Apelido" : "Nome Fantasia",
      rg_ie: pessoa?.tipo === "F" ? "RG" : "Inscrição Estadual",
      data_nasc_fund: pessoa?.tipo === "F" ? "Data de Nascimento" : "Data de Fundação",
      genero_porte: pessoa?.tipo === "F" ? "Gênero" : "Porte da Empresa",
    }
    return labels[field as keyof typeof labels] || field
  }

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

  const handleSemNumeroChange = (checked: boolean, index: number) => {
    const newEnderecos = [...pessoa.pessoas_enderecos]
    newEnderecos[index] = {
      ...newEnderecos[index],
      sem_numero: checked,
      numero: checked ? "Sem Número" : "" // Limpa o campo ao desmarcar
    }
    setPessoa(prev => ({
      ...prev,
      pessoas_enderecos: newEnderecos
    }))
  }

  const handleNumeroChange = (index: number, value: string) => {
    // Só permite alterar se não for "sem número"
    if (!pessoa.pessoas_enderecos[index].sem_numero) {
      handleEnderecoChange(index, "numero", value)
    }
  }

  const markFieldAsTouched = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
  }

  const isFieldInvalid = (field: string, value: any) => {
    if (!touchedFields[field]) return false
    return !value || value.trim() === ""
  }

  // Buscar tipos de pessoa
  useEffect(() => {
    async function fetchTiposPessoa() {
      const { data, error } = await supabase
        .from("pessoas_tipos")
        .select("id, tipo")
        .order("tipo")

      if (error) {
        console.error("Erro ao buscar tipos de pessoa:", error)
        return
      }

      setTiposPessoa(data || [])
    }

    fetchTiposPessoa()
  }, [supabase])

  // Função para formatar CPF/CNPJ
  const formatDocument = (doc: string) => {
    if (!doc) return ""
    if (pessoa?.tipo === "F") {
      return formatCPF(doc)
    }
    return formatCNPJ(doc)
  }

  // Função para formatar telefone
  const formatPhoneNumber = (phone: string) => {
    return formatPhone(phone)
  }

  // Função para formatar CEP
  const formatCepNumber = (cep: string) => {
    return formatCEP(cep)
  }

  const RequiredLabel = ({ children, value }: { children: React.ReactNode, value: any }) => (
    <div className="flex items-center gap-1">
      {children}
      {(!value || value.trim() === "") && (
        <Asterisk className="h-3 w-3 text-destructive" />
      )}
    </div>
  )

  if (!pessoa || loading) {
    return (
      <PessoaEditSheet open={isOpen} onClose={onClose}>
        <PessoaEditSheetContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">
              Carregando...
            </div>
          </div>
        </PessoaEditSheetContent>
      </PessoaEditSheet>
    )
  }

  return (
    <PessoaEditSheet 
      open={isOpen} 
      onClose={onClose} 
      onSave={() => handleSave()}
      loading={loading}
      pessoa={{
        apelido: pessoa?.apelido,
        nome_razao: pessoa?.nome_razao
      }}
    >
      <PessoaEditSheetContent>
        <div className="space-y-6 p-6 overflow-y-auto">
          {/* Card Principal - Dados Básicos */}
          <div className="rounded-lg border bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Dados Principais</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  {formatDocument(pessoa?.cpf_cnpj || "")}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  pessoa?.tipo === "F" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                )}>
                  {pessoa?.tipo === "F" ? "Pessoa Física" : "Pessoa Jurídica"}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel value={pessoa.nome_razao}>
                  <Label>{getFieldLabel("nome_razao")}</Label>
                </RequiredLabel>
                <Input
                  id="nome_razao"
                  value={pessoa?.nome_razao || ""}
                  onChange={(e) => handlePessoaChange("nome_razao", e.target.value)}
                  onBlur={() => markFieldAsTouched("nome_razao")}
                  className={cn(
                    isFieldInvalid("nome_razao", pessoa.nome_razao) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel value={pessoa.apelido}>
                  <Label>{getFieldLabel("apelido")}</Label>
                </RequiredLabel>
                <Input
                  id="apelido"
                  value={pessoa?.apelido || ""}
                  onChange={(e) => handlePessoaChange("apelido", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel value={pessoa.rg_ie}>
                  <Label>{getFieldLabel("rg_ie")}</Label>
                </RequiredLabel>
                <Input
                  id="rg_ie"
                  value={pessoa?.rg_ie || ""}
                  onChange={(e) => handlePessoaChange("rg_ie", e.target.value)}
                  onBlur={() => markFieldAsTouched("rg_ie")}
                  className={cn(
                    isFieldInvalid("rg_ie", pessoa.rg_ie) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel value={pessoa.nascimento}>
                  <Label>{getFieldLabel("nascimento")}</Label>
                </RequiredLabel>
                <Input
                  id="nascimento"
                  type="date"
                  value={pessoa?.nascimento || ""}
                  onChange={(e) => handlePessoaChange("nascimento", e.target.value)}
                  onBlur={() => markFieldAsTouched("nascimento")}
                  className={cn(
                    isFieldInvalid("nascimento", pessoa.nascimento) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipos</Label>
                <MultiSelect
                  options={tiposOptions}
                  selected={Array.isArray(pessoa?.pessoas_tipos) ? pessoa.pessoas_tipos : []}
                  onChange={handleTiposChange}
                  placeholder="Selecione os tipos..."
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel value={pessoa.genero}>
                  <Label>{getFieldLabel("genero")}</Label>
                </RequiredLabel>
                <Select
                  value={pessoa?.genero || ""}
                  onValueChange={(value) => handlePessoaChange("genero", value)}
                  onBlur={() => markFieldAsTouched("genero")}
                  className={cn(
                    isFieldInvalid("genero", pessoa.genero) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Selecione ${pessoa?.tipo === "F" ? "o gênero" : "o porte"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getGeneroPorteOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cards Expansíveis */}
          <ExpandableCard 
            title="Endereços" 
            icon={<MapPin className="h-5 w-5" />}
            defaultExpanded={true}
            className="mt-4 bg-white"
          >
            {/* Conteúdo dos endereços */}
            {pessoa.pessoas_enderecos.map((endereco: any, index: number) => (
              <div key={endereco.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Endereço {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrincipal(endereco.id)}
                      disabled={endereco.principal}
                    >
                      {endereco.principal ? "Principal" : "Tornar Principal"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveEndereco(endereco.id)}
                      disabled={endereco.principal}
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.cep}>
                      <Label>CEP</Label>
                    </RequiredLabel>
                    <Input
                      value={formatCEP(endereco.cep || "")}
                      onChange={(e) => handleCepChange(index, e.target.value)}
                      onBlur={() => markFieldAsTouched(`endereco_${index}_cep`)}
                      className={cn(
                        isFieldInvalid(`endereco_${index}_cep`, endereco.cep) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.logradouro}>
                      <Label>Logradouro</Label>
                    </RequiredLabel>
                    <Input
                      value={endereco.logradouro || ""}
                      onChange={(e) => handleEnderecoChange(index, "logradouro", e.target.value)}
                      onBlur={() => markFieldAsTouched(`endereco_${index}_logradouro`)}
                      className={cn(
                        isFieldInvalid(`endereco_${index}_logradouro`, endereco.logradouro) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.sem_numero ? "Sem Número" : endereco.numero}>
                      <Label>Número</Label>
                    </RequiredLabel>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={endereco.numero || ""}
                          onChange={(e) => handleNumeroChange(index, e.target.value)}
                          onBlur={() => markFieldAsTouched(`endereco_${index}_numero`)}
                          disabled={endereco.sem_numero}
                          className={cn(
                            !endereco.sem_numero && 
                            isFieldInvalid(`endereco_${index}_numero`, endereco.numero) && 
                            "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`sem-numero-${index}`}
                          checked={endereco.sem_numero || false}
                          onCheckedChange={(checked) => handleSemNumeroChange(checked, index)}
                        />
                        <label
                          htmlFor={`sem-numero-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Sem Número
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      value={endereco.complemento || ""}
                      onChange={(e) => handleEnderecoChange(index, "complemento", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.bairro}>
                      <Label>Bairro</Label>
                    </RequiredLabel>
                    <Input
                      value={endereco.bairro || ""}
                      onChange={(e) => handleEnderecoChange(index, "bairro", e.target.value)}
                      onBlur={() => markFieldAsTouched(`endereco_${index}_bairro`)}
                      className={cn(
                        isFieldInvalid(`endereco_${index}_bairro`, endereco.bairro) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.cidade}>
                      <Label>Cidade</Label>
                    </RequiredLabel>
                    <Input
                      value={endereco.cidade || ""}
                      onChange={(e) => handleEnderecoChange(index, "cidade", e.target.value)}
                      onBlur={() => markFieldAsTouched(`endereco_${index}_cidade`)}
                      className={cn(
                        isFieldInvalid(`endereco_${index}_cidade`, endereco.cidade) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={endereco.uf}>
                      <Label>UF</Label>
                    </RequiredLabel>
                    <Input
                      value={endereco.uf || ""}
                      onChange={(e) => handleEnderecoChange(index, "uf", e.target.value)}
                      onBlur={() => markFieldAsTouched(`endereco_${index}_uf`)}
                      className={cn(
                        isFieldInvalid(`endereco_${index}_uf`, endereco.uf) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddEndereco}
              className="w-full mt-4"
              variant="outline"
            >
              Adicionar Endereço
            </Button>
          </ExpandableCard>

          <ExpandableCard 
            title="Contatos" 
            icon={<Phone className="h-5 w-5" />}
            className="mt-4 bg-white"
          >
            {/* Conteúdo dos contatos */}
            {pessoa.pessoas_contatos.map((contato: any, index: number) => (
              <div key={contato.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Contato {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrincipalContato(contato.id)}
                      disabled={contato.principal}
                    >
                      {contato.principal ? "Principal" : "Tornar Principal"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveContato(contato.id)}
                      disabled={contato.principal}
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel value={contato.tipo}>
                      <Label>Tipo</Label>
                    </RequiredLabel>
                    <Select
                      value={contato.tipo || ""}
                      onValueChange={(value) => handleContatoChange(index, "tipo", value)}
                      onBlur={() => markFieldAsTouched(`contato_${index}_tipo`)}
                      className={cn(
                        isFieldInvalid(`contato_${index}_tipo`, contato.tipo) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="celular">Celular</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel value={contato.valor}>
                      <Label>Valor</Label>
                    </RequiredLabel>
                    <Input
                      value={contato.tipo === "telefone" || contato.tipo === "celular" ? 
                        formatPhoneNumber(contato.valor || "") : 
                        contato.valor || ""
                      }
                      onChange={(e) => handleContatoChange(index, "valor", e.target.value)}
                      onBlur={() => markFieldAsTouched(`contato_${index}_valor`)}
                      className={cn(
                        isFieldInvalid(`contato_${index}_valor`, contato.valor) && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Observação</Label>
                    <Input
                      value={contato.observacao || ""}
                      onChange={(e) => handleContatoChange(index, "observacao", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddContato}
              className="w-full mt-4"
              variant="outline"
            >
              Adicionar Contato
            </Button>
          </ExpandableCard>

          <ExpandableCard 
            title="Informações Fiscais" 
            icon={<Receipt className="h-5 w-5" />}
            className="mt-4 bg-white"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel value={pessoa.inscricao_estadual}>
                  <Label>Inscrição Estadual</Label>
                </RequiredLabel>
                <Input
                  value={pessoa?.inscricao_estadual || ""}
                  onChange={(e) => handlePessoaChange("inscricao_estadual", e.target.value)}
                  onBlur={() => markFieldAsTouched("inscricao_estadual")}
                  className={cn(
                    isFieldInvalid("inscricao_estadual", pessoa.inscricao_estadual) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel value={pessoa.inscricao_municipal}>
                  <Label>Inscrição Municipal</Label>
                </RequiredLabel>
                <Input
                  value={pessoa?.inscricao_municipal || ""}
                  onChange={(e) => handlePessoaChange("inscricao_municipal", e.target.value)}
                  onBlur={() => markFieldAsTouched("inscricao_municipal")}
                  className={cn(
                    isFieldInvalid("inscricao_municipal", pessoa.inscricao_municipal) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel value={pessoa.regime_tributario}>
                  <Label>Regime Tributário</Label>
                </RequiredLabel>
                <Select
                  value={pessoa?.regime_tributario || ""}
                  onValueChange={(value) => handlePessoaChange("regime_tributario", value)}
                  onBlur={() => markFieldAsTouched("regime_tributario")}
                  className={cn(
                    isFieldInvalid("regime_tributario", pessoa.regime_tributario) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <RequiredLabel value={pessoa.contribuinte_icms}>
                  <Label>Contribuinte ICMS</Label>
                </RequiredLabel>
                <Select
                  value={pessoa?.contribuinte_icms || ""}
                  onValueChange={(value) => handlePessoaChange("contribuinte_icms", value)}
                  onBlur={() => markFieldAsTouched("contribuinte_icms")}
                  className={cn(
                    isFieldInvalid("contribuinte_icms", pessoa.contribuinte_icms) && 
                    "border-destructive focus-visible:ring-destructive"
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Contribuinte ICMS</SelectItem>
                    <SelectItem value="2">Contribuinte isento</SelectItem>
                    <SelectItem value="9">Não Contribuinte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ExpandableCard>

          <ExpandableCard 
            title="Outras Informações" 
            icon={<FileText className="h-5 w-5" />}
            className="mt-4 bg-white"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Observações</Label>
                <Input
                  value={pessoa?.obs || ""}
                  onChange={(e) => handlePessoaChange("obs", e.target.value)}
                />
              </div>
            </div>
          </ExpandableCard>
        </div>
      </PessoaEditSheetContent>
    </PessoaEditSheet>
  )
}
