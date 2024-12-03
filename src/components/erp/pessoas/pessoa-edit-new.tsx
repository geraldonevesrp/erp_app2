import { useEffect, useState } from "react"
import { createClient } from '@/lib/supabase/client'
import { useToast } from "@/components/ui/use-toast"
import { usePerfil } from '@/contexts/perfil'
import { PessoaEditSheet, PessoaEditSheetContent } from "./pessoa-edit-sheet"
import { PessoaDadosGerais } from "./pessoa-dados-gerais"
import { PessoaContatos } from "./pessoa-contatos"
import { PessoaEnderecos } from "./pessoa-enderecos"
import { PessoaGrupos } from "./pessoa-grupos"

interface PessoaEditProps {
  isOpen: boolean
  onClose: () => void
  pessoaId?: number
  onSave?: () => void
}

interface PessoaContato {
  id: number | string
  pessoa_id: number
  contato: string
  telefone: string
  email: string
  isNew?: boolean
}

interface PessoaEndereco {
  id: number | string
  pessoa_id: number
  titulo: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  principal: boolean
  isNew?: boolean
}

interface Grupo {
  id: number
  perfis_id: number
  grupo: string
}

interface SubGrupo {
  id: number
  perfis_id: number
  grupos_id: number
  subgrupo: string
}

interface Pessoa {
  id: number
  perfis_id: number
  apelido: string
  nome_razao: string
  cpf_cnpj: string
  genero_porte: string
  grupos_ids: number[]
  subgrupos_ids: number[]
  pessoas_contatos: PessoaContato[]
  pessoas_enderecos: PessoaEndereco[]
  foto_url?: string
}

export default function PessoaEdit({ isOpen, onClose, pessoaId, onSave }: PessoaEditProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const supabase = createClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [mounted, setMounted] = useState(false)
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [originalPessoa, setOriginalPessoa] = useState<Pessoa | null>(null)
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [subGrupos, setSubGrupos] = useState<SubGrupo[]>([])
  const [newContatos, setNewContatos] = useState<PessoaContato[]>([])
  const [deletedContatos, setDeletedContatos] = useState<number[]>([])
  const [newEnderecos, setNewEnderecos] = useState<PessoaEndereco[]>([])
  const [deletedEnderecos, setDeletedEnderecos] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pessoaId && isOpen && mounted) {
      loadData()
    }
  }, [pessoaId, isOpen, mounted])

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

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      setOriginalPessoa(null)

      // Carregar dados da pessoa
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

      // Carregar grupos
      const { data: gruposData, error: gruposError } = await supabase
        .from("grupos")
        .select("*")
        .eq("perfis_id", perfil.id)
        .eq("tipo", 1)  // Filtrar apenas grupos de pessoas
        .order("grupo")

      if (gruposError) throw gruposError
      setGrupos(gruposData || [])

      // Carregar subgrupos apenas dos grupos carregados
      if (gruposData && gruposData.length > 0) {
        const gruposIds = gruposData.map(g => g.id)
        const { data: subGruposData, error: subGruposError } = await supabase
          .from("sub_grupos")
          .select("*")
          .in("grupos_id", gruposIds)
          .order("subgrupo")

        if (subGruposError) throw subGruposError
        setSubGrupos(subGruposData || [])
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

  const handlePessoaChange = (updates: any) => {
    setPessoa(updates)
    setHasChanges(true)
  }

  const handleFotoUpdated = (novaUrl: string) => {
    setPessoa(prev => ({
      ...prev,
      foto_url: novaUrl
    }))
  }

  const handleAddContato = () => {
    const newContato: PessoaContato = {
      id: `new-${Date.now()}`,
      pessoa_id: pessoaId,
      contato: "",
      telefone: "",
      email: "",
      isNew: true
    }

    setPessoa(prev => ({
      ...prev,
      pessoas_contatos: [...(prev.pessoas_contatos || []), newContato]
    }))
    setNewContatos(prev => [...prev, newContato])
    setHasChanges(true)
  }

  const handleRemoveContato = (contato: PessoaContato) => {
    setPessoa(prev => ({
      ...prev,
      pessoas_contatos: prev.pessoas_contatos.filter((c: PessoaContato) => c.id !== contato.id)
    }))

    if (typeof contato.id === "number") {
      setDeletedContatos(prev => [...prev, contato.id])
    }
    setNewContatos(prev => prev.filter(c => c.id !== contato.id))
    setHasChanges(true)
  }

  const handleAddEndereco = () => {
    const newEndereco: PessoaEndereco = {
      id: `new-${Date.now()}`,
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
      principal: false,
      isNew: true
    }

    setPessoa(prev => ({
      ...prev,
      pessoas_enderecos: [...(prev.pessoas_enderecos || []), newEndereco]
    }))
    setNewEnderecos(prev => [...prev, newEndereco])
    setHasChanges(true)
  }

  const handleRemoveEndereco = (endereco: PessoaEndereco) => {
    setPessoa(prev => ({
      ...prev,
      pessoas_enderecos: prev.pessoas_enderecos.filter((e: PessoaEndereco) => e.id !== endereco.id)
    }))

    if (typeof endereco.id === "number") {
      setDeletedEnderecos(prev => [...prev, endereco.id])
    }
    setNewEnderecos(prev => prev.filter(e => e.id !== endereco.id))
    setHasChanges(true)
  }

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
    setHasChanges(true)
  }

  const handleSubGruposChange = (selectedSubGrupos: number[]) => {
    setPessoa(prev => ({
      ...prev,
      subgrupos_ids: selectedSubGrupos
    }))
    setHasChanges(true)
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
    pessoa.pessoas_enderecos.forEach((endereco: PessoaEndereco, index: number) => {
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
      const invalidSubgrupos = pessoa.subgrupos_ids.filter((subId: number) => {
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

  const handleClose = () => {
    if (hasChanges) {
      // Implementar confirmação de fechamento
      if (confirm("Existem alterações não salvas. Deseja realmente fechar?")) {
        onClose()
      }
    } else {
      onClose()
    }
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
      const invalidContatos = allContatos.filter((c: PessoaContato) => !c.contato?.trim())
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
      const contatosToAdd = newContatos.map(({ id, isNew, ...contato }: PessoaContato) => contato)
      if (contatosToAdd.length > 0) {
        const { error: insertContatosError } = await supabase
          .from("pessoas_contatos")
          .insert(contatosToAdd)

        if (insertContatosError) throw insertContatosError
      }

      // Adicionar novos endereços
      const enderecosToAdd = pessoa.pessoas_enderecos
        .filter((e: PessoaEndereco) => e.isNew && !deletedEnderecos.includes(e.id))
        .map(({ id, isNew, ...endereco }: PessoaEndereco) => ({
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

      // Atualizar contatos existentes
      const existingContatos = pessoa.pessoas_contatos
        .filter((c: PessoaContato) => !c.isNew && !deletedContatos.includes(c.id) && typeof c.id === 'number')
        .map(({ isNew, ...contato }: PessoaContato) => contato)

      for (const contato of existingContatos) {
        const { error: updateContatoError } = await supabase
          .from("pessoas_contatos")
          .update(contato)
          .eq('id', contato.id)

        if (updateContatoError) throw updateContatoError
      }

      // Atualizar endereços existentes
      const existingEnderecos = pessoa.pessoas_enderecos
        .filter((e: PessoaEndereco) => !e.isNew && !deletedEnderecos.includes(e.id) && typeof e.id === 'number')
        .map(({ isNew, ...endereco }: PessoaEndereco) => endereco)

      for (const endereco of existingEnderecos) {
        const { error: updateEnderecoError } = await supabase
          .from("pessoas_enderecos")
          .update(endereco)
          .eq('id', endereco.id)

        if (updateEnderecoError) throw updateEnderecoError
      }

      // Atualizar pessoa
      const { error: updatePessoaError } = await supabase
        .from("pessoas")
        .update({
          apelido: pessoa.apelido,
          nome_razao: pessoa.nome_razao,
          cpf_cnpj: pessoa.cpf_cnpj,
          genero_porte: pessoa.genero_porte,
          grupos_ids: pessoa.grupos_ids,
          subgrupos_ids: pessoa.subgrupos_ids
        })
        .eq('id', pessoaId)
        .eq('perfis_id', perfil.id)

      if (updatePessoaError) throw updatePessoaError

      // Limpar estados locais
      setNewContatos([])
      setDeletedContatos([])
      setNewEnderecos([])
      setDeletedEnderecos([])
      setTouchedFields({})
      setHasChanges(false)
      
      // Recarregar dados
      await loadData()

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!",
        variant: "success"
      })

      // Chamar callback de sucesso se existir
      onSave?.()
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

  return (
    <PessoaEditSheet 
      open={isOpen} 
      onOpenChange={handleClose}
      loading={loading}
      hasChanges={hasChanges}
      pessoa={pessoa}
      onSave={handleSave}
    >
      <PessoaEditSheetContent>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-6 p-6">
              {pessoa && (
                <>
                  <PessoaDadosGerais
                    pessoa={pessoa}
                    loading={loading}
                    validationErrors={validationErrors}
                    touchedFields={touchedFields}
                    onPessoaChange={handlePessoaChange}
                    onFotoUpdated={handleFotoUpdated}
                  />

                  <PessoaContatos
                    pessoa={pessoa}
                    loading={loading}
                    validationErrors={validationErrors}
                    touchedFields={touchedFields}
                    onPessoaChange={handlePessoaChange}
                    onRemoveContato={handleRemoveContato}
                    onAddContato={handleAddContato}
                  />

                  <PessoaEnderecos
                    pessoa={pessoa}
                    loading={loading}
                    validationErrors={validationErrors}
                    touchedFields={touchedFields}
                    onPessoaChange={handlePessoaChange}
                    onRemoveEndereco={handleRemoveEndereco}
                    onAddEndereco={handleAddEndereco}
                  />

                  <PessoaGrupos
                    pessoa={pessoa}
                    loading={loading}
                    grupos={grupos}
                    subGrupos={subGrupos}
                    onGruposChange={handleGruposChange}
                    onSubGruposChange={handleSubGruposChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </PessoaEditSheetContent>
    </PessoaEditSheet>
  )
}
