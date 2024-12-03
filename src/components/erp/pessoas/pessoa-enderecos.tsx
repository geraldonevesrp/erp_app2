"use client"

import { MapPin, Plus, X } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatCEP } from "@/lib/masks"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface PessoaEnderecosProps {
  pessoa: any
  loading: boolean
  validationErrors: { [key: string]: string }
  touchedFields: { [key: string]: boolean }
  onPessoaChange: (updates: any) => void
  onRemoveEndereco: (endereco: any) => void
  onAddEndereco: () => void
}

export function PessoaEnderecos({
  pessoa,
  loading,
  validationErrors,
  touchedFields,
  onPessoaChange,
  onRemoveEndereco,
  onAddEndereco
}: PessoaEnderecosProps) {
  const supabase = createClientComponentClient()

  const handleEnderecoChange = async (index: number, field: string, value: any) => {
    const newEnderecos = [...pessoa.pessoas_enderecos]

    if (field === "cep") {
      // Formatar CEP
      value = formatCEP(value)

      // Se o CEP estiver completo, buscar dados
      if (value.length === 9) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, "")}/json/`)
          const data = await response.json()

          if (!data.erro) {
            newEnderecos[index] = {
              ...newEnderecos[index],
              cep: value,
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
              ibge: data.ibge,
              gia: data.gia,
              ddd: data.ddd,
              siafi: data.siafi
            }

            onPessoaChange({
              ...pessoa,
              pessoas_enderecos: newEnderecos
            })
            return
          }
        } catch (err) {
          console.error("Erro ao buscar CEP:", err)
        }
      }
    }

    if (field === "principal") {
      // Se estiver marcando como principal, desmarcar os outros
      if (value === true) {
        newEnderecos.forEach((endereco: any, i: number) => {
          if (i !== index) {
            endereco.principal = false
          }
        })
      }
    }

    newEnderecos[index] = {
      ...newEnderecos[index],
      [field]: value
    }

    onPessoaChange({
      ...pessoa,
      pessoas_enderecos: newEnderecos
    })
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>Endereços</span>
        </div>
      }
      defaultExpanded={false}
    >
      <div className="space-y-4 p-6">
        {pessoa?.pessoas_enderecos?.map((endereco: any, index: number) => (
          <div key={endereco.id} className="space-y-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`titulo-${index}`}>Título</Label>
                <Input
                  id={`titulo-${index}`}
                  value={endereco.titulo || ""}
                  onChange={(e) => handleEnderecoChange(index, "titulo", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`cep-${index}`}>CEP</Label>
                <Input
                  id={`cep-${index}`}
                  value={endereco.cep || ""}
                  onChange={(e) => handleEnderecoChange(index, "cep", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_cep`] && touchedFields?.[`endereco_${index}_cep`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_cep`] && touchedFields?.[`endereco_${index}_cep`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_cep`]}</p>
                )}
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`principal-${index}`}
                    checked={endereco.principal || false}
                    onCheckedChange={(checked) => handleEnderecoChange(index, "principal", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor={`principal-${index}`}>Principal</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveEndereco(endereco)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`logradouro-${index}`}>Logradouro</Label>
                <Input
                  id={`logradouro-${index}`}
                  value={endereco.logradouro || ""}
                  onChange={(e) => handleEnderecoChange(index, "logradouro", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_logradouro`] && touchedFields?.[`endereco_${index}_logradouro`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_logradouro`] && touchedFields?.[`endereco_${index}_logradouro`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_logradouro`]}</p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`numero-${index}`}>Número</Label>
                <Input
                  id={`numero-${index}`}
                  value={endereco.numero || ""}
                  onChange={(e) => handleEnderecoChange(index, "numero", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_numero`] && touchedFields?.[`endereco_${index}_numero`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_numero`] && touchedFields?.[`endereco_${index}_numero`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_numero`]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`complemento-${index}`}>Complemento</Label>
                <Input
                  id={`complemento-${index}`}
                  value={endereco.complemento || ""}
                  onChange={(e) => handleEnderecoChange(index, "complemento", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`bairro-${index}`}>Bairro</Label>
                <Input
                  id={`bairro-${index}`}
                  value={endereco.bairro || ""}
                  onChange={(e) => handleEnderecoChange(index, "bairro", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_bairro`] && touchedFields?.[`endereco_${index}_bairro`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_bairro`] && touchedFields?.[`endereco_${index}_bairro`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_bairro`]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`localidade-${index}`}>Cidade</Label>
                <Input
                  id={`localidade-${index}`}
                  value={endereco.localidade || ""}
                  onChange={(e) => handleEnderecoChange(index, "localidade", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_localidade`] && touchedFields?.[`endereco_${index}_localidade`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_localidade`] && touchedFields?.[`endereco_${index}_localidade`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_localidade`]}</p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`uf-${index}`}>UF</Label>
                <Input
                  id={`uf-${index}`}
                  value={endereco.uf || ""}
                  onChange={(e) => handleEnderecoChange(index, "uf", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`endereco_${index}_uf`] && touchedFields?.[`endereco_${index}_uf`] ? "border-destructive" : ""}
                />
                {validationErrors?.[`endereco_${index}_uf`] && touchedFields?.[`endereco_${index}_uf`] && (
                  <p className="text-sm text-destructive">{validationErrors[`endereco_${index}_uf`]}</p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`ibge-${index}`}>IBGE</Label>
                <Input
                  id={`ibge-${index}`}
                  value={endereco.ibge || ""}
                  onChange={(e) => handleEnderecoChange(index, "ibge", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={onAddEndereco}
          disabled={loading}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Endereço
        </Button>
      </div>
    </ExpandableCard>
  )
}
