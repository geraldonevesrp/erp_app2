import { useState, useEffect } from "react"
import { File, Plus, Trash2, Upload, ExternalLink } from "lucide-react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PessoaAnexo } from "@/types/pessoa"
import { createClient } from "@/lib/supabase/client"
import { useEntityArrayState } from "@/hooks/use-entity-array-state"

interface PessoaAnexosProps {
  pessoa: {
    id: number
    pessoas_anexos?: PessoaAnexo[]
  }
  perfilId: number
  loading?: boolean
  onPessoaChange: (pessoa: any) => void
}

// Função para validar anexo
const validateAnexo = (anexo: PessoaAnexo) => {
  const errors: string[] = []
  
  if (!anexo.nome?.trim()) {
    errors.push("Nome do anexo é obrigatório")
  } else if (anexo.nome.length > 100) {
    errors.push("Nome do anexo muito longo (máx: 100 caracteres)")
  }

  if (anexo.descricao?.length > 500) {
    errors.push("Descrição muito longa (máx: 500 caracteres)")
  }

  if (anexo.link) {
    try {
      new URL(anexo.link)
    } catch {
      errors.push("Link inválido")
    }
  }
  
  return errors
}

export function PessoaAnexos({ pessoa, perfilId, loading, onPessoaChange }: PessoaAnexosProps) {
  const [anexos, setAnexos] = useState<PessoaAnexo[]>([])
  const [uniqueId, setUniqueId] = useState(0)
  const [editingAnexo, setEditingAnexo] = useState<number | null>(null)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  // Track original state for comparison
  const originalAnexos = pessoa?.pessoas_anexos || []
  const { hasChanges, compareArrays } = useEntityArrayState<PessoaAnexo>(
    anexos,
    originalAnexos,
    ['nome', 'descricao', 'link', 'download']
  )

  useEffect(() => {
    if (pessoa?.pessoas_anexos) {
      const anexosAtivos = pessoa.pessoas_anexos
        .filter(a => !a._isDeleted)
        .map(a => ({
          ...a,
          _isNew: false, // Reseta o estado de novo
          _isDeleted: false, // Reseta o estado de deletado
          _tempId: undefined // Remove IDs temporários após salvar
        }))
        .sort((a, b) => {
          if (a.id && b.id) return a.id - b.id
          if (a.id) return -1
          if (b.id) return 1
          return (a._tempId || 0) - (b._tempId || 0)
        })
      
      setUniqueId(0) // Reseta o contador de IDs temporários
      setAnexos(anexosAtivos)
    } else {
      setAnexos([])
    }
  }, [pessoa?.pessoas_anexos])

  const handleAddAnexo = () => {
    const tempId = uniqueId
    const newAnexo: PessoaAnexo = {
      nome: '',
      descricao: '',
      link: '',
      download: '',
      pessoa_id: pessoa.id,
      _isNew: true,
      _isDeleted: false,
      _tempId: tempId
    }

    setUniqueId(prev => prev + 1)
    const updatedAnexos = [...anexos, newAnexo]
    setAnexos(updatedAnexos)
    
    // Atualiza pessoa com o novo anexo
    onPessoaChange({
      ...pessoa,
      pessoas_anexos: [
        ...originalAnexos,
        newAnexo
      ]
    })
    
    setEditingAnexo(updatedAnexos.length - 1)
  }

  const handleRemoveAnexo = async (index: number) => {
    const updatedAnexos = [...anexos]
    const anexo = updatedAnexos[index]

    if (anexo.id) {
      anexo._isDeleted = true
      setAnexos(updatedAnexos)
      
      // Atualiza pessoa com o anexo marcado como deletado
      onPessoaChange({
        ...pessoa,
        pessoas_anexos: [
          ...originalAnexos.filter(a => a.id !== anexo.id),
          anexo
        ]
      })
      
      toast({
        description: `Anexo ${anexo.nome} removido com sucesso`
      })
    } else {
      updatedAnexos.splice(index, 1)
      setAnexos(updatedAnexos)
      
      // Remove o anexo temporário
      onPessoaChange({
        ...pessoa,
        pessoas_anexos: originalAnexos.filter(a => a._tempId !== anexo._tempId)
      })
    }
    setEditingAnexo(null)
  }

  const handleAnexoChange = (index: number, field: keyof PessoaAnexo, value: any) => {
    const updatedAnexos = [...anexos]
    const anexo = { ...updatedAnexos[index] }
    
    anexo[field] = value
    updatedAnexos[index] = anexo
    setAnexos(updatedAnexos)
    
    // Atualiza pessoa com o anexo modificado
    const anexosAtualizados = originalAnexos.map(a => {
      if ((a.id && a.id === anexo.id) || (a._tempId && a._tempId === anexo._tempId)) {
        return anexo
      }
      return a
    })

    if (!anexosAtualizados.includes(anexo)) {
      anexosAtualizados.push(anexo)
    }

    onPessoaChange({
      ...pessoa,
      pessoas_anexos: anexosAtualizados
    })
  }

  const handleBlur = (index: number) => {
    if (editingAnexo === index) {
      const anexo = anexos[index]
      const errors = validateAnexo(anexo)
      
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Erro no anexo",
          description: errors.join(", ")
        })
      }
      setEditingAnexo(null)
    }
  }

  const handleFileUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index)

      // Validação do tipo de arquivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ]
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG ou PNG.')
      }

      // Validação do tamanho do arquivo (10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. O tamanho máximo permitido é 10MB.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${perfilId}/pessoas_anexos/${pessoa.id}/${fileName}`

      // Remove anexo antigo se existir
      const anexo = anexos[index]
      if (anexo.download) {
        const oldFileUrl = new URL(anexo.download)
        const oldFilePath = oldFileUrl.pathname.split('/').pop()
        if (oldFilePath) {
          await supabase
            .storage
            .from('Perfis')
            .remove([`${perfilId}/pessoas_anexos/${pessoa.id}/${oldFilePath}`])
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('Perfis')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          throw new Error('Já existe um arquivo com este nome. Tente novamente.')
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Perfis')
        .getPublicUrl(filePath)

      handleAnexoChange(index, 'download', publicUrl)
      handleAnexoChange(index, 'nome', file.name)
      
      toast({
        description: "Arquivo enviado com sucesso!"
      })
    } catch (error: any) {
      console.error('Erro no upload:', error)
      toast({
        variant: "destructive",
        title: "Erro ao enviar arquivo",
        description: error.message
      })
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <ExpandableCard
      title={
        <div className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>Anexos</span>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAnexo}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Anexo
          </Button>
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anexos.map((anexo, index) => (
            <TableRow key={anexo.id || anexo._tempId}>
              <TableCell>
                <Input
                  placeholder="Nome"
                  value={anexo.nome || ''}
                  onChange={e => handleAnexoChange(index, 'nome', e.target.value)}
                  onBlur={() => handleBlur(index)}
                  disabled={loading}
                />
              </TableCell>
              <TableCell>
                <Textarea
                  placeholder="Descrição"
                  value={anexo.descricao || ''}
                  onChange={e => handleAnexoChange(index, 'descricao', e.target.value)}
                  disabled={loading}
                  rows={1}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Link"
                  value={anexo.link || ''}
                  onChange={e => handleAnexoChange(index, 'link', e.target.value)}
                  disabled={loading}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(index, file)
                    }}
                    className="hidden"
                    id={`file-${anexo.id || anexo._tempId}`}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    disabled={loading || uploadingIndex === index}
                    onClick={() => {
                      const input = document.getElementById(`file-${anexo.id || anexo._tempId}`)
                      if (input) input.click()
                    }}
                  >
                    {uploadingIndex === index ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  {anexo.download && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(anexo.download, '_blank')}
                      title="Visualizar arquivo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {anexo.link && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(anexo.link, '_blank')}
                      title="Visitar link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnexo(index)}
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
    </ExpandableCard>
  )
}
