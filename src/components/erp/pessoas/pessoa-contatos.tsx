"use client"

import { useState, useEffect } from "react"
import { UserRound, Plus, Trash2, Pencil } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"
import { useTempId } from "@/hooks/use-temp-id"
import { Database } from "@/types/database.types"
import { formatPhone } from "@/lib/masks"

type Contato = Database['public']['Tables']['pessoas_contatos']['Row'] & {
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
function validateContato(contato: Contato): string[] {
  const errors: string[] = []
  
  if (!contato.contato?.trim()) {
    errors.push("Nome do contato é obrigatório")
  }
  
  if (contato.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email)) {
    errors.push("E-mail inválido")
  }

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

export function PessoaContatos({ pessoa, loading: parentLoading, onPessoaChange }: PessoaContatosProps) {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const generateTempId = useTempId()

  const isLoading = loading || parentLoading

  // Carrega contatos
  const loadContatos = async () => {
    if (!pessoa?.id) return
    
    try {
      setLoading(true)
      const contatosAtivos = (pessoa.pessoas_contatos || [])
        .filter(c => !c._isDeleted)
        .map(c => ({
          ...c,
          _isNew: c._isNew || false,
          _isDeleted: false,
          _tempId: c._tempId
        }))
        .sort((a, b) => {
          if (a.id && !b.id) return -1
          if (!a.id && b.id) return 1
          if (a.id && b.id) return a.id - b.id
          return 0
        })
      
      // Manter os valores originais dos campos
      const novosContatos = contatosAtivos.map(contato => {
        const contatoAtual = contatos.find(c => 
          (c.id && c.id === contato.id) || 
          (c._tempId && c._tempId === contato._tempId)
        )
        
        if (contatoAtual) {
          return {
            ...contato,
            contato: contatoAtual.contato,
            cargo: contatoAtual.cargo,
            departamento: contatoAtual.departamento,
            email: contatoAtual.email,
            celular: contatoAtual.celular,
            telefone: contatoAtual.telefone,
            zap: contatoAtual.zap
          }
        }
        return contato
      })
      
      setContatos(novosContatos)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar contatos",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados iniciais e quando a pessoa mudar
  useEffect(() => {
    loadContatos()
  }, [pessoa?.id, pessoa?.pessoas_contatos])

  const handleAddContato = () => {
    const _tempId = generateTempId()
    
    const novoContato: Contato = {
      id: undefined,
      contato: '',
      cargo: '',
      departamento: '',
      email: '',
      celular: '',
      telefone: '',
      zap: false,
      pessoa_id: pessoa.id,
      created_at: new Date().toISOString(),
      _isNew: true,
      _tempId
    }
    
    setContatos(prev => [...prev, novoContato])
    
    const pessoaAtualizada = {
      ...pessoa,
      pessoas_contatos: [
        ...(pessoa.pessoas_contatos || []).filter(c => !c._isDeleted),
        novoContato
      ]
    }
    
    onPessoaChange(pessoaAtualizada)
    setEditingIndex(contatos.length)
  }

  const handleRemoveContato = (index: number) => {
    const contatoRemovido = contatos[index]
    const novosContatos = contatos.filter((_, i) => i !== index)
    setContatos(novosContatos)
    
    const contatosAtualizados = (pessoa.pessoas_contatos || []).map(c => {
      if ((c.id && c.id === contatoRemovido.id) || 
          (c._tempId && c._tempId === contatoRemovido._tempId)) {
        return { ...c, _isDeleted: true }
      }
      return c
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_contatos: contatosAtualizados
    })
  }

  const handleContatoChange = (index: number, field: keyof Contato, value: any) => {
    const contatoAtual = contatos[index]
    
    // Formata telefones
    if (field === 'telefone' || field === 'celular') {
      value = formatPhone(value)
    }
    
    const contatoAtualizado = { 
      ...contatoAtual,
      [field]: value
    }
    
    const novosContatos = [...contatos]
    novosContatos[index] = contatoAtualizado
    setContatos(novosContatos)
    
    const contatosAtualizados = (pessoa.pessoas_contatos || []).map(c => {
      if ((c.id && c.id === contatoAtual.id) || 
          (c._tempId && c._tempId === contatoAtual._tempId)) {
        return contatoAtualizado
      }
      return c
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_contatos: contatosAtualizados
    })
  }

  const handleBlur = (index: number) => {
    if (editingIndex === index) {
      const contato = contatos[index]
      const errors = validateContato(contato)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro no contato",
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
          <UserRound className="h-4 w-4" />
          <span>Contatos</span>
        </div>
      }
      defaultExpanded={false}
      className="mb-4"
    >
      <div className="space-y-4">
        <div className="rounded-md border">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[2fr,1fr,1fr,2fr,1fr,1fr,80px,80px] gap-4 p-4 border-b bg-muted/50">
            <div className="font-medium text-muted-foreground">Nome</div>
            <div className="font-medium text-muted-foreground">Cargo</div>
            <div className="font-medium text-muted-foreground">Departamento</div>
            <div className="font-medium text-muted-foreground">Email</div>
            <div className="font-medium text-muted-foreground">Celular</div>
            <div className="font-medium text-muted-foreground">Telefone</div>
            <div className="font-medium text-muted-foreground text-center">WhatsApp</div>
            <div></div>
          </div>
          
          {/* Linhas de Contato */}
          <div className="divide-y">
            {contatos.map((contato, index) => {
              const rowKey = contato.id ? `contato-${contato.id}` : `temp-${contato._tempId}`
              const isEditing = editingIndex === index
              const hasErrors = validateContato(contato).length > 0
              
              return (
                <div 
                  key={rowKey} 
                  className={`grid grid-cols-[2fr,1fr,1fr,2fr,1fr,1fr,80px,80px] gap-4 p-4 items-center hover:bg-muted/50 ${hasErrors ? 'bg-destructive/10' : ''}`}
                >
                  <div>
                    <Input
                      value={contato.contato || ''}
                      onChange={(e) => handleContatoChange(index, 'contato', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="Nome do contato"
                      disabled={isLoading}
                      className={!contato.contato ? 'border-destructive' : ''}
                    />
                  </div>
                  <div>
                    <Input
                      value={contato.cargo || ''}
                      onChange={(e) => handleContatoChange(index, 'cargo', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      placeholder="Cargo"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      value={contato.departamento || ''}
                      onChange={(e) => handleContatoChange(index, 'departamento', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      placeholder="Departamento"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      value={contato.email || ''}
                      onChange={(e) => handleContatoChange(index, 'email', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="email@exemplo.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      value={contato.celular || ''}
                      onChange={(e) => handleContatoChange(index, 'celular', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="(99) 99999-9999"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      value={contato.telefone || ''}
                      onChange={(e) => handleContatoChange(index, 'telefone', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index)}
                      placeholder="(99) 9999-9999"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={contato.zap || false}
                      onCheckedChange={(checked) => handleContatoChange(index, 'zap', checked)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveContato(index)}
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
          onClick={handleAddContato}
          disabled={isLoading}
          className="w-full"
        >
          Adicionar Contato
        </Button>
      </div>
    </ExpandableCard>
  )
}
