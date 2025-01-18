'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TermosModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export default function TermosModal({ isOpen, onClose, title, content }: TermosModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
} 