"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { validateCPF, validateCNPJ, maskCNPJ, unmaskDocument } from "@/lib/utils"
import { usePerfil } from "@/contexts/perfil"
import { PessoaEdit } from "./pessoa-edit"

interface Pessoa {
  id: number
  tipo: "F" | "J"
  cpf_cnpj: string
  rg_ie?: string
  im?: string
  apelido: string
  nome_razao: string
  telefones?: string[]
  emails?: string[]
  nascimento?: string
  genero?: string
  status_id: number
  ramo?: string
  grupos?: string[]
  subgrupos?: string[]
  atividades?: string[]
  endereco_cep?: string
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_localidade?: string
  endereco_uf?: string
  obs?: string
  created_at: string
}

interface AddPessoaDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (id: number) => void
}

export function AddPessoaDialog({ isOpen, onClose, onSuccess }: AddPessoaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const [showEdit, setShowEdit] = useState(false)
  const [newPessoaId, setNewPessoaId] = useState<number | null>(null)

  // Estados para PF
  const [cpf, setCpf] = useState("")
  const [apelidoPF, setApelidoPF] = useState("")
  const [nomePF, setNomePF] = useState("")

  // Estado para PJ
  const [cnpj, setCnpj] = useState("")
  const [apiError, setApiError] = useState<string>("")

  const handleEditClose = () => {
    setShowEdit(false)
    setNewPessoaId(null)
    onSuccess(newPessoaId!)
    onClose()
  }

  // Validação e criação de Pessoa Física
  const handlePFSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validar CPF
      if (!validateCPF(cpf)) {
        throw new Error("CPF inválido")
      }

      // Verificar se já existe
      const { data: existingPF, error: searchError } = await supabase
        .from("pessoas")
        .select("id")
        .eq("cpf_cnpj", cpf)
        .eq("perfis_id", perfil.id)
        .single()

      if (existingPF) {
        throw new Error(`CPF ${cpf} já está cadastrado`)
      }

      // Criar novo registro
      const { data, error: insertError } = await supabase
        .from("pessoas")
        .insert([
          {
            tipo: "F",
            cpf_cnpj: cpf,
            apelido: apelidoPF,
            nome_razao: nomePF,
            status_id: 1,
            perfis_id: perfil.id
          }
        ])
        .select("id")
        .single()

      if (insertError) {
        // Tratamento específico para erro de duplicidade
        if (insertError.code === "23505" && insertError.message.includes("unique_cpf_cnpj_perfis_id")) {
          throw new Error(`CPF ${cpf} já está cadastrado`)
        }
        throw insertError
      }

      setNewPessoaId(data.id)
      setShowEdit(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Validação e criação de Pessoa Jurídica
  const handlePJSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validar CNPJ
      const cleanCNPJ = unmaskDocument(cnpj)
      if (!validateCNPJ(cleanCNPJ)) {
        throw new Error("CNPJ inválido")
      }

      // Verificar se já existe
      const { data: existingPJ, error: searchError } = await supabase
        .from("pessoas")
        .select("id")
        .eq("cpf_cnpj", cleanCNPJ)
        .eq("perfis_id", perfil.id)
        .single()

      if (existingPJ) {
        throw new Error(`CNPJ ${maskCNPJ(cleanCNPJ)} já está cadastrado`)
      }

      // Buscar dados na Nuvem Fiscal
      const nuvemFiscalResponse = await fetch("/api/nuvemfiscal/empresa/" + cleanCNPJ)
      const empresaData = await nuvemFiscalResponse.json()

      if (!empresaData || empresaData.error) {
        console.error("Erro da API:", empresaData)
        setApiError(JSON.stringify(empresaData, null, 2))
        throw new Error("Erro ao buscar dados da empresa")
      }

      // Criar novo registro com dados da API
      const { data, error: insertError } = await supabase
        .from("pessoas")
        .insert([
          {
            tipo: "J",
            cpf_cnpj: cnpj,
            apelido: empresaData.nome_fantasia || empresaData.razao_social,
            nome_razao: empresaData.razao_social,
            status_id: 1,
            perfis_id: perfil.id,
            natureza_juridica: empresaData.natureza_juridica,
            porte: empresaData.porte,
            situacao_cadastral: empresaData.situacao_cadastral,
            atividade_principal: empresaData.atividade_principal,
            atividades_secundarias: empresaData.atividades_secundarias,
            data_inicio_atividades: empresaData.data_inicio_atividades,
            capital_social: empresaData.capital_social,
            matriz: empresaData.matriz
          }
        ])
        .select("id")
        .single()

      if (insertError) {
        // Tratamento específico para erro de duplicidade
        if (insertError.code === "23505" && insertError.message.includes("unique_cpf_cnpj_perfis_id")) {
          throw new Error(`CNPJ ${maskCNPJ(cleanCNPJ)} já está cadastrado`)
        }
        throw insertError
      }

      // Buscar e inserir endereço
      if (empresaData.endereco?.cep) {
        try {
          const viaCepResponse = await fetch(`https://viacep.com.br/ws/${empresaData.endereco.cep}/json/`)
          const cepData = await viaCepResponse.json()

          if (!cepData.erro) {
            await supabase.from("pessoas_enderecos").insert([
              {
                pessoa_id: data.id,
                cep: empresaData.endereco.cep,
                logradouro: cepData.logradouro || empresaData.endereco.logradouro,
                numero: empresaData.endereco.numero,
                complemento: empresaData.endereco.complemento,
                bairro: cepData.bairro || empresaData.endereco.bairro,
                localidade: cepData.localidade || empresaData.endereco.municipio,
                uf: cepData.uf || empresaData.endereco.uf,
                ibge: cepData.ibge,
                ddd: cepData.ddd,
                gia: cepData.gia,
                siafi: cepData.siafi,
                principal: true
              }
            ])
          }
        } catch (cepError) {
          console.error("Erro ao buscar/inserir endereço:", cepError)
        }
      }

      setNewPessoaId(data.id)
      setShowEdit(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showEdit} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Pessoa</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="pf" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pf">Pessoa Física</TabsTrigger>
              <TabsTrigger value="pj">Pessoa Jurídica</TabsTrigger>
            </TabsList>

            <TabsContent value="pf">
              <form onSubmit={handlePFSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apelidoPF">Apelido</Label>
                  <Input
                    id="apelidoPF"
                    value={apelidoPF}
                    onChange={(e) => setApelidoPF(e.target.value)}
                    placeholder="Como a pessoa é conhecida"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomePF">Nome Completo</Label>
                  <Input
                    id="nomePF"
                    value={nomePF}
                    onChange={(e) => setNomePF(e.target.value)}
                    placeholder="Nome completo da pessoa"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="pj">
              <form onSubmit={handlePJSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(maskCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Os dados da empresa serão buscados automaticamente após a validação do CNPJ.
                </p>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {apiError && (
                  <div className="text-sm text-red-500 mt-2 p-2 bg-red-50 rounded-md">
                    <p className="font-semibold">Erro detalhado da API:</p>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                      {apiError}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Buscando dados..." : "Buscar e Salvar"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <PessoaEdit
        pessoaId={newPessoaId}
        isOpen={showEdit}
        onClose={handleEditClose}
      />
    </>
  )
}
