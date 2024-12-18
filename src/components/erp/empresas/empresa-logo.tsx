"use client"

import { Camera } from "lucide-react"

interface EmpresaLogoProps {
  empresaId?: number
  perfilId?: number
  logoUrl?: string | null
  onLogoUpdated?: (url: string) => void
  disabled?: boolean
  className?: string
}

export function EmpresaLogo({ 
  empresaId, 
  perfilId, 
  logoUrl, 
  onLogoUpdated,
  disabled = false,
  className = "" 
}: EmpresaLogoProps) {
  return (
    <div className={`w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo da empresa"
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
