"use client"

import { useState, useEffect } from "react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Phone, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"
import { useTempId } from "@/hooks/use-temp-id"
import { Database } from "@/types/database.types"

type Telefone = Database['public']['Tables']['pessoas_telefones']['Row'] & {
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
function formatPhoneNumber(value: string): string {
  if (!value) return value
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
  }
  return value
}

// Função para validar telefone
function validateTelefone(telefone: Telefone): string[] {
  const errors: string[] = []
  
  if (!telefone.tipo) {
    errors.push("Tipo de telefone é obrigatório")
  }
  
  if (!telefone.numero) {
    errors.push("Número de telefone é obrigatório")
  } else {
    const numbers = telefone.numero.replace(/\D/g, '')
    if (numbers.length < 10 || numbers.length > 11) {
      errors.push("Número de telefone inválido")
    }
  }
  
  return errors
}

export function PessoaTelefones({ pessoa, loading: parentLoading, onPessoaChange }: PessoaTelefonesProps) {
  const [tiposTelefone, setTiposTelefone] = useState<string[]>([])
  const [telefones, setTelefones] = useState<Telefone[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { loadTiposTelefone } = usePessoaOperations()
  const generateTempId = useTempId()

  const isLoading = loading || parentLoading

  // Carrega tipos de telefone
  useEffect(() => {
    const loadTipos = async () => {
      try {
        const tipos = await loadTiposTelefone()
        setTiposTelefone(tipos)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar tipos de telefone",
          description: error.message
        })
      }
    }
    loadTipos()
  }, [loadTiposTelefone, toast])

  // Carrega telefones
  const loadTelefones = async () => {
    if (!pessoa?.id) return
    
    try {
      setLoading(true)
      const telefonesAtivos = (pessoa.pessoas_telefones || [])
        .filter(t => !t._isDeleted)
        .map(t => ({
          ...t,
          _isNew: t._isNew || false,
          _isDeleted: false,
          _tempId: t._tempId
        }))
        .sort((a, b) => {
          if (a.id && !b.id) return -1
          if (!a.id && b.id) return 1
          if (a.id && b.id) return a.id - b.id
          return 0
        })
      
      // Manter os valores originais dos campos tipo e numero
      const novosTelefones = telefonesAtivos.map(tel => {
        const telefoneAtual = telefones.find(t => 
          (t.id && t.id === tel.id) || 
          (t._tempId && t._tempId === tel._tempId)
        )
        
        if (telefoneAtual) {
          return {
            ...tel,
            tipo: telefoneAtual.tipo,
            numero: telefoneAtual.numero
          }
        }
        return tel
      })
      
      setTelefones(novosTelefones)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar telefones",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados iniciais e quando a pessoa mudar
  useEffect(() => {
    loadTelefones()
  }, [pessoa?.id, pessoa?.pessoas_telefones])

  const handleAddTelefone = () => {
    if (!tiposTelefone.length) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar telefone",
        description: "Não há tipos de telefone disponíveis"
      })
      return
    }

    const _tempId = generateTempId()
    
    const novoTelefone: Telefone = {
      id: undefined,
      tipo: tiposTelefone[0],
      numero: '',
      pessoa_id: pessoa.id,
      created_at: new Date().toISOString(),
      _isNew: true,
      _tempId
    }
    
    setTelefones(prev => [...prev, novoTelefone])
    
    const pessoaAtualizada = {
      ...pessoa,
      pessoas_telefones: [
        ...(pessoa.pessoas_telefones || []).filter(t => !t._isDeleted),
        novoTelefone
      ]
    }
    
    onPessoaChange(pessoaAtualizada)
    setEditingIndex(telefones.length)
  }

  const handleRemoveTelefone = (index: number) => {
    const telefoneRemovido = telefones[index]
    const novosTelefones = telefones.filter((_, i) => i !== index)
    setTelefones(novosTelefones)
    
    const telefonesAtualizados = (pessoa.pessoas_telefones || []).map(t => {
      if ((t.id && t.id === telefoneRemovido.id) || 
          (t._tempId && t._tempId === telefoneRemovido._tempId)) {
        return { ...t, _isDeleted: true }
      }
      return t
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_telefones: telefonesAtualizados
    })
  }

  const handleTelefoneChange = (index: number, field: keyof Telefone, value: string) => {
    const telefoneAtual = telefones[index]
    const telefoneAtualizado = { 
      ...telefoneAtual,
      [field]: field === 'numero' ? formatPhoneNumber(value) : value
    }
    
    // Validação imediata para o tipo
    if (field === 'tipo' && !value) {
      toast({
        variant: "destructive",
        title: "Erro no telefone",
        description: "Tipo de telefone é obrigatório"
      })
      return
    }
    
    const novosTelefones = [...telefones]
    novosTelefones[index] = telefoneAtualizado
    setTelefones(novosTelefones)
    
    const telefonesAtualizados = (pessoa.pessoas_telefones || []).map(t => {
      if ((t.id && t.id === telefoneAtual.id) || 
          (t._tempId && t._tempId === telefoneAtual._tempId)) {
        return telefoneAtualizado
      }
      return t
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_telefones: telefonesAtualizados
    })
  }

  const handleBlur = (index: number) => {
    if (editingIndex === index) {
      const telefone = telefones[index]
      const errors = validateTelefone(telefone)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro no telefone",
          description: errors.join(", ")
        })
        return
      }
      setEditingIndex(null)
    }
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
        <div className="rounded-md border">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[200px,1fr,100px] gap-4 p-4 border-b bg-muted/50">
            <div className="font-medium text-muted-foreground">Tipo</div>
            <div className="font-medium text-muted-foreground">Número</div>
            <div></div>
          </div>
          
          {/* Linhas de Telefone */}
          <div className="divide-y">
            {telefones.map((telefone, index) => {
              const rowKey = telefone.id ? `tel-${telefone.id}` : `temp-${telefone._tempId}`
              const isEditing = editingIndex === index
              const hasErrors = validateTelefone(telefone).length > 0
              
              return (
                <div 
                  key={rowKey} 
                  className={`grid grid-cols-[200px,1fr,100px] gap-4 p-4 items-center hover:bg-muted/50 ${hasErrors ? 'bg-destructive/10' : ''}`}
                >
                  <div>
                    <Select
                      value={telefone.tipo || undefined}
                      onValueChange={(value) => handleTelefoneChange(index, 'tipo', value)}
                      disabled={isLoading}
                      onOpenChange={() => setEditingIndex(index)}
                    >
                      <SelectTrigger className={!telefone.tipo ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposTelefone.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      value={telefone.numero || ''}
                      onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="(99) 99999-9999"
                      disabled={isLoading}
                      className={!telefone.numero ? 'border-destructive' : ''}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTelefone(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleAddTelefone}
          disabled={isLoading || tiposTelefone.length === 0}
          className="w-full"
        >
          Adicionar Telefone
        </Button>
      </div>
    </ExpandableCard>
  )
}
