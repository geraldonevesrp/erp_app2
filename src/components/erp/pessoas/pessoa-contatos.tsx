"use client"

import { useState, useEffect } from "react"
import { Phone, Plus, Trash2 } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPhone } from "@/lib/masks"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Contato {
  id?: number
  contato: string
  cargo: string
  departamento: string
  email: string
  celular: string
  telefone: string
  zap: boolean
  pessoa_id: number
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

interface PessoaContatosProps {
  pessoa: {
    id: number
    pessoas_contatos?: Contato[]
  }
  loading?: boolean
  onPessoaChange: (pessoa: any) => void
}

// Função para validar contato
const validateContato = (contato: Contato) => {
  const errors: string[] = []
  
  // Validação do nome do contato
  if (!contato.contato?.trim()) {
    errors.push("Nome do contato é obrigatório")
  }
  
  // Validação do email
  if (contato.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email)) {
    errors.push("E-mail inválido")
  }

  // Validação do telefone e celular
  const validatePhone = (phone: string | undefined, field: string) => {
    if (phone) {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length < 10 || cleaned.length > 11) {
        errors.push(`${field} deve ter 10 ou 11 dígitos`)
      }
    }
  }
  
  validatePhone(contato.telefone, "Telefone")
  validatePhone(contato.celular, "Celular")
  
  return errors
}

export function PessoaContatos({ pessoa, loading, onPessoaChange }: PessoaContatosProps) {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [uniqueId, setUniqueId] = useState(0)
  const [editingContato, setEditingContato] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (pessoa?.pessoas_contatos) {
      const contatosAtivos = pessoa.pessoas_contatos
        .filter(c => !c._isDeleted)
        .sort((a, b) => {
          // Se ambos têm ID, ordena por ID
          if (a.id && b.id) {
            return a.id - b.id
          }
          // Se só um tem ID, o que tem ID vem primeiro
          if (a.id) return -1
          if (b.id) return 1
          // Se nenhum tem ID (são novos), mantém ordem de criação
          return (a._tempId || 0) - (b._tempId || 0)
        })
      setContatos(contatosAtivos)
    }
  }, [pessoa?.pessoas_contatos])

  const handleAddContato = () => {
    const newContato: Contato = {
      contato: '',
      cargo: '',
      departamento: '',
      email: '',
      celular: '',
      telefone: '',
      zap: false,
      pessoa_id: pessoa.id,
      _isNew: true,
      _isDeleted: false,
      _tempId: uniqueId
    }

    setUniqueId(prev => prev + 1)
    const updatedContatos = [...contatos, newContato]
    setContatos(updatedContatos)
    updatePessoa(updatedContatos, false)
    setEditingContato(updatedContatos.length - 1)
  }

  const handleRemoveContato = (index: number) => {
    const updatedContatos = [...contatos]
    const contato = updatedContatos[index]

    if (contato.id) {
      contato._isDeleted = true
      updatePessoa([...updatedContatos], false)
      toast({
        description: `Contato ${contato.contato} removido com sucesso`
      })
    } else {
      updatedContatos.splice(index, 1)
      setContatos(updatedContatos)
      updatePessoa(updatedContatos, false)
    }
    setEditingContato(null)
  }

  const handleContatoChange = (index: number, field: keyof Contato, value: any) => {
    const updatedContatos = [...contatos]
    const contato = updatedContatos[index]

    updatedContatos[index] = {
      ...contato,
      [field]: value
    }

    setContatos(updatedContatos)
    updatePessoa(updatedContatos, false)
  }

  const handleBlur = (index: number) => {
    if (editingContato === index) {
      const contato = contatos[index]
      const errors = validateContato(contato)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro no contato",
          description: errors.join(", ")
        })
      }
      setEditingContato(null)
    }
  }

  const updatePessoa = (updatedContatos: Contato[], validate: boolean = false) => {
    if (!validate) {
      onPessoaChange({
        ...pessoa,
        pessoas_contatos: [
          ...updatedContatos,
          ...(pessoa.pessoas_contatos?.filter(c => c._isDeleted) || [])
        ]
      })
      return true
    }

    const contatosParaValidar = updatedContatos
      .filter(c => !c._isDeleted)
      .filter(c => c.contato || c.email || c.telefone || c.celular)
    
    const allErrors: string[] = []
    contatosParaValidar.forEach(contato => {
      const errors = validateContato(contato)
      if (errors.length > 0) {
        allErrors.push(...errors)
      }
    })

    if (allErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Erro nos contatos",
        description: allErrors.join(", ")
      })
      return false
    }

    onPessoaChange({
      ...pessoa,
      pessoas_contatos: [
        ...updatedContatos,
        ...(pessoa.pessoas_contatos?.filter(c => c._isDeleted) || [])
      ]
    })
    return true
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>Contatos</span>
        </div>
      }
      defaultExpanded={false}
      className="mb-4"
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contato</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contatos
              .filter(c => !c._isDeleted)
              .map((contato, index) => (
                <TableRow key={contato.id || `temp-${contato._tempId}`}>
                  <TableCell>
                    <Input
                      value={contato.contato || ''}
                      onChange={(e) => handleContatoChange(index, 'contato', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      onBlur={() => handleBlur(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={contato.cargo || ''}
                      onChange={(e) => handleContatoChange(index, 'cargo', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={contato.departamento || ''}
                      onChange={(e) => handleContatoChange(index, 'departamento', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="email"
                      value={contato.email || ''}
                      onChange={(e) => handleContatoChange(index, 'email', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      onBlur={() => handleBlur(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={contato.celular || ''}
                      onChange={(e) => handleContatoChange(index, 'celular', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      onBlur={() => handleBlur(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={contato.telefone || ''}
                      onChange={(e) => handleContatoChange(index, 'telefone', e.target.value)}
                      onFocus={() => setEditingContato(index)}
                      onBlur={() => handleBlur(index)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={contato.zap || false}
                      onCheckedChange={(checked) => handleContatoChange(index, 'zap', checked)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveContato(index)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddContato}
          disabled={loading}
          className="w-full mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Contato
        </Button>
      </div>
    </ExpandableCard>
  )
}
