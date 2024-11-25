"use client"

import { useEffect, useState } from "react"
import { PessoaEditSheet, PessoaEditSheetContent } from "./pessoa-edit-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePerfil } from "@/contexts/perfil"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PessoaEditProps {
  pessoaId: number | null
  isOpen: boolean
  onClose: () => void
}

export function PessoaEdit({ pessoaId, isOpen, onClose }: PessoaEditProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()
  const [pessoa, setPessoa] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pessoaId && isOpen && mounted) {
      loadPessoa()
    }
  }, [pessoaId, isOpen, mounted])

  const loadPessoa = async () => {
    try {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("pessoas")
        .select(`
          *,
          pessoas_enderecos(*),
          pessoas_contatos(*)
        `)
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)
        .single()

      if (error) throw error

      setPessoa(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const validateFields = () => {
    const errors = []

    // Validação dos campos da pessoa
    if (!pessoa.nome_razao) {
      errors.push("Nome/Razão Social é obrigatório")
    }

    if (!pessoa.documento) {
      errors.push("CPF/CNPJ é obrigatório")
    }

    if (!pessoa.tipo) {
      errors.push("Tipo de pessoa é obrigatório")
    }

    // Validação dos endereços
    if (pessoa.pessoas_enderecos.length > 0) {
      for (const [index, endereco] of pessoa.pessoas_enderecos.entries()) {
        if (!endereco.cep) {
          errors.push(`CEP do endereço ${index + 1} é obrigatório`)
        }
        if (!endereco.logradouro) {
          errors.push(`Logradouro do endereço ${index + 1} é obrigatório`)
        }
        if (!endereco.numero) {
          errors.push(`Número do endereço ${index + 1} é obrigatório`)
        }
        if (!endereco.bairro) {
          errors.push(`Bairro do endereço ${index + 1} é obrigatório`)
        }
        if (!endereco.localidade) {
          errors.push(`Cidade do endereço ${index + 1} é obrigatório`)
        }
        if (!endereco.uf) {
          errors.push(`UF do endereço ${index + 1} é obrigatório`)
        }
      }
    }

    // Validação dos contatos
    if (pessoa.pessoas_contatos.length > 0) {
      for (const [index, contato] of pessoa.pessoas_contatos.entries()) {
        if (!contato.tipo) {
          errors.push(`Tipo do contato ${index + 1} é obrigatório`)
        }
        if (!contato.valor) {
          errors.push(`Valor do contato ${index + 1} é obrigatório`)
        }
      }
    }

    return errors
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      // Validação dos campos
      const errors = validateFields()
      if (errors.length > 0) {
        throw new Error(errors.join("\n"))
      }

      // Atualiza a pessoa
      const { error: pessoaError } = await supabase
        .from("pessoas")
        .update({
          nome: pessoa.nome,
          nome_fantasia: pessoa.nome_fantasia,
          documento: pessoa.documento,
          tipo: pessoa.tipo,
          inscricao_estadual: pessoa.inscricao_estadual,
          inscricao_municipal: pessoa.inscricao_municipal,
          inscricao_suframa: pessoa.inscricao_suframa,
          regime_tributario: pessoa.regime_tributario,
          cnae_principal: pessoa.cnae_principal,
          cnae_secundario: pessoa.cnae_secundario,
          situacao_fiscal: pessoa.situacao_fiscal,
          contribuinte_icms: pessoa.contribuinte_icms,
          retem_iss: pessoa.retem_iss,
          retem_irrf: pessoa.retem_irrf,
          retem_inss: pessoa.retem_inss,
          retem_pis: pessoa.retem_pis,
          retem_cofins: pessoa.retem_cofins,
          retem_csll: pessoa.retem_csll,
          updated_at: new Date().toISOString()
        })
        .eq("id", pessoaId)
        .eq("perfis_id", perfil.id)

      if (pessoaError) throw pessoaError

      // Atualiza os endereços
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
              localidade: endereco.localidade,
              uf: endereco.uf,
              ibge: endereco.ibge,
              principal: endereco.principal,
              updated_at: new Date().toISOString()
            })
            .eq("id", endereco.id)

          if (enderecoError) throw enderecoError
        }
      }

      // Atualiza os contatos
      for (const contato of pessoa.pessoas_contatos) {
        if (contato.id) {
          const { error: contatoError } = await supabase
            .from("pessoas_contatos")
            .update({
              tipo: contato.tipo,
              valor: contato.valor,
              descricao: contato.descricao,
              observacao: contato.observacao,
              principal: contato.principal,
              updated_at: new Date().toISOString()
            })
            .eq("id", contato.id)

          if (contatoError) throw contatoError
        }
      }

      toast({
        title: "Sucesso",
        description: "Pessoa atualizada com sucesso!",
        variant: "success"
      })

      onClose()
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

  const handleBuscarCep = async (index: number) => {
    try {
      setLoading(true)
      setError("")

      const cep = pessoa.pessoas_enderecos[index].cep.replace(/\D/g, "")

      if (cep.length !== 8) {
        throw new Error("CEP inválido")
      }

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        throw new Error("CEP não encontrado")
      }

      setPessoa((prevPessoa: any) => {
        const newPessoasEnderecos = prevPessoa.pessoas_enderecos.map((endereco: any, enderecoIndex: number) => {
          if (enderecoIndex === index) {
            endereco.logradouro = data.logradouro
            endereco.bairro = data.bairro
            endereco.localidade = data.localidade
            endereco.uf = data.uf
            endereco.ibge = data.ibge
          }
          return endereco
        })
        return { ...prevPessoa, pessoas_enderecos: newPessoasEnderecos }
      })

      toast({
        title: "Sucesso",
        description: "Endereço preenchido com sucesso!",
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

  return mounted ? (
    <div suppressHydrationWarning>
      <PessoaEditSheet 
        open={isOpen} 
        onClose={onClose}
        onSave={handleSave}
        loading={loading}
      >
        <PessoaEditSheetContent>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-4 pb-6">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <Tabs defaultValue="geral" className="h-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="endereco">Endereço</TabsTrigger>
                    <TabsTrigger value="contato">Contato</TabsTrigger>
                    <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="geral">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome_razao">
                            {pessoa?.tipo === "F" ? "Nome Completo" : "Razão Social"}
                          </Label>
                          <Input
                            id="nome_razao"
                            value={pessoa?.nome_razao || ""}
                            onChange={(e) => 
                              handlePessoaChange("nome_razao", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apelido">
                            {pessoa?.tipo === "F" ? "Apelido" : "Nome Fantasia"}
                          </Label>
                          <Input
                            id="apelido"
                            value={pessoa?.apelido || ""}
                            onChange={(e) => 
                              handlePessoaChange("apelido", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="endereco" className="space-y-4">
                    {pessoa?.pessoas_enderecos?.map((endereco: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Endereço {endereco.principal ? "(Principal)" : ""}
                          </h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetPrincipal(endereco.id)}
                              disabled={endereco.principal}
                            >
                              Tornar Principal
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveEndereco(endereco.id)}
                              disabled={endereco.principal}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`cep-${index}`}>CEP</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`cep-${index}`}
                                value={endereco.cep || ""}
                                onChange={(e) => handleEnderecoChange(index, "cep", e.target.value)}
                              />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleBuscarCep(index)}
                              >
                                Buscar
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor={`logradouro-${index}`}>Logradouro</Label>
                            <Input
                              id={`logradouro-${index}`}
                              value={endereco.logradouro || ""}
                              onChange={(e) => handleEnderecoChange(index, "logradouro", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`numero-${index}`}>Número</Label>
                            <Input
                              id={`numero-${index}`}
                              value={endereco.numero || ""}
                              onChange={(e) => handleEnderecoChange(index, "numero", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`complemento-${index}`}>Complemento</Label>
                            <Input
                              id={`complemento-${index}`}
                              value={endereco.complemento || ""}
                              onChange={(e) => handleEnderecoChange(index, "complemento", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`bairro-${index}`}>Bairro</Label>
                            <Input
                              id={`bairro-${index}`}
                              value={endereco.bairro || ""}
                              onChange={(e) => handleEnderecoChange(index, "bairro", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`localidade-${index}`}>Cidade</Label>
                            <Input
                              id={`localidade-${index}`}
                              value={endereco.localidade || ""}
                              onChange={(e) => handleEnderecoChange(index, "localidade", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`uf-${index}`}>UF</Label>
                            <Input
                              id={`uf-${index}`}
                              value={endereco.uf || ""}
                              onChange={(e) => handleEnderecoChange(index, "uf", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`ibge-${index}`}>Código IBGE</Label>
                            <Input
                              id={`ibge-${index}`}
                              value={endereco.ibge || ""}
                              onChange={(e) => handleEnderecoChange(index, "ibge", e.target.value)}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      onClick={handleAddEndereco}
                      className="w-full"
                    >
                      Adicionar Endereço
                    </Button>
                  </TabsContent>

                  <TabsContent value="contato" className="space-y-4">
                    {pessoa?.pessoas_contatos?.map((contato: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Contato {contato.principal ? "(Principal)" : ""}
                          </h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetPrincipalContato(contato.id)}
                              disabled={contato.principal}
                            >
                              Tornar Principal
                            </Button>
                            <Button 
                              variant="outline" 
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
                            <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                            <Select
                              value={contato.tipo || ""}
                              onValueChange={(value) => handleContatoChange(index, "tipo", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="telefone">Telefone</SelectItem>
                                <SelectItem value="celular">Celular</SelectItem>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="telegram">Telegram</SelectItem>
                                <SelectItem value="website">Website</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`valor-${index}`}>Valor</Label>
                            <Input
                              id={`valor-${index}`}
                              value={contato.valor || ""}
                              onChange={(e) => handleContatoChange(index, "valor", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`descricao-${index}`}>Descrição</Label>
                            <Input
                              id={`descricao-${index}`}
                              value={contato.descricao || ""}
                              onChange={(e) => handleContatoChange(index, "descricao", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`observacao-${index}`}>Observação</Label>
                            <Input
                              id={`observacao-${index}`}
                              value={contato.observacao || ""}
                              onChange={(e) => handleContatoChange(index, "observacao", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      onClick={handleAddContato}
                      className="w-full"
                    >
                      Adicionar Contato
                    </Button>
                  </TabsContent>

                  <TabsContent value="fiscal" className="space-y-4">
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="text-lg font-semibold">Informações Fiscais</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                          <Input
                            id="inscricao_estadual"
                            value={pessoa?.inscricao_estadual || ""}
                            onChange={(e) => handlePessoaChange("inscricao_estadual", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                          <Input
                            id="inscricao_municipal"
                            value={pessoa?.inscricao_municipal || ""}
                            onChange={(e) => handlePessoaChange("inscricao_municipal", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inscricao_suframa">Inscrição SUFRAMA</Label>
                          <Input
                            id="inscricao_suframa"
                            value={pessoa?.inscricao_suframa || ""}
                            onChange={(e) => handlePessoaChange("inscricao_suframa", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="regime_tributario">Regime Tributário</Label>
                          <Select
                            value={pessoa?.regime_tributario || ""}
                            onValueChange={(value) => handlePessoaChange("regime_tributario", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o regime tributário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simples">Simples Nacional</SelectItem>
                              <SelectItem value="presumido">Lucro Presumido</SelectItem>
                              <SelectItem value="real">Lucro Real</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cnae_principal">CNAE Principal</Label>
                          <Input
                            id="cnae_principal"
                            value={pessoa?.cnae_principal || ""}
                            onChange={(e) => handlePessoaChange("cnae_principal", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cnae_secundario">CNAE Secundário</Label>
                          <Input
                            id="cnae_secundario"
                            value={pessoa?.cnae_secundario || ""}
                            onChange={(e) => handlePessoaChange("cnae_secundario", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="text-lg font-semibold">Configurações Fiscais</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="situacao_fiscal">Situação Fiscal</Label>
                          <Select
                            value={pessoa?.situacao_fiscal || ""}
                            onValueChange={(value) => handlePessoaChange("situacao_fiscal", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a situação fiscal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="suspenso">Suspenso</SelectItem>
                              <SelectItem value="baixado">Baixado</SelectItem>
                              <SelectItem value="inapto">Inapto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contribuinte_icms">Contribuinte ICMS</Label>
                          <Select
                            value={pessoa?.contribuinte_icms || ""}
                            onValueChange={(value) => handlePessoaChange("contribuinte_icms", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de contribuinte" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Contribuinte ICMS</SelectItem>
                              <SelectItem value="2">Contribuinte isento</SelectItem>
                              <SelectItem value="9">Não Contribuinte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_iss">Retenção de ISS</Label>
                          <Select
                            value={pessoa?.retem_iss || ""}
                            onValueChange={(value) => handlePessoaChange("retem_iss", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de ISS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_irrf">Retenção de IRRF</Label>
                          <Select
                            value={pessoa?.retem_irrf || ""}
                            onValueChange={(value) => handlePessoaChange("retem_irrf", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de IRRF" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_inss">Retenção de INSS</Label>
                          <Select
                            value={pessoa?.retem_inss || ""}
                            onValueChange={(value) => handlePessoaChange("retem_inss", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de INSS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_pis">Retenção de PIS</Label>
                          <Select
                            value={pessoa?.retem_pis || ""}
                            onValueChange={(value) => handlePessoaChange("retem_pis", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de PIS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_cofins">Retenção de COFINS</Label>
                          <Select
                            value={pessoa?.retem_cofins || ""}
                            onValueChange={(value) => handlePessoaChange("retem_cofins", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de COFINS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="retem_csll">Retenção de CSLL</Label>
                          <Select
                            value={pessoa?.retem_csll || ""}
                            onValueChange={(value) => handlePessoaChange("retem_csll", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a retenção de CSLL" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim">Sim</SelectItem>
                              <SelectItem value="nao">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </PessoaEditSheetContent>
      </PessoaEditSheet>
    </div>
  ) : null
}
