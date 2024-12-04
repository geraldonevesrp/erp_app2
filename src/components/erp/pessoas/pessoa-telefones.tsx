"use client"

import { useState, useEffect } from "react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Phone } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"
import { toast } from "@/components/ui/use-toast"

interface Telefone {
  id?: number
  tipo: string
  numero: string
  pessoa_id: number
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

interface PessoaTelefonesProps {
  pessoa: {
    id: number
    pessoas_telefones?: Telefone[]
  }
  loading?: boolean
  onPessoaChange: (pessoa: any) => void
}

// Função para formatar número de telefone
const formatPhoneNumber = (value: string) => {
  // Remove tudo que não é número
  const cleaned = value.replace(/\D/g, '')
  
  // Aplica a máscara
  if (cleaned.length <= 11) {
    let formatted = cleaned
    if (cleaned.length > 2) formatted = `(${cleaned.slice(0,2)}) ${cleaned.slice(2)}`
    if (cleaned.length > 7) formatted = `${formatted.slice(0,10)}-${formatted.slice(10)}`
    return formatted
  }
  return cleaned
}

// Função para validar telefone
const validateTelefone = (telefone: Telefone) => {
  const errors: string[] = []
  
  // Validação do tipo
  if (!telefone.tipo) {
    errors.push("Selecione um tipo de telefone")
  }
  
  // Validação do número
  if (!telefone.numero) {
    errors.push("Digite um número de telefone")
  } else {
    const numeroLimpo = telefone.numero.replace(/\D/g, '')
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      errors.push("Número de telefone deve ter 10 ou 11 dígitos")
    }
  }
  
  return errors
}

export function PessoaTelefones({ pessoa, loading, onPessoaChange }: PessoaTelefonesProps) {
  const [tiposTelefone, setTiposTelefone] = useState<string[]>([])
  const [telefones, setTelefones] = useState<Telefone[]>([])
  const [uniqueId, setUniqueId] = useState(0)
  const { loadTiposTelefone } = usePessoaOperations()
  const [editingTelefone, setEditingTelefone] = useState<number | null>(null)

  useEffect(() => {
    carregarTiposTelefone()
  }, [])

  useEffect(() => {
    if (pessoa?.pessoas_telefones) {
      const telefonesAtivos = pessoa.pessoas_telefones.filter(tel => !tel._isDeleted)
      setTelefones(telefonesAtivos)
    }
  }, [pessoa?.pessoas_telefones])

  const carregarTiposTelefone = async () => {
    try {
      const tipos = await loadTiposTelefone()
      setTiposTelefone(tipos)
    } catch (error) {
      console.error('Erro ao carregar tipos de telefone:', error)
      toast({
        variant: "destructive",
        description: "Erro ao carregar tipos de telefone"
      })
    }
  }

  const handleAddTelefone = () => {
    const newTelefone: Telefone = {
      tipo: '',
      numero: '',
      pessoa_id: pessoa.id,
      _isNew: true,
      _tempId: uniqueId
    }

    setUniqueId(prev => prev + 1)
    const updatedTelefones = [...telefones, newTelefone]
    setTelefones(updatedTelefones)
    updatePessoa(updatedTelefones, false)
    // Marca o novo telefone como em edição
    setEditingTelefone(updatedTelefones.length - 1)
  }

  const handleRemoveTelefone = (index: number) => {
    const updatedTelefones = [...telefones]
    const telefone = updatedTelefones[index]
    
    if (telefone.id) {
      telefone._isDeleted = true
      updatePessoa([...updatedTelefones], false)
      toast({
        description: `Telefone ${telefone.numero} removido com sucesso`
      })
    } else {
      updatedTelefones.splice(index, 1)
      setTelefones(updatedTelefones)
      updatePessoa(updatedTelefones, false)
    }
    setEditingTelefone(null)
  }

  const handleTelefoneChange = (index: number, field: keyof Telefone, value: string) => {
    const updatedTelefones = [...telefones]
    const telefone = updatedTelefones[index]
    
    // Aplica máscara se for campo número
    const newValue = field === 'numero' ? formatPhoneNumber(value) : value
    
    updatedTelefones[index] = {
      ...telefone,
      [field]: newValue
    }

    setTelefones(updatedTelefones)
    // Só valida quando o usuário terminar de editar
    updatePessoa(updatedTelefones, false)
  }

  const handleBlur = (index: number) => {
    // Valida apenas quando o usuário termina a edição
    if (editingTelefone === index) {
      const telefone = telefones[index]
      const errors = validateTelefone(telefone)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro no telefone",
          description: errors.join(", ")
        })
      }
      setEditingTelefone(null)
    }
  }

  const updatePessoa = (updatedTelefones: Telefone[], validate: boolean = false) => {
    // Se não é para validar, apenas atualiza
    if (!validate) {
      onPessoaChange({
        ...pessoa,
        pessoas_telefones: [
          ...updatedTelefones,
          ...(pessoa.pessoas_telefones?.filter(tel => tel._isDeleted) || [])
        ]
      })
      return true
    }

    // Valida apenas telefones ativos e preenchidos (com tipo ou número)
    const telefonesParaValidar = updatedTelefones
      .filter(tel => !tel._isDeleted)
      .filter(tel => tel.tipo || tel.numero)
    
    const allErrors: string[] = []

    telefonesParaValidar.forEach(tel => {
      const errors = validateTelefone(tel)
      if (errors.length > 0) {
        allErrors.push(...errors)
      }
    })

    if (allErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Erro nos telefones",
        description: allErrors.join(", ")
      })
      return false
    }

    onPessoaChange({
      ...pessoa,
      pessoas_telefones: [
        ...updatedTelefones,
        ...(pessoa.pessoas_telefones?.filter(tel => tel._isDeleted) || [])
      ]
    })
    return true
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>Telefones</span>
        </div>
      }
      defaultExpanded={false}
      className="mb-4"
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Tipo</TableHead>
              <TableHead>Número</TableHead>
              <TableHead className="w-[100px] text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTelefone}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {telefones
              .filter(tel => !tel._isDeleted)
              .map((telefone, index) => (
                <TableRow key={telefone.id || `temp-${telefone._tempId}`}>
                  <TableCell>
                    <Select
                      value={telefone.tipo || undefined}
                      onValueChange={(value) => handleTelefoneChange(index, 'tipo', value)}
                      disabled={loading}
                      onOpenChange={() => setEditingTelefone(index)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposTelefone.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={telefone.numero || ''}
                      onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)}
                      onFocus={() => setEditingTelefone(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="(99) 99999-9999"
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTelefone(index)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </ExpandableCard>
  )
}
