"use client"

import { useState, useEffect } from "react"
import { Globe, Plus, Trash2, ExternalLink } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useTempId } from "@/hooks/use-temp-id"
import { Database } from "@/types/database.types"

type RedeSocial = Database['public']['Tables']['pessoas_redes_sociais']['Row'] & {
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

interface PessoaRedesSociaisProps {
  pessoa: {
    id: number
    pessoas_redes_sociais?: RedeSocial[]
  }
  loading?: boolean
  onPessoaChange: (pessoa: any) => void
}

// Função para validar rede social
function validateRedeSocial(redeSocial: RedeSocial): string[] {
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

export function PessoaRedesSociais({ pessoa, loading: parentLoading, onPessoaChange }: PessoaRedesSociaisProps) {
  const [redesSociais, setRedesSociais] = useState<RedeSocial[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const generateTempId = useTempId()

  const isLoading = loading || parentLoading

  // Carrega redes sociais
  const loadRedesSociais = async () => {
    if (!pessoa?.id) return
    
    try {
      setLoading(true)
      const redesSociaisAtivas = (pessoa.pessoas_redes_sociais || [])
        .filter(r => !r._isDeleted)
        .map(r => ({
          ...r,
          _isNew: r._isNew || false,
          _isDeleted: false,
          _tempId: r._tempId
        }))
        .sort((a, b) => {
          if (a.id && !b.id) return -1
          if (!a.id && b.id) return 1
          if (a.id && b.id) return a.id - b.id
          return 0
        })
      
      // Manter os valores originais dos campos
      const novasRedesSociais = redesSociaisAtivas.map(redeSocial => {
        const redeSocialAtual = redesSociais.find(r => 
          (r.id && r.id === redeSocial.id) || 
          (r._tempId && r._tempId === redeSocial._tempId)
        )
        
        if (redeSocialAtual) {
          return {
            ...redeSocial,
            nome: redeSocialAtual.nome,
            link: redeSocialAtual.link
          }
        }
        return redeSocial
      })
      
      setRedesSociais(novasRedesSociais)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar redes sociais",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados iniciais e quando a pessoa mudar
  useEffect(() => {
    loadRedesSociais()
  }, [pessoa?.id, pessoa?.pessoas_redes_sociais])

  const handleAddRedeSocial = () => {
    const _tempId = generateTempId()
    
    const novaRedeSocial: RedeSocial = {
      id: undefined,
      nome: '',
      link: '',
      pessoa_id: pessoa.id,
      created_at: new Date().toISOString(),
      _isNew: true,
      _tempId
    }
    
    setRedesSociais(prev => [...prev, novaRedeSocial])
    
    const pessoaAtualizada = {
      ...pessoa,
      pessoas_redes_sociais: [
        ...(pessoa.pessoas_redes_sociais || []).filter(r => !r._isDeleted),
        novaRedeSocial
      ]
    }
    
    onPessoaChange(pessoaAtualizada)
    setEditingIndex(redesSociais.length)
  }

  const handleRemoveRedeSocial = (index: number) => {
    const redeSocialRemovida = redesSociais[index]
    const novasRedesSociais = redesSociais.filter((_, i) => i !== index)
    setRedesSociais(novasRedesSociais)
    
    const redesSociaisAtualizadas = (pessoa.pessoas_redes_sociais || []).map(r => {
      if ((r.id && r.id === redeSocialRemovida.id) || 
          (r._tempId && r._tempId === redeSocialRemovida._tempId)) {
        return { ...r, _isDeleted: true }
      }
      return r
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_redes_sociais: redesSociaisAtualizadas
    })
  }

  const handleRedeSocialChange = (index: number, field: keyof RedeSocial, value: any) => {
    const redeSocialAtual = redesSociais[index]
    
    const redeSocialAtualizada = { 
      ...redeSocialAtual,
      [field]: value
    }
    
    const novasRedesSociais = [...redesSociais]
    novasRedesSociais[index] = redeSocialAtualizada
    setRedesSociais(novasRedesSociais)
    
    const redesSociaisAtualizadas = (pessoa.pessoas_redes_sociais || []).map(r => {
      if ((r.id && r.id === redeSocialAtual.id) || 
          (r._tempId && r._tempId === redeSocialAtual._tempId)) {
        return redeSocialAtualizada
      }
      return r
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_redes_sociais: redesSociaisAtualizadas
    })
  }

  const handleBlur = (index: number, field: keyof RedeSocial) => {
    if (editingIndex === index) {
      // Só valida se estiver saindo do campo link
      if (field === 'link') {
        const redeSocial = redesSociais[index]
        const errors = validateRedeSocial(redeSocial)
        
        if (errors.length > 0) {
          toast({
            variant: "destructive",
            title: "Erro na rede social",
            description: errors.join(", ")
          })
          return
        }
        setEditingIndex(null)
      }
    }
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
      className="mb-4"
    >
      <div className="space-y-4">
        <div className="rounded-md border">
          {/* Cabeçalho */}
          <div className="grid grid-cols-[2fr,3fr,80px] gap-4 p-4 border-b bg-muted/50">
            <div className="font-medium text-muted-foreground">Nome</div>
            <div className="font-medium text-muted-foreground">Link</div>
            <div></div>
          </div>
          
          {/* Linhas de Redes Sociais */}
          <div className="divide-y">
            {redesSociais.map((redeSocial, index) => {
              const rowKey = redeSocial.id ? `rede-social-${redeSocial.id}` : `temp-${redeSocial._tempId}`
              const isEditing = editingIndex === index
              const hasErrors = validateRedeSocial(redeSocial).length > 0
              
              return (
                <div 
                  key={rowKey} 
                  className={`grid grid-cols-[2fr,3fr,80px] gap-4 p-4 items-center hover:bg-muted/50 ${hasErrors ? 'bg-destructive/10' : ''}`}
                >
                  <div>
                    <Input
                      value={redeSocial.nome || ''}
                      onChange={(e) => handleRedeSocialChange(index, 'nome', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index, 'nome')}
                      placeholder="Nome da rede social"
                      disabled={isLoading}
                      className={!redeSocial.nome ? 'border-destructive' : ''}
                    />
                  </div>
                  <div>
                    <Input
                      value={redeSocial.link || ''}
                      onChange={(e) => handleRedeSocialChange(index, 'link', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index, 'link')}
                      placeholder="https://..."
                      disabled={isLoading}
                      className={!redeSocial.link ? 'border-destructive' : ''}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {redeSocial.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(redeSocial.link, '_blank')}
                        disabled={isLoading}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRedeSocial(index)}
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
          onClick={handleAddRedeSocial}
          disabled={isLoading}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Rede Social
        </Button>
      </div>
    </ExpandableCard>
  )
}
