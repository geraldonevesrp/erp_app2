import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "./button"

interface PhotoModalProps {
  isOpen: boolean
  onClose: () => void
  photoUrl: string
  alt?: string
}

export function PhotoModal({ isOpen, onClose, photoUrl, alt }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={photoUrl}
            alt={alt || "Foto em tamanho grande"}
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
