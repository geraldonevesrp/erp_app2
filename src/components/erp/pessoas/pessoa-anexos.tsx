import { useState, useEffect } from "react"
import { File, Plus, Trash2, Upload, ExternalLink, Eye, Download } from "lucide-react"
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
import { useTempId } from "@/hooks/use-temp-id"
import { usePessoaOperations } from "@/hooks/use-pessoa-operations"

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

  if (!anexo.download?.trim() && !anexo._isNew) {
    errors.push("É necessário fazer upload de um arquivo")
  }

  return errors
}

export function PessoaAnexos({ pessoa, perfilId, loading: parentLoading, onPessoaChange }: PessoaAnexosProps) {
  const [anexos, setAnexos] = useState<PessoaAnexo[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const generateTempId = useTempId()
  const pessoaOperations = usePessoaOperations()

  const isLoadingState = isLoading || loading || parentLoading

  // Carrega anexos
  const loadAnexos = async () => {
    if (!pessoa?.id) return
    
    try {
      setLoading(true)
      const anexosAtivos = (pessoa.pessoas_anexos || [])
        .filter(a => !a._isDeleted)
        .map(a => ({
          ...a,
          _isNew: a._isNew || false,
          _isDeleted: false,
          _tempId: a._tempId
        }))
        .sort((a, b) => {
          if (a.id && !b.id) return -1
          if (!a.id && b.id) return 1
          if (a.id && b.id) return a.id - b.id
          return 0
        })
      
      // Manter os valores originais dos campos
      const novosAnexos = anexosAtivos.map(anexo => {
        const anexoAtual = anexos.find(a => 
          (a.id && a.id === anexo.id) || 
          (a._tempId && a._tempId === anexo._tempId)
        )
        
        if (anexoAtual) {
          return {
            ...anexo,
            nome: anexoAtual.nome,
            descricao: anexoAtual.descricao,
            arquivo: anexoAtual.arquivo,
            download: anexoAtual.download
          }
        }
        return anexo
      })
      
      setAnexos(novosAnexos)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar anexos",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Carrega dados iniciais e quando a pessoa mudar
  useEffect(() => {
    loadAnexos()
  }, [pessoa?.id, pessoa?.pessoas_anexos])

  const handleAddAnexo = () => {
    const _tempId = generateTempId()
    
    const novoAnexo: PessoaAnexo = {
      id: undefined,
      nome: '',
      descricao: '',
      arquivo: '',
      download: '',
      pessoa_id: pessoa.id,
      created_at: new Date().toISOString(),
      _isNew: true,
      _tempId
    }
    
    setAnexos(prev => [...prev, novoAnexo])
    
    const pessoaAtualizada = {
      ...pessoa,
      pessoas_anexos: [
        ...(pessoa.pessoas_anexos || []).filter(a => !a._isDeleted),
        novoAnexo
      ]
    }
    
    onPessoaChange(pessoaAtualizada)
    setEditingIndex(anexos.length)
  }

  const handleRemoveAnexo = (index: number) => {
    const anexoRemovido = anexos[index]
    const novosAnexos = anexos.filter((_, i) => i !== index)
    setAnexos(novosAnexos)
    
    const anexosAtualizados = (pessoa.pessoas_anexos || []).map(a => {
      if ((a.id && a.id === anexoRemovido.id) || 
          (a._tempId && a._tempId === anexoRemovido._tempId)) {
        return { ...a, _isDeleted: true }
      }
      return a
    })
    
    onPessoaChange({
      ...pessoa,
      pessoas_anexos: anexosAtualizados
    })

    toast({
      description: `Anexo ${anexoRemovido.nome || ''} removido com sucesso`
    })
  }

  const handleAnexoChange = (index: number, field: keyof PessoaAnexo, value: any) => {
    // Atualizar o estado local dos anexos
    const novosAnexos = [...anexos]
    novosAnexos[index] = {
      ...novosAnexos[index],
      [field]: value
    }
    setAnexos(novosAnexos)

    // Atualizar o estado da pessoa
    const anexosAtualizados = (pessoa.pessoas_anexos || []).map((a, i) => {
      if (i === index) {
        return novosAnexos[index]
      }
      return a
    })

    onPessoaChange({
      ...pessoa,
      pessoas_anexos: anexosAtualizados
    })
  }

  const handleBlur = async (index: number, field: keyof PessoaAnexo) => {
    try {
      const anexo = anexos[index]
      if (anexo.id) {
        setIsLoading(true)
        const anexoAtualizado = await pessoaOperations.savePessoaAnexo(anexo)
        
        // Atualizar o estado local
        const novosAnexos = [...anexos]
        novosAnexos[index] = anexoAtualizado
        setAnexos(novosAnexos)

        // Atualizar o estado da pessoa
        const anexosAtualizados = (pessoa.pessoas_anexos || []).map((a, i) => {
          if (i === index) {
            return anexoAtualizado
          }
          return a
        })

        onPessoaChange({
          ...pessoa,
          pessoas_anexos: anexosAtualizados
        })

        toast({
          title: "Anexo atualizado",
          description: "As alterações foram salvas com sucesso."
        })
      }
    } catch (error: any) {
      console.error('Erro ao salvar anexo:', error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar anexo",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File, index: number) => {
    try {
      setLoading(true)
      
      // Limpar o nome do arquivo removendo caracteres especiais
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      
      // Gerar nome único para o arquivo
      const uniqueFileName = `${Date.now()}-${cleanFileName}`
      
      // Manter a estrutura original do path do Supabase
      const filePath = `${perfilId}/pessoas_anexos/${pessoa.id}/${uniqueFileName}`

      console.log('Iniciando upload do arquivo:', filePath)

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('Perfis')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      console.log('Upload concluído, obtendo URLs...')
      
      // Obter URL pública para visualização
      const { data: { publicUrl } } = supabase.storage
        .from('Perfis')
        .getPublicUrl(filePath)

      // Obter URL assinada para download
      const { data: { signedUrl }, error: signedUrlError } = await supabase
        .storage
        .from('Perfis')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7, { // 7 dias
          download: file.name
        })

      if (signedUrlError) throw signedUrlError

      console.log('URLs geradas:', { publicUrl, signedUrl })

      // Criar objeto com os dados atualizados
      const anexoAtualizado = {
        ...anexos[index],
        arquivo: file.name,
        download: publicUrl,
        download_url: signedUrl
      }

      // Atualizar o estado local
      const novosAnexos = [...anexos]
      novosAnexos[index] = anexoAtualizado
      setAnexos(novosAnexos)
      
      // Atualizar o estado da pessoa com o anexo atualizado
      const anexosAtualizados = (pessoa.pessoas_anexos || []).map(a => {
        if ((a.id && a.id === anexoAtualizado.id) || 
            (a._tempId && a._tempId === anexoAtualizado._tempId)) {
          return anexoAtualizado
        }
        return a
      })

      onPessoaChange({
        ...pessoa,
        pessoas_anexos: anexosAtualizados
      })
      
      // Se o anexo já existe, salvar imediatamente
      if (anexoAtualizado.id) {
        await pessoaOperations.savePessoaAnexo(anexoAtualizado)
      }

      toast({
        title: "Arquivo enviado com sucesso",
        description: `O arquivo ${file.name} foi enviado com sucesso.`,
      })

    } catch (error: any) {
      console.error('Erro no upload:', error)
      toast({
        variant: "destructive",
        title: "Erro ao enviar arquivo",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAnexoLocal = async (index: number) => {
    const anexo = anexos[index]
    
    // Se o anexo tem ID, marca como deletado
    if (anexo.id) {
      const updatedAnexos = anexos.map((a, i) => 
        i === index ? { ...a, _isDeleted: true } : a
      ).filter(a => !a._isDeleted) // Remove da visualização
      
      setAnexos(updatedAnexos)
      handleRemoveAnexo(index)
    } else {
      // Se não tem ID, remove diretamente
      const updatedAnexos = anexos.filter((_, i) => i !== index)
      setAnexos(updatedAnexos)
      handleRemoveAnexo(index)
    }
  }

  const handleDownload = async (anexo: PessoaAnexo) => {
    try {
      const link = document.createElement('a')
      link.href = anexo.download_url || anexo.download
      link.setAttribute('download', anexo.arquivo || anexo.nome || 'download')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error)
      toast({
        variant: "destructive",
        title: "Erro ao baixar arquivo",
        description: error.message
      })
    }
  }

  return (
    <ExpandableCard
      title="Anexos"
      description="Adicione documentos, imagens e links relacionados"
      defaultExpanded={false}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead className="w-[180px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(anexos || []).map((anexo, index) => (
                <TableRow key={anexo.id || anexo._tempId}>
                  <TableCell>
                    <Input
                      placeholder="Nome"
                      value={anexo.nome || ''}
                      onChange={e => handleAnexoChange(index, 'nome', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index, 'nome')}
                      disabled={isLoadingState}
                      className={!anexo.nome ? 'border-destructive' : ''}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Descrição"
                      value={anexo.descricao || ''}
                      onChange={e => handleAnexoChange(index, 'descricao', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index, 'descricao')}
                      disabled={isLoadingState}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Nome do arquivo"
                      value={anexo.arquivo || ''}
                      onChange={e => handleAnexoChange(index, 'arquivo', e.target.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => handleBlur(index, 'arquivo')}
                      disabled={isLoadingState}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, index)
                        }}
                        className="hidden"
                        id={`file-${anexo.id || anexo._tempId}`}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        disabled={isLoadingState}
                        onClick={() => {
                          const input = document.getElementById(`file-${anexo.id || anexo._tempId}`)
                          if (input) input.click()
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      {anexo.download && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => window.open(anexo.download || anexo.download_url, '_blank')}
                            title="Visualizar arquivo"
                            disabled={!anexo.download && !anexo.download_url}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => handleDownload(anexo)}
                            title="Baixar arquivo"
                            disabled={!anexo.download && !anexo.download_url}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAnexoLocal(index)}
                      disabled={isLoadingState}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAnexo}
            disabled={isLoadingState}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Anexo
          </Button>
        </div>
      </div>
    </ExpandableCard>
  )
}
