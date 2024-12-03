import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface PhotoModalProps {
  isOpen: boolean
  onClose: () => void
  photoUrl: string
  alt?: string
}

export function PhotoModal({ isOpen, onClose, photoUrl, alt }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden flex items-center justify-center">
        <DialogTitle className="sr-only">
          {alt || "Visualização da foto"}
        </DialogTitle>
        <div className="relative flex items-center justify-center">
          <DialogClose className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10">
            <X className="h-4 w-4" />
          </DialogClose>
          <div className="p-1">
            <img
              src={photoUrl}
              alt={alt || "Foto em tamanho grande"}
              className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
