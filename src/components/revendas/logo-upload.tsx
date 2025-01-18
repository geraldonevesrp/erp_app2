"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageCropDialog } from "@/components/ui/image-crop-dialog"
import { PhotoModal } from "@/components/ui/photo-modal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Image } from "lucide-react"

interface LogoUploadProps {
  revendaId: string
  fotoUrl?: string
  onLogoUpdate: (newLogoUrl: string) => void
}

export function LogoUpload({ revendaId, fotoUrl, onLogoUpdate }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 5MB",
          variant: "destructive"
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedFile(e.target?.result as string)
        setShowCropDialog(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async (croppedImage: string) => {
    try {
      setIsUploading(true)
      
      // Converter base64 para blob
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      
      // Upload para o Supabase Storage
      const filePath = `${revendaId}/logos/logo.png`
      const { data, error } = await supabase.storage
        .from("Perfis")
        .upload(filePath, blob, {
          upsert: true,
          contentType: "image/png"
        })

      if (error) throw error

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("Perfis")
        .getPublicUrl(filePath)

      onLogoUpdate(publicUrl)
      
      toast({
        title: "Logo atualizada",
        description: "A logo da sua revenda foi atualizada com sucesso"
      })

    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao fazer upload da logo",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => document.getElementById("logo-input")?.click()}
          disabled={isUploading}
        >
          <Image className="w-4 h-4 mr-2" />
          {fotoUrl ? "Alterar Logo" : "Fazer Upload da Logo"}
        </Button>

        {fotoUrl && (
          <Button
            variant="ghost"
            onClick={() => setShowPreviewModal(true)}
          >
            Visualizar Logo
          </Button>
        )}

        <input
          id="logo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {fotoUrl && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
          <img
            src={fotoUrl}
            alt="Logo da revenda"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {selectedFile && (
        <ImageCropDialog
          isOpen={showCropDialog}
          onClose={() => setShowCropDialog(false)}
          imageUrl={selectedFile}
          onComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}

      {fotoUrl && (
        <PhotoModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          photoUrl={fotoUrl}
          alt="Logo da revenda"
        />
      )}
    </div>
  )
} 