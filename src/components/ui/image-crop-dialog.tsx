"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Square, Circle } from "lucide-react"

interface ImageCropDialogProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  onComplete: (croppedImageUrl: string) => void
  aspectRatio?: number
}

export function ImageCropDialog({
  isOpen,
  onClose,
  imageUrl,
  onComplete,
  aspectRatio = 1
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [cropShape, setCropShape] = useState<"rect" | "round">("rect")

  const handleCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const handleZoomChange = useCallback((zoom: number[]) => {
    setZoom(zoom[0])
  }, [])

  const handleRotationChange = useCallback((rotation: number[]) => {
    setRotation(rotation[0])
  }, [])

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", error => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0,
    isCircular = false
  ): Promise<string> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    // Definir dimensões do canvas baseado na área de crop
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Aplicar transformações
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // Desenhar a imagem cropada
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Se for circular, criar máscara
    if (isCircular) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.putImageData(imageData, 0, 0)

      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    return canvas.toDataURL("image/png")
  }

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          imageUrl, 
          croppedAreaPixels, 
          rotation,
          cropShape === "round"
        )
        onComplete(croppedImage)
        onClose()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Editar Foto</DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px]">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={handleCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <ToggleGroup type="single" value={cropShape} onValueChange={(value: any) => value && setCropShape(value)}>
              <ToggleGroupItem value="rect" aria-label="Quadrado">
                <Square className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="round" aria-label="Circular">
                <Circle className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={handleZoomChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rotação</label>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={handleRotationChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
