"use client"

import { Camera } from "lucide-react"

interface PessoaFotoProps {
  pessoaId: number
  perfilId: number
  fotoUrl: string | null
  onFotoUpdated: (novaUrl: string) => void
  disabled?: boolean
  className?: string
}

export function PessoaFoto({ 
  pessoaId, 
  perfilId, 
  fotoUrl, 
  onFotoUpdated,
  disabled = false,
  className = "" 
}: PessoaFotoProps) {
  return (
    <div className={`w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 ${className}`}>
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
    </div>
  )
}
