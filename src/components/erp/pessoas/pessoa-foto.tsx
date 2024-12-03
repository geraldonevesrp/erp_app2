"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface PessoaFotoProps {
  pessoaId: number
  perfilId: number
  fotoUrl: string | null
  onFotoUpdated: (novaUrl: string) => void
  disabled?: boolean
}

export function PessoaFoto({ 
  pessoaId, 
  perfilId, 
  fotoUrl, 
  onFotoUpdated,
  disabled = false 
}: PessoaFotoProps) {
  const [loading, setLoading] = useState(false)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("")
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pessoaId) return

    try {
      // Validação do tamanho do arquivo (2MB)
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. O tamanho máximo permitido é 2MB.')
      }

      // Criar URL temporária para a imagem
      const fileUrl = URL.createObjectURL(file)
      setSelectedFile(file)
      setSelectedFileUrl(fileUrl)
      setIsCropDialogOpen(true)
    } catch (err: any) {
      console.error('Erro ao processar arquivo:', err)
      toast({
        title: "Erro ao processar imagem",
        description: err.message,
        variant: "destructive"
      })
    }
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!pessoaId || !selectedFile) return

    try {
      setLoading(true)
      
      // Converter base64 para blob
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
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          throw new Error('Já existe uma foto com este nome. Tente novamente.')
        }
        throw uploadError
      }

      // Obtém a URL pública do arquivo
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

      // Notifica o componente pai da atualização
      onFotoUpdated(publicUrl)

      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
        variant: "success"
      })
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      toast({
        title: "Erro ao fazer upload",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      // Limpar URLs temporárias
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl)
      }
      setSelectedFile(null)
      setSelectedFileUrl("")
      setIsCropDialogOpen(false)
    }
  }

  return (
    <>
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt="Foto do perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Camera size={40} />
          </div>
        )}
        
        <label 
          htmlFor="foto-upload" 
          className={`
            absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
            transition-opacity cursor-pointer flex items-center justify-center
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:text-white hover:bg-transparent"
            disabled={disabled || loading}
          >
            {loading ? "Carregando..." : "Alterar foto"}
          </Button>
          <input
            id="foto-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadFoto}
            disabled={disabled || loading}
          />
        </label>
      </div>

      <ImageCropDialog
        isOpen={isCropDialogOpen}
        onClose={() => setIsCropDialogOpen(false)}
        onComplete={handleCropComplete}
        imageUrl={selectedFileUrl}
        aspectRatio={1}
      />
    </>
  )
}
