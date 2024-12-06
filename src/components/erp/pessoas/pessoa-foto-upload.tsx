"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"

interface PessoaFotoUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFotoUpdated: (novaUrl: string) => void
  pessoaId?: number
  perfilId?: number
  fotoUrl?: string | null
  onLoadingChange?: (loading: boolean) => void
}

export function PessoaFotoUpload({ 
  open,
  onOpenChange,
  onFotoUpdated,
  pessoaId,
  perfilId,
  fotoUrl,
  onLoadingChange
}: PessoaFotoUploadProps) {
  const [loading, setLoading] = useState(false)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("")
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pessoaId || !perfilId) {
      toast({
        title: "Erro ao fazer upload",
        description: "Informações necessárias não encontradas",
        variant: "destructive",
      })
      return
    }

    try {
      // Validação do tamanho do arquivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro ao fazer upload",
          description: "A foto deve ter no máximo 2MB",
          variant: "destructive",
        })
        return
      }

      // Criar URL temporária para preview
      const fileUrl = URL.createObjectURL(file)
      setSelectedFileUrl(fileUrl)
      setSelectedFile(file)
      setIsCropDialogOpen(true)
    } catch (err: any) {
      console.error('Erro ao processar arquivo:', err)
      toast({
        title: "Erro ao processar arquivo",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!selectedFile || !pessoaId || !perfilId) {
      toast({
        title: "Erro ao fazer upload",
        description: "Informações necessárias não encontradas",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      onLoadingChange?.(true)
      toast({
        title: "Processando imagem",
        description: "Aguarde enquanto fazemos o upload da sua foto...",
      })

      // Converter URL do crop para Blob
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      
      // Remove foto antiga se existir
      if (fotoUrl) {
        const oldFileUrl = new URL(fotoUrl)
        const oldFilePath = oldFileUrl.pathname.split('/').pop()
        if (oldFilePath) {
          await supabase
            .storage
            .from('Perfis')
            .remove([`${perfilId}/pessoas_fotos/${pessoaId}/${oldFilePath}`])
        }
      }
      
      // Criar nome único para o arquivo
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${perfilId}/pessoas_fotos/${pessoaId}/${fileName}`

      // Upload para o bucket 'Perfis' no Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('Perfis')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // Pegar URL pública do arquivo
      const { data: { publicUrl } } = supabase
        .storage
        .from('Perfis')
        .getPublicUrl(filePath)

      // Atualiza a pessoa com a nova URL da foto
      const { error: updateError } = await supabase
        .from('pessoas')
        .update({ foto_url: publicUrl })
        .eq('id', pessoaId)
        .eq('perfis_id', perfilId)

      if (updateError) {
        // Se falhar ao atualizar o banco, remove a foto do storage
        await supabase
          .storage
          .from('Perfis')
          .remove([filePath])
        throw updateError
      }

      // Limpa o estado
      setSelectedFile(null)
      setSelectedFileUrl("")
      setIsCropDialogOpen(false)

      // Notifica o componente pai da atualização
      onFotoUpdated?.(publicUrl)

      toast({
        title: "Foto atualizada",
        description: "A foto foi atualizada com sucesso",
      })
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      toast({
        title: "Erro ao fazer upload",
        description: err.message || "Ocorreu um erro ao fazer o upload da foto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  return (
    <>
      <input
        id="foto-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadFoto}
        disabled={loading}
      />

      <ImageCropDialog
        isOpen={isCropDialogOpen}
        onClose={() => {
          setIsCropDialogOpen(false)
          setSelectedFileUrl("")
          setSelectedFile(null)
        }}
        onComplete={handleCropComplete}
        imageUrl={selectedFileUrl}
        aspectRatio={1}
      />
    </>
  )
}
