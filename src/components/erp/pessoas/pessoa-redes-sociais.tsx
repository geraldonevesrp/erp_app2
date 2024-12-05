import { useState, useEffect } from "react"
import { Globe, Plus, Trash2, ExternalLink } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PessoaRedeSocial } from "@/types/pessoa"

interface PessoaRedesSociaisProps {
  pessoa: {
    id: number
    pessoas_redes_sociais?: PessoaRedeSocial[]
  }
  loading?: boolean
  onPessoaChange: (pessoa: any) => void
}

// Função para validar rede social
const validateRedeSocial = (redeSocial: PessoaRedeSocial) => {
  const errors: string[] = []
  
  if (!redeSocial.nome?.trim()) {
    errors.push("Nome da rede social é obrigatório")
  }
  
  if (!redeSocial.link?.trim()) {
    errors.push("Link é obrigatório")
  } else {
    try {
      new URL(redeSocial.link)
    } catch {
      errors.push("Link inválido")
    }
  }
  
  return errors
}

export function PessoaRedesSociais({ pessoa, loading, onPessoaChange }: PessoaRedesSociaisProps) {
  const [redesSociais, setRedesSociais] = useState<PessoaRedeSocial[]>([])
  const [uniqueId, setUniqueId] = useState(0)
  const [editingRedeSocial, setEditingRedeSocial] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (pessoa?.pessoas_redes_sociais) {
      const redesSociaisAtivas = pessoa.pessoas_redes_sociais
        .filter(r => !r._isDeleted)
        .sort((a, b) => {
          if (a.id && b.id) return a.id - b.id
          if (a.id) return -1
          if (b.id) return 1
          return (a._tempId || 0) - (b._tempId || 0)
        })
      setRedesSociais(redesSociaisAtivas)
    } else {
      setRedesSociais([])
    }
  }, [pessoa?.pessoas_redes_sociais])

  const handleAddRedeSocial = () => {
    const newRedeSocial: PessoaRedeSocial = {
      nome: '',
      link: '',
      pessoa_id: pessoa.id,
      _isNew: true,
      _isDeleted: false,
      _tempId: uniqueId
    }

    setUniqueId(prev => prev + 1)
    const updatedRedesSociais = [...redesSociais, newRedeSocial]
    setRedesSociais(updatedRedesSociais)
    updatePessoa(updatedRedesSociais, false)
    setEditingRedeSocial(updatedRedesSociais.length - 1)
  }

  const handleRemoveRedeSocial = (index: number) => {
    const updatedRedesSociais = [...redesSociais]
    const redeSocial = updatedRedesSociais[index]

    if (redeSocial.id) {
      redeSocial._isDeleted = true
      updatePessoa([...updatedRedesSociais], false)
      toast({
        description: `Rede social ${redeSocial.nome} removida com sucesso`
      })
    } else {
      updatedRedesSociais.splice(index, 1)
      setRedesSociais(updatedRedesSociais)
      updatePessoa(updatedRedesSociais, false)
    }
    setEditingRedeSocial(null)
  }

  const handleRedeSocialChange = (index: number, field: keyof PessoaRedeSocial, value: any) => {
    const updatedRedesSociais = [...redesSociais]
    const redeSocial = updatedRedesSociais[index]

    updatedRedesSociais[index] = {
      ...redeSocial,
      [field]: value
    }

    setRedesSociais(updatedRedesSociais)
    updatePessoa(updatedRedesSociais, false)
  }

  const handleBlur = (index: number) => {
    if (editingRedeSocial === index) {
      const redeSocial = redesSociais[index]
      const errors = validateRedeSocial(redeSocial)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro na rede social",
          description: errors.join(", ")
        })
      }
      setEditingRedeSocial(null)
    }
  }

  const updatePessoa = (updatedRedesSociais: PessoaRedeSocial[], validate: boolean = false) => {
    if (validate) {
      const redesParaValidar = updatedRedesSociais
        .filter(r => !r._isDeleted)
        .filter(r => r.nome || r.link)
      
      const allErrors: string[] = []
      redesParaValidar.forEach(redeSocial => {
        const errors = validateRedeSocial(redeSocial)
        if (errors.length > 0) {
          allErrors.push(...errors)
        }
      })

      if (allErrors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro nas redes sociais",
          description: allErrors.join(", ")
        })
        return false
      }
    }

    onPessoaChange({
      ...pessoa,
      pessoas_redes_sociais: [
        ...updatedRedesSociais,
        ...(pessoa.pessoas_redes_sociais?.filter(r => r._isDeleted) || [])
      ]
    })
    return true
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Redes Sociais</span>
        </div>
      }
      defaultExpanded={false}
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redesSociais.map((redeSocial, index) => (
              <TableRow key={redeSocial.id || redeSocial._tempId}>
                <TableCell>
                  <Input
                    value={redeSocial.nome || ''}
                    onChange={(e) => handleRedeSocialChange(index, 'nome', e.target.value)}
                    onFocus={() => setEditingRedeSocial(index)}
                    onBlur={() => handleBlur(index)}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={redeSocial.link || ''}
                    onChange={(e) => handleRedeSocialChange(index, 'link', e.target.value)}
                    onFocus={() => setEditingRedeSocial(index)}
                    onBlur={() => handleBlur(index)}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell className="w-[100px]">
                  <div className="flex gap-2">
                    {redeSocial.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(redeSocial.link, '_blank')}
                        title="Visitar link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRedeSocial(index)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRedeSocial}
          disabled={loading}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Rede Social
        </Button>
      </div>
    </ExpandableCard>
  )
}
