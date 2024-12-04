"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
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
  if (!telefone.tipo) errors.push("Tipo é obrigatório")
  if (!telefone.numero) errors.push("Número é obrigatório")
  if (telefone.numero && telefone.numero.replace(/\D/g, '').length < 10) {
    errors.push("Número de telefone inválido")
  }
  return errors
}

export function PessoaTelefones({ pessoa, loading, onPessoaChange }: PessoaTelefonesProps) {
  const [tiposTelefone, setTiposTelefone] = useState<string[]>([])
  const [telefones, setTelefones] = useState<Telefone[]>([])
  const [uniqueId, setUniqueId] = useState(0)
  const { loadTiposTelefone } = usePessoaOperations()

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
    updatePessoa(updatedTelefones)
  }

  const handleRemoveTelefone = (index: number) => {
    const updatedTelefones = [...telefones]
    const telefone = updatedTelefones[index]
    
    if (telefone.id) {
      telefone._isDeleted = true
      updatePessoa([...updatedTelefones])
      toast({
        description: "Telefone removido"
      })
    } else {
      updatedTelefones.splice(index, 1)
      setTelefones(updatedTelefones)
      updatePessoa(updatedTelefones)
    }
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

    // Valida o telefone
    const errors = validateTelefone(updatedTelefones[index])
    if (errors.length === 0) {
      setTelefones(updatedTelefones)
      updatePessoa(updatedTelefones)
    }
  }

  const updatePessoa = (updatedTelefones: Telefone[]) => {
    onPessoaChange({
      ...pessoa,
      pessoas_telefones: [
        ...updatedTelefones,
        ...(pessoa.pessoas_telefones?.filter(tel => tel._isDeleted) || [])
      ]
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Telefones</CardTitle>
        <CardDescription>Gerencie os números de telefone</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTelefone}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Telefone
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    Tipo<span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead>
                    Número<span className="text-red-500 ml-1">*</span>
                  </TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {telefones
                  .filter(tel => !tel._isDeleted)
                  .map((telefone, index) => (
                    <TableRow key={telefone.id || `temp-${telefone._tempId}`}>
                      <TableCell>
                        <Select
                          value={telefone.tipo}
                          onValueChange={(value) => handleTelefoneChange(index, 'tipo', value)}
                          disabled={loading}
                        >
                          <SelectTrigger className={!telefone.tipo ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione..." />
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
                          value={telefone.numero}
                          onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)}
                          disabled={loading}
                          placeholder="(00) 00000-0000"
                          className={!telefone.numero ? "border-red-500" : ""}
                        />
                      </TableCell>
                      <TableCell>
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
        </div>
      </CardContent>
    </Card>
  )
}
