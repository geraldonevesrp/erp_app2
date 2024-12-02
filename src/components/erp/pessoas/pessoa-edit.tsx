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
  Asterisk,
  Plus
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCPF, formatCNPJ, formatPhone, formatCEP } from "@/lib/masks"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"
import { useHeader } from "@/contexts/header-context"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Camera, PencilLine, X } from "lucide-react"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"

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

interface Grupo {
  id: number
  grupo: string
  tipo: number
  perfis_id: number
}

interface SubGrupo {
  id: number
  subgrupo: string
  grupos_id: number
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
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [originalPessoa, setOriginalPessoa] = useState<any>(null)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("")
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [subGrupos, setSubGrupos] = useState<SubGrupo[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isConfirmRemoveDialogOpen, setIsConfirmRemoveDialogOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<{ type: 'contato' | 'endereco', id: number } | null>(null)
  const [pendingClose, setPendingClose] = useState(false)
  const [newContatos, setNewContatos] = useState<any[]>([])
  const [deletedContatos, setDeletedContatos] = useState<number[]>([])
  const [newEnderecos, setNewEnderecos] = useState<any[]>([])
  const [deletedEnderecos, setDeletedEnderecos] = useState<number[]>([])

  const RequiredLabel = ({ children, value }: { children: React.ReactNode, value: any }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className={cn(
        "text-destructive",
        (value !== null && value !== undefined && value !== '') && "invisible"
      )}>*</span>
    </div>
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pessoaId && isOpen && mounted) {
      loadData()
    }
  }, [pessoaId, isOpen, mounted])

  useEffect(() => {
    // Forçar reflow para garantir animação
    console.log('PessoaEdit isOpen:', isOpen, 'pessoaId:', pessoaId)
    if (isOpen) {
      setTimeout(() => {
        const sheet = document.querySelector('.pessoa-edit-sheet')
        console.log('Sheet encontrado:', !!sheet)
        if (sheet) {
          sheet.classList.add('open')
          sheet.classList.remove('translate-x-full')
          sheet.classList.add('translate-x-0')
        }
      }, 50)
    } else {
      // Quando fecha, remover classes
      setTimeout(() => {
        const sheet = document.querySelector('.pessoa-edit-sheet')
        if (sheet) {
          sheet.classList.remove('open')
          sheet.classList.remove('translate-x-0')
          sheet.classList.add('translate-x-full')
        }
      }, 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setPessoa(null)
      setOriginalPessoa(null)
      setHasChanges(false)
      setValidationErrors({})
      setTouchedFields({})
      setNewContatos([])
      setDeletedContatos([])
      setNewEnderecos([])
      setDeletedEnderecos([])
    }
  }, [isOpen])

  useEffect(() => {
    if (pessoa && originalPessoa) {
      const isEqual = (obj1: any, obj2: any): boolean => {
        if (obj1 === obj2) return true
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2
        if (obj1 === null || obj2 === null) return obj1 === obj2
        
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)
        
        if (keys1.length !== keys2.length) return false
        
        for (const key of keys1) {
          if (!keys2.includes(key)) return false
          if (!isEqual(obj1[key], obj2[key])) return false
        }
        
        return true
      }

      const cleanObject = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj
        
        const cleaned: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (value === null || value === undefined || value === '') continue
          if (Array.isArray(value)) {
            // Para arrays de endereços, filtrar os que estão vazios
            if (key === 'pessoas_enderecos') {
              const validEnderecos = value.filter((endereco: any) => 
                endereco && endereco.cep && endereco.numero && !deletedEnderecos.includes(endereco.id)
              ).map(cleanObject)
              if (validEnderecos.length > 0) {
                cleaned[key] = validEnderecos
              }
            } else {
              cleaned[key] = value.map(cleanObject).filter(Boolean)
            }
          } else if (typeof value === 'object') {
            cleaned[key] = cleanObject(value)
          } else {
            cleaned[key] = value
          }
        }
        return cleaned
      }

      const cleanedPessoa = cleanObject(pessoa)
      const cleanedOriginal = cleanObject(originalPessoa)
      
      setHasChanges(!isEqual(cleanedPessoa, cleanedOriginal))
    }
  }, [pessoa, originalPessoa])

  useEffect(() => {
    if (pessoa && !originalPessoa) {
      setOriginalPessoa(pessoa)
    }
  }, [pessoa])

  useEffect(() => {
    if (pessoa && originalPessoa) {
      const isEqual = (obj1: any, obj2: any): boolean => {
        if (obj1 === obj2) return true
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2
        if (obj1 === null || obj2 === null) return obj1 === obj2
        
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)
        
        if (keys1.length !== keys2.length) return false
        
        for (const key of keys1) {
          if (!keys2.includes(key)) return false
          if (!isEqual(obj1[key], obj2[key])) return false
        }
        
        return true
      }

      const hasEnderecoChanges = !isEqual(pessoa.pessoas_enderecos, originalPessoa.pessoas_enderecos)
      if (hasEnderecoChanges) {
        setHasChanges(true)
      }
    }
  }, [pessoa?.pessoas_enderecos, originalPessoa?.pessoas_enderecos])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      setOriginalPessoa(null)

      const { data: viewData, error: viewError } = await supabase
        .from("v_pessoas")
        .select()
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)
        .single()

      if (viewError) {
        console.error("Erro ao carregar dados da view:", viewError)
        throw new Error(`Erro ao carregar dados: ${viewError.message}`)
      }

      if (!viewData) {
        throw new Error("Dados não encontrados")
      }

      const { data: pessoaData, error: pessoaError } = await supabase
        .from("pessoas")
        .select(`
          *,
          pessoas_contatos (*),
          pessoas_enderecos (*)
        `)
        .single()
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)

      if (pessoaError) {
        console.error("Erro ao carregar dados da pessoa:", pessoaError)
        throw new Error(`Erro ao carregar dados: ${pessoaError.message}`)
      }

      if (!pessoaData) {
        throw new Error("Dados não encontrados")
      }

      const mergedData = {
        ...pessoaData,
        ...viewData
      }

      setPessoa(mergedData)
      setOriginalPessoa(mergedData)

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

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    
    if (!pessoa) {
      errors.geral = "Dados da pessoa não encontrados"
      return errors
    }

    // Validação do nome/razão social
    if (!pessoa.nome_razao?.trim()) {
      errors.nome_razao = "Nome/Razão Social é obrigatório"
    } else if (pessoa.nome_razao.trim().length < 3) {
      errors.nome_razao = "Nome/Razão Social deve ter pelo menos 3 caracteres"
    }

    // Validação do CPF/CNPJ se preenchido
    if (pessoa.cpf_cnpj) {
      const cpfCnpj = pessoa.cpf_cnpj.replace(/\D/g, '')
      if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
        errors.cpf_cnpj = "CPF/CNPJ inválido"
      }
    }

    // Validação de endereços
    pessoa.pessoas_enderecos.forEach((endereco, index) => {
      if (!endereco.cep?.trim()) {
        errors[`endereco_${index}_cep`] = "CEP é obrigatório"
      }
      if (!endereco.logradouro?.trim()) {
        errors[`endereco_${index}_logradouro`] = "Logradouro é obrigatório"
      }
      if (!endereco.numero?.trim()) {
        errors[`endereco_${index}_numero`] = "Número é obrigatório"
      }
      if (!endereco.bairro?.trim()) {
        errors[`endereco_${index}_bairro`] = "Bairro é obrigatório"
      }
      if (!endereco.localidade?.trim()) {
        errors[`endereco_${index}_localidade`] = "Cidade é obrigatória"
      }
      if (!endereco.uf?.trim()) {
        errors[`endereco_${index}_uf`] = "UF é obrigatória"
      }
    })

    // Validação de grupos e subgrupos
    if (pessoa.subgrupos_ids?.length > 0) {
      // Verifica se todos os subgrupos pertencem a grupos selecionados
      const invalidSubgrupos = pessoa.subgrupos_ids.filter(subId => {
        const subgrupo = subGrupos.find(s => s.id === subId)
        return !subgrupo || !pessoa.grupos_ids?.includes(subgrupo.grupos_id)
      })

      if (invalidSubgrupos.length > 0) {
        errors.subgrupos = "Existem subgrupos selecionados que não pertencem aos grupos escolhidos"
      }
    }

    setValidationErrors(errors)
    return errors
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      // Validação dos campos
      const errors = validateFields()
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join("\n")
        throw new Error(errorMessages)
      }

      if (!pessoa || !pessoaId || !perfil?.id) {
        throw new Error("Dados necessários não encontrados")
      }

      // Validação de contatos
      const allContatos = pessoa.pessoas_contatos || []
      const invalidContatos = allContatos.filter(c => !c.contato?.trim())
      if (invalidContatos.length > 0) {
        throw new Error("Todos os contatos precisam ter um nome preenchido")
      }

      // Remover contatos marcados para deleção
      if (deletedContatos.length > 0) {
        const { error: deleteContatosError } = await supabase
          .from("pessoas_contatos")
          .delete()
          .in('id', deletedContatos)

        if (deleteContatosError) throw deleteContatosError
      }

      // Remover endereços marcados para deleção
      if (deletedEnderecos.length > 0) {
        const { error: deleteEnderecosError } = await supabase
          .from("pessoas_enderecos")
          .delete()
          .in('id', deletedEnderecos)

        if (deleteEnderecosError) throw deleteEnderecosError
      }

      // Adicionar novos contatos
      const contatosToAdd = newContatos.map(({ id, isNew, ...contato }) => contato)
      if (contatosToAdd.length > 0) {
        const { error: insertContatosError } = await supabase
          .from("pessoas_contatos")
          .insert(contatosToAdd)

        if (insertContatosError) throw insertContatosError
      }

      // Adicionar novos endereços
      const enderecosToAdd = pessoa.pessoas_enderecos
        .filter((e: any) => e.isNew && !deletedEnderecos.includes(e.id))
        .map(({ id, isNew, ...endereco }) => ({
          pessoa_id: pessoa.id,
          titulo: endereco.titulo || '',
          cep: endereco.cep || '',
          logradouro: endereco.logradouro || '',
          numero: endereco.numero || '',
          complemento: endereco.complemento || '',
          bairro: endereco.bairro || '',
          localidade: endereco.localidade || '',
          uf: endereco.uf || '',
          ibge: endereco.ibge || '',
          gia: endereco.gia || '',
          ddd: endereco.ddd || '',
          siafi: endereco.siafi || '',
          principal: endereco.principal || false
        }))

      if (enderecosToAdd.length > 0) {
        const { error: insertEnderecosError } = await supabase
          .from("pessoas_enderecos")
          .insert(enderecosToAdd)

        if (insertEnderecosError) throw insertEnderecosError
      }

      // Atualizar contatos existentes (apenas os que já existem no banco)
      const existingContatos = pessoa.pessoas_contatos
        .filter((c: any) => !c.isNew && !deletedContatos.includes(c.id) && typeof c.id === 'number')
        .map(({ isNew, ...contato }: any) => contato)

      for (const contato of existingContatos) {
        const { error: updateContatoError } = await supabase
          .from("pessoas_contatos")
          .update(contato)
          .eq('id', contato.id)

        if (updateContatoError) throw updateContatoError
      }

      // Atualizar endereços existentes (apenas os que já existem no banco)
      const existingEnderecos = pessoa.pessoas_enderecos
        .filter((e: any) => !e.isNew && !deletedEnderecos.includes(e.id) && typeof e.id === 'number')
        .map(({ isNew, ...endereco }: any) => endereco)

      for (const endereco of existingEnderecos) {
        const { error: updateEnderecoError } = await supabase
          .from("pessoas_enderecos")
          .update(endereco)
          .eq('id', endereco.id)

        if (updateEnderecoError) throw updateEnderecoError
      }

      // Limpar estados locais
      setNewContatos([])
      setDeletedContatos([])
      setNewEnderecos([])
      setDeletedEnderecos([])
      setTouchedFields({})
      setHasChanges(false)
      
      // Recarregar dados
      const { data: refreshedData, error: refreshError } = await supabase
        .from("pessoas")
        .select(`
          *,
          pessoas_contatos (*),
          pessoas_enderecos (*)
        `)
        .eq('id', pessoaId)
        .single()

      if (refreshError) throw refreshError

      // Atualizar estados com os dados atualizados
      setPessoa(refreshedData)
      setOriginalPessoa(refreshedData)

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!",
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

  const handleAddContato = () => {
    const newContato = {
      id: `temp_${Date.now()}`, // ID temporário para identificação local
      pessoa_id: pessoaId,
      contato: "",
      cargo: "",
      departamento: "",
      email: "",
      celular: "",
      telefone: "",
      zap: false,
      isNew: true
    }

    setNewContatos(prev => [...prev, newContato])
    setPessoa((prevPessoa: any) => ({
      ...prevPessoa,
      pessoas_contatos: [...prevPessoa.pessoas_contatos, newContato]
    }))
  }

  const handleRemoveContato = (id: number | string) => {
    if (typeof id === 'number') {
      setDeletedContatos(prev => [...prev, id])
    }
    
    setNewContatos(prev => prev.filter(c => c.id !== id))
    setPessoa((prevPessoa: any) => ({
      ...prevPessoa,
      pessoas_contatos: prevPessoa.pessoas_contatos.filter((c: any) => c.id !== id)
    }))
  }

  const handleAddEndereco = () => {
    const newEndereco = {
      id: `temp_${Date.now()}`,
      pessoa_id: pessoaId,
      titulo: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
      ibge: "",
      gia: "",
      ddd: "",
      siafi: "",
      principal: pessoa.pessoas_enderecos.length === 0,
      isNew: true
    }

    setNewEnderecos(prev => [...prev, newEndereco])
    setPessoa((prevPessoa: any) => ({
      ...prevPessoa,
      pessoas_enderecos: [...prevPessoa.pessoas_enderecos, newEndereco]
    }))
  }

  const handleRemoveEndereco = (id: number | string) => {
    if (typeof id === 'number') {
      setDeletedEnderecos(prev => [...prev, id])
    }
    
    setNewEnderecos(prev => prev.filter(e => e.id !== id))
    setPessoa((prevPessoa: any) => ({
      ...prevPessoa,
      pessoas_enderecos: prevPessoa.pessoas_enderecos.filter((e: any) => e.id !== id)
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

  // Buscar grupos e subgrupos
  useEffect(() => {
    async function fetchGruposSubgrupos() {
      try {
        // Carrega grupos
        const { data: gruposData, error: gruposError } = await supabase
          .from("grupos")
          .select("*")
          .eq("tipo", 1)  // tipo 1 = grupos de pessoas
          .eq("perfis_id", perfil?.id)
          .order("grupo")

        if (gruposError) throw gruposError
        setGrupos(gruposData || [])

        // Carrega subgrupos apenas dos grupos carregados
        if (gruposData && gruposData.length > 0) {
          const gruposIds = gruposData.map(g => g.id)
          const { data: subGruposData, error: subGruposError } = await supabase
            .from("sub_grupos")
            .select("*")
            .in("grupos_id", gruposIds)
            .order("subgrupo")

          if (subGruposError) throw subGruposError
          setSubGrupos(subGruposData || [])
        } else {
          setSubGrupos([])
        }
      } catch (err: any) {
        toast({
          title: "Erro ao carregar grupos",
          description: err.message,
          variant: "destructive"
        })
      }
    }

    if (isOpen && perfil?.id) {
      fetchGruposSubgrupos()
    }
  }, [isOpen, perfil?.id, supabase, toast])

  // Função para atualizar grupos da pessoa
  const handleGruposChange = (selectedGrupos: number[]) => {
    // Filtra subgrupos que não pertencem mais aos grupos selecionados
    const validSubgrupos = (pessoa?.subgrupos_ids || []).filter(subId => {
      const subgrupo = subGrupos.find(s => s.id === subId)
      return subgrupo && selectedGrupos.includes(subgrupo.grupos_id)
    })

    setPessoa(prev => ({
      ...prev,
      grupos_ids: selectedGrupos,
      subgrupos_ids: validSubgrupos
    }))
  }

  // Função para obter o nome do grupo pai do subgrupo
  const getGrupoNome = (grupoId: number) => {
    const grupo = grupos.find(g => g.id === grupoId)
    return grupo?.grupo || ""
  }

  // Função para atualizar subgrupos da pessoa
  const handleSubGruposChange = (selectedSubGrupos: number[]) => {
    setPessoa(prev => ({
      ...prev,
      subgrupos_ids: selectedSubGrupos
    }))
  }

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
  const formatCEP = (cep: string) => {
    cep = cep.replace(/\D/g, '')
    if (cep.length <= 8) {
      cep = cep.replace(/^(\d{5})(\d)/, '$1-$2')
    }
    return cep
  }

  // Busca endereço pelo CEP
  const handleCepChange = async (index: number, value: string) => {
    try {
      const cep = value.replace(/\D/g, '')
      
      if (cep.length === 8) {
        toast({
          title: "Buscando CEP...",
          description: "Aguarde enquanto buscamos o endereço",
          variant: "default"
        })

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "Verifique o CEP digitado",
            variant: "destructive"
          })
          return
        }

        const newEnderecos = [...pessoa.pessoas_enderecos]
        newEnderecos[index] = {
          ...newEnderecos[index],
          cep: cep,
          logradouro: data.logradouro || newEnderecos[index].logradouro,
          bairro: data.bairro || newEnderecos[index].bairro,
          localidade: data.localidade || newEnderecos[index].localidade,
          uf: data.uf || newEnderecos[index].uf,
          ibge: data.ibge || newEnderecos[index].ibge,
          gia: data.gia || newEnderecos[index].gia,
          ddd: data.ddd || newEnderecos[index].ddd,
          siafi: data.siafi || newEnderecos[index].siafi
        }

        setPessoa(prevPessoa => ({
          ...prevPessoa,
          pessoas_enderecos: newEnderecos
        }))

        toast({
          title: "Sucesso",
          description: "Endereço preenchido automaticamente",
          variant: "success"
        })
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast({
        title: "Erro",
        description: "Erro ao buscar o CEP. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pessoaId || !perfil?.id) return

    try {
      // Validação do tamanho do arquivo (2MB)
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. O tamanho máximo permitido é 2MB.')
      }

      // Criar URL temporária para a imagem
      const fileUrl = URL.createObjectURL(file)
      setSelectedFile(file)
      setSelectedFileUrl(fileUrl)
      setIsCropDialogOpen(true)
    } catch (err: any) {
      console.error('Erro ao processar arquivo:', err)
      toast({
        title: "Erro ao processar imagem",
        description: err.message,
        variant: "destructive"
      })
    }
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!pessoaId || !perfil?.id || !selectedFile) return

    try {
      setLoading(true)
      
      // Converter base64 para blob
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      
      // Remove foto antiga se existir
      if (pessoa.foto_url) {
        const oldFileUrl = new URL(pessoa.foto_url)
        const oldFilePath = oldFileUrl.pathname.split('/').pop()
        if (oldFilePath) {
          await supabase
            .storage
            .from('Perfis')
            .remove([`${perfil.id}/pessoas_fotos/${pessoaId}/${oldFilePath}`])
        }
      }
      
      // Criar nome único para o arquivo
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${perfil.id}/pessoas_fotos/${pessoaId}/${fileName}`

      // Upload para o bucket 'Perfis' no Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('Perfis')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          throw new Error('Já existe uma foto com este nome. Tente novamente.')
        }
        throw uploadError
      }

      // Obtém a URL pública do arquivo
      const { data: { publicUrl } } = supabase
        .storage
        .from('Perfis')
        .getPublicUrl(filePath)

      // Atualiza a pessoa com a nova URL da foto
      const { error: updateError } = await supabase
        .from('pessoas')
        .update({ foto_url: publicUrl })
        .eq('id', pessoaId)
        .eq('perfis_id', perfil.id)

      if (updateError) {
        // Se falhar ao atualizar o banco, remove a foto do storage
        await supabase
          .storage
          .from('Perfis')
          .remove([filePath])
        throw updateError
      }

      // Atualiza o estado local
      setPessoa(prev => ({
        ...prev,
        foto_url: publicUrl
      }))

      // Atualiza apenas o campo foto_url no originalPessoa, mantendo os outros campos como estavam
      const originalPessoaObj = JSON.parse(originalPessoa || '{}')
      setOriginalPessoa(JSON.stringify({
        ...originalPessoaObj,
        foto_url: publicUrl
      }))

      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
        variant: "success"
      })
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      toast({
        title: "Erro ao fazer upload",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      // Limpar URLs temporárias
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl)
      }
      setSelectedFile(null)
      setSelectedFileUrl("")
    }
  }

  const handleConfirmRemove = async () => {
    if (!itemToRemove) return

    try {
      setLoading(true)

      if (itemToRemove.type === 'contato') {
        if (typeof itemToRemove.id === 'number') {
          const { error } = await supabase
            .from("pessoas_contatos")
            .delete()
            .eq("id", itemToRemove.id)

          if (error) throw error
        }
        
        const newPessoa = {
          ...pessoa,
          pessoas_contatos: pessoa.pessoas_contatos.filter((c: any) => c.id !== itemToRemove.id)
        }
        setPessoa(newPessoa)
        setOriginalPessoa(newPessoa)
        setNewContatos(prev => prev.filter(c => c.id !== itemToRemove.id))
      } else {
        if (typeof itemToRemove.id === 'number') {
          const { error } = await supabase
            .from("pessoas_enderecos")
            .delete()
            .eq("id", itemToRemove.id)

          if (error) throw error
        }
        
        const newPessoa = {
          ...pessoa,
          pessoas_enderecos: pessoa.pessoas_enderecos.filter((e: any) => e.id !== itemToRemove.id)
        }
        setPessoa(newPessoa)
        setOriginalPessoa(newPessoa)
        setNewEnderecos(prev => prev.filter(e => e.id !== itemToRemove.id))
      }

      toast({
        title: "Sucesso",
        description: `${itemToRemove.type === 'contato' ? 'Contato' : 'Endereço'} removido com sucesso!`,
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
      setIsConfirmRemoveDialogOpen(false)
      setItemToRemove(null)
    }
  }

  const handleCancelRemove = () => {
    setIsConfirmRemoveDialogOpen(false)
    setItemToRemove(null)
  }

  const confirmRemove = (type: 'contato' | 'endereco', id: number | string) => {
    setItemToRemove({ type, id })
    setIsConfirmRemoveDialogOpen(true)
  }

  const handleClose = () => {
    if (hasChanges) {
      setIsConfirmDialogOpen(true)
      setPendingClose(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setIsConfirmDialogOpen(false)
    setPendingClose(false)
    onClose()
  }

  const handleCancelClose = () => {
    setIsConfirmDialogOpen(false)
    setPendingClose(false)
  }

  const handlePessoaChange = (field: string, value: string) => {
    setPessoa(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContatoChange = (index: number, field: string, value: string) => {
    const newContatos = [...pessoa.pessoas_contatos]
    newContatos[index] = {
      ...newContatos[index],
      [field]: value
    }
    setPessoa(prev => ({
      ...prev,
      pessoas_contatos: newContatos
    }))
  }

  const handleSetPrincipal = (id: number) => {
    const newEnderecos = pessoa.pessoas_enderecos.map((endereco: any) => {
      if (endereco.id === id) {
        return {
          ...endereco,
          principal: true
        }
      } else {
        return {
          ...endereco,
          principal: false
        }
      }
    })
    setPessoa(prev => ({
      ...prev,
      pessoas_enderecos: newEnderecos
    }))
  }

  const handleEnderecoChange = (index: number, field: string, value: string) => {
    setPessoa(prevPessoa => ({
      ...prevPessoa,
      pessoas_enderecos: prevPessoa.pessoas_enderecos.map((endereco: any, i: number) =>
        i === index ? { ...endereco, [field]: value } : endereco
      )
    }))
  }

  if (!pessoa || loading) {
    return (
      <PessoaEditSheet 
        open={isOpen} 
        onOpenChange={handleClose}
        loading={loading}
      >
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
      onOpenChange={handleClose} 
      loading={loading}
      pessoa={{
        apelido: pessoa?.apelido,
        nome_razao: pessoa?.nome_razao
      }}
      hasChanges={hasChanges}
      onSave={handleSave}
    >
      <PessoaEditSheetContent>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Erros de validação:</h3>
                <ul className="list-disc pl-4">
                  {Object.values(validationErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
              <DialogContent 
                className="max-w-fit p-0 gap-0 bg-transparent border-0 mx-auto 
                  [&>button]:h-6 [&>button]:w-6 [&>button]:rounded-full [&>button]:hover:bg-black/20 
                  [&>button]:bg-transparent [&>button]:text-white/90 [&>button]:top-2 [&>button]:right-2
                  [&>button]:flex [&>button]:items-center [&>button]:justify-center
                  [&>button:focus]:outline-none [&>button:focus]:ring-0 [&>button:focus]:ring-offset-0
                  [&>button>svg]:h-3 [&>button>svg]:w-3"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute top-0 left-0 right-0 flex items-center px-4 py-2 bg-black/20 backdrop-blur-sm">
                    <DialogTitle className="text-sm text-white/90">
                      {pessoa.nome_razao || 'Visualizar foto'}
                    </DialogTitle>
                  </div>
                  <img 
                    src={pessoa.foto_url} 
                    alt={pessoa.nome_razao || 'Foto'} 
                    className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <ImageCropDialog
              isOpen={isCropDialogOpen}
              onClose={() => {
                setIsCropDialogOpen(false)
                if (selectedFileUrl) {
                  URL.revokeObjectURL(selectedFileUrl)
                }
                setSelectedFile(null)
                setSelectedFileUrl("")
              }}
              imageUrl={selectedFileUrl}
              onCropComplete={handleCropComplete}
            />

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Alterações não salvas</DialogTitle>
                <div className="grid gap-4 py-4">
                  <p>Existem alterações não salvas. Deseja realmente sair sem salvar?</p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleConfirmClose}
                  >
                    Sair sem salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isConfirmRemoveDialogOpen} onOpenChange={setIsConfirmRemoveDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Confirmar Remoção</DialogTitle>
                <div className="grid gap-4 py-4">
                  <p>
                    {itemToRemove?.type === 'contato' 
                      ? "Tem certeza que deseja remover este contato?" 
                      : "Tem certeza que deseja remover este endereço?"
                    }
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelRemove}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleConfirmRemove}
                  >
                    Remover
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Card Principal - Dados Básicos */}
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <div className="flex items-start gap-6">
                {/* Área da Foto */}
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer overflow-hidden group"
                    onClick={() => pessoa.foto_url ? setIsPhotoModalOpen(true) : document.getElementById('photo-upload')?.click()}
                  >
                    {pessoa.foto_url ? (
                      <>
                        <img 
                          src={pessoa.foto_url} 
                          alt={pessoa.nome_razao || 'Foto'} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Clique para adicionar foto</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadFoto}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <PencilLine className="w-3 h-3 mr-1" />
                    Editar Foto
                  </Button>
                </div>

                {/* Dados Principais */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Dados Principais</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Cards Expansíveis */}
            <ExpandableCard
              title={
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Endereços</h3>
                </div>
              }
              defaultExpanded={false}
              className="overflow-visible"
            >
              <div className="space-y-6">
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
                          onClick={() => confirmRemove('endereco', endereco.id)}
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
                          onChange={(e) => {
                            e.preventDefault()
                            const formattedCep = formatCEP(e.target.value)
                            handleEnderecoChange(index, 'cep', formattedCep)
                            if (formattedCep.length === 9) { // 12345-678
                              handleCepChange(index, formattedCep)
                            }
                          }}
                          onBlur={() => markFieldAsTouched(`endereco_${index}_cep`)}
                          className={cn(
                            isFieldInvalid(`endereco_${index}_cep`, endereco.cep) && 
                            "border-destructive",
                            "w-full"
                          )}
                          placeholder="CEP"
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
                        <div className="flex gap-4">
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
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <RequiredLabel value={endereco.localidade}>
                            <Label>Cidade</Label>
                          </RequiredLabel>
                          <Input
                            value={endereco.localidade || ""}
                            onChange={(e) => handleEnderecoChange(index, "localidade", e.target.value)}
                            onBlur={() => markFieldAsTouched(`endereco_${index}_localidade`)}
                            className={cn(
                              isFieldInvalid(`endereco_${index}_localidade`, endereco.localidade) && 
                              "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                        </div>
                        <div className="w-20 space-y-2">
                          <RequiredLabel value={endereco.uf}>
                            <Label>UF</Label>
                          </RequiredLabel>
                          <Input
                            value={endereco.uf || ""}
                            onChange={(e) => {
                              const upperValue = e.target.value.toUpperCase();
                              handleEnderecoChange(index, "uf", upperValue);
                            }}
                            onBlur={() => markFieldAsTouched(`endereco_${index}_uf`)}
                            className={cn(
                              isFieldInvalid(`endereco_${index}_uf`, endereco.uf) && 
                              "border-destructive focus-visible:ring-destructive"
                            )}
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Botão de adicionar no rodapé */}
                <Button
                  onClick={handleAddEndereco}
                  className="w-full mt-4"
                  variant="outline"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>
            </ExpandableCard>

            <ExpandableCard
              title={
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Contatos</h3>
                </div>
              }
              defaultExpanded={false}
              className="overflow-visible"
            >
              <div className="space-y-6">
                {pessoa.pessoas_contatos.map((contato: any, index: number) => (
                  <div key={contato.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Contato {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmRemove('contato', contato.id)}
                      >
                        Remover
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label>Nome do Contato</Label>
                          <span className={cn("text-destructive", contato.contato && "invisible")}>*</span>
                        </div>
                        <Input
                          value={contato.contato || ""}
                          onChange={(e) => handleContatoChange(index, "contato", e.target.value)}
                          onBlur={() => markFieldAsTouched(`contato_${index}_contato`)}
                          className={cn(
                            isFieldInvalid(`contato_${index}_contato`, contato.contato) && 
                            "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={contato.email || ""}
                          onChange={(e) => handleContatoChange(index, "email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Celular</Label>
                        <div className="flex gap-2">
                          <Input
                            value={formatPhoneNumber(contato.celular || "")}
                            onChange={(e) => handleContatoChange(index, "celular", e.target.value)}
                          />
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Switch
                              id={`zap_${contato.id}`}
                              checked={contato.zap || false}
                              onCheckedChange={(checked) => 
                                handleContatoChange(index, "zap", checked)
                              }
                            />
                            <label
                              htmlFor={`zap_${contato.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              WhatsApp
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          value={contato.cargo || ""}
                          onChange={(e) => handleContatoChange(index, "cargo", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Input
                          value={contato.departamento || ""}
                          onChange={(e) => handleContatoChange(index, "departamento", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={formatPhoneNumber(contato.telefone || "")}
                          onChange={(e) => handleContatoChange(index, "telefone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={handleAddContato}
                  className="w-full mt-4"
                  variant="outline"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </div>
            </ExpandableCard>

            <ExpandableCard
              title={
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Grupos e Subgrupos</h3>
                </div>
              }
              defaultExpanded={false}
              className="!overflow-visible"
            >
              <div className="space-y-6 overflow-visible">
                <div className="space-y-2">
                  <Label>Grupos</Label>
                  <div className="relative">
                    <MultiSelect
                      options={grupos.map(grupo => ({
                        label: grupo.grupo,
                        value: grupo.id.toString()
                      }))}
                      selected={pessoa?.grupos_ids?.map(id => id.toString()) || []}
                      onChange={values => handleGruposChange(values.map(v => parseInt(v)))}
                      placeholder="Selecione os grupos..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subgrupos</Label>
                  <div className="relative">
                    <MultiSelect
                      options={subGrupos
                        .filter(sub => pessoa?.grupos_ids?.includes(sub.grupos_id))
                        .map(sub => ({
                          label: `${getGrupoNome(sub.grupos_id)} › ${sub.subgrupo}`,
                          value: sub.id.toString()
                        }))}
                      selected={pessoa?.subgrupos_ids?.map(id => id.toString()) || []}
                      onChange={values => handleSubGruposChange(values.map(v => parseInt(v)))}
                      placeholder="Selecione os subgrupos..."
                      disabled={!pessoa?.grupos_ids?.length}
                    />
                  </div>
                  {!pessoa?.grupos_ids?.length && (
                    <p className="text-sm text-muted-foreground">
                      Selecione pelo menos um grupo para ver os subgrupos disponíveis
                    </p>
                  )}
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard
              title={
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Informações Fiscais</h3>
                </div>
              }
              defaultExpanded={false}
              className="overflow-visible"
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

            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h4 className="text-sm font-medium mb-4">Outras Informações</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input
                    value={pessoa?.obs || ""}
                    onChange={(e) => handlePessoaChange("obs", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PessoaEditSheetContent>
    </PessoaEditSheet>
  )
}
