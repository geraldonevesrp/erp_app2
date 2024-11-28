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
  onCropComplete: (croppedImageUrl: string) => void
}

export function ImageCropDialog({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
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

    // Calcular posição de crop considerando o zoom
    const sourceX = pixelCrop.x
    const sourceY = pixelCrop.y
    const sourceWidth = pixelCrop.width
    const sourceHeight = pixelCrop.height

    // Se for circular, criar máscara
    if (isCircular) {
      ctx.beginPath()
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2,
        0,
        2 * Math.PI
      )
      ctx.clip()
    }

    // Desenhar a imagem cropada
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Redimensionar se necessário
    const maxSize = 400
    let finalWidth = canvas.width
    let finalHeight = canvas.height

    if (finalWidth > finalHeight) {
      if (finalWidth > maxSize) {
        finalHeight = Math.round((finalHeight * maxSize) / finalWidth)
        finalWidth = maxSize
      }
    } else {
      if (finalHeight > maxSize) {
        finalWidth = Math.round((finalWidth * maxSize) / finalHeight)
        finalHeight = maxSize
      }
    }

    // Criar canvas final com o tamanho ajustado
    const finalCanvas = document.createElement("canvas")
    finalCanvas.width = finalWidth
    finalCanvas.height = finalHeight
    const finalCtx = finalCanvas.getContext("2d")

    if (!finalCtx) {
      throw new Error("No 2d context")
    }

    // Se for circular, criar máscara no canvas final
    if (isCircular) {
      finalCtx.beginPath()
      finalCtx.arc(
        finalWidth / 2,
        finalHeight / 2,
        Math.min(finalWidth, finalHeight) / 2,
        0,
        2 * Math.PI
      )
      finalCtx.clip()
    }

    // Desenhar imagem redimensionada
    finalCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      finalWidth,
      finalHeight
    )

    // Se for circular, adicionar fundo transparente
    if (isCircular) {
      finalCtx.globalCompositeOperation = 'destination-in'
      finalCtx.beginPath()
      finalCtx.arc(
        finalWidth / 2,
        finalHeight / 2,
        Math.min(finalWidth, finalHeight) / 2,
        0,
        2 * Math.PI
      )
      finalCtx.fill()
    }

    return finalCanvas.toDataURL("image/png", 1.0)
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
        onCropComplete(croppedImage)
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
        <div className="relative h-[400px] w-full mt-4">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape={cropShape}
            onCropChange={handleCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={handleZoomChange}
            onRotationChange={handleRotationChange}
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <ToggleGroup type="single" value={cropShape} onValueChange={(value: "rect" | "round") => value && setCropShape(value)}>
              <ToggleGroupItem value="rect" aria-label="Retangular">
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
              onValueChange={handleZoomChange}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rotação</label>
            <Slider
              value={[rotation]}
              onValueChange={handleRotationChange}
              min={0}
              max={360}
              step={1}
              className="w-full"
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
