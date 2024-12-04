"use client"

import { Phone, Plus, X } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/lib/masks"

interface PessoaContatosProps {
  pessoa: any
  loading: boolean
  validationErrors: { [key: string]: string }
  touchedFields: { [key: string]: boolean }
  onPessoaChange: (updates: any) => void
  onRemoveContato: (contato: any) => void
  onAddContato: () => void
}

export function PessoaContatos({
  pessoa,
  loading,
  validationErrors,
  touchedFields,
  onPessoaChange,
  onRemoveContato,
  onAddContato
}: PessoaContatosProps) {
  const handleContatoChange = (index: number, field: string, value: string) => {
    if (field === "telefone") {
      value = formatPhone(value)
    }

    const newContatos = [...(pessoa.pessoas_contatos || [])]
    const contato = { ...newContatos[index] }
    contato[field] = value
    newContatos[index] = contato

    onPessoaChange({
      ...pessoa,
      pessoas_contatos: newContatos
    })
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          <span>Contatos</span>
        </div>
      }
      defaultExpanded={false}
    >
      <div className="space-y-4 p-6">
        {pessoa?.pessoas_contatos?.filter(c => !c._isDeleted)?.map((contato: any, index: number) => (
          <div key={contato.id || `temp-${contato._tempId}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b pb-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor={`contato-${index}`}>Contato</Label>
              <Input
                id={`contato-${index}`}
                value={contato.contato || ""}
                onChange={(e) => handleContatoChange(index, "contato", e.target.value)}
                disabled={loading}
                className={validationErrors?.[`contato_${index}`] && touchedFields?.[`contato_${index}`] ? "border-destructive" : ""}
              />
              {validationErrors?.[`contato_${index}`] && touchedFields?.[`contato_${index}`] && (
                <p className="text-sm text-destructive">{validationErrors[`contato_${index}`]}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor={`telefone-${index}`}>Telefone</Label>
              <Input
                id={`telefone-${index}`}
                value={contato.telefone || ""}
                onChange={(e) => handleContatoChange(index, "telefone", e.target.value)}
                disabled={loading}
                className={validationErrors?.[`telefone_${index}`] && touchedFields?.[`telefone_${index}`] ? "border-destructive" : ""}
              />
              {validationErrors?.[`telefone_${index}`] && touchedFields?.[`telefone_${index}`] && (
                <p className="text-sm text-destructive">{validationErrors[`telefone_${index}`]}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor={`email-${index}`}>E-mail</Label>
              <Input
                id={`email-${index}`}
                type="email"
                value={contato.email || ""}
                onChange={(e) => handleContatoChange(index, "email", e.target.value)}
                disabled={loading}
                className={validationErrors?.[`email_${index}`] && touchedFields?.[`email_${index}`] ? "border-destructive" : ""}
              />
              {validationErrors?.[`email_${index}`] && touchedFields?.[`email_${index}`] && (
                <p className="text-sm text-destructive">{validationErrors[`email_${index}`]}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor={`github-${index}`}>GitHub</Label>
              <div className="flex gap-2">
                <Input
                  id={`github-${index}`}
                  value={contato.github || ""}
                  onChange={(e) => handleContatoChange(index, "github", e.target.value)}
                  disabled={loading}
                  className={validationErrors?.[`github_${index}`] && touchedFields?.[`github_${index}`] ? "border-destructive" : ""}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveContato(contato)}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {validationErrors?.[`github_${index}`] && touchedFields?.[`github_${index}`] && (
                <p className="text-sm text-destructive">{validationErrors[`github_${index}`]}</p>
              )}
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddContato}
          disabled={loading}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Contato
        </Button>
      </div>
    </ExpandableCard>
  )
}
