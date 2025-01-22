'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface StatusBarProps {
  message: string
  progress?: number
  className?: string
}

export function StatusBar({ message, progress, className }: StatusBarProps) {
  return (
    <div className={cn("w-full max-w-md space-y-4", className)}>
      <div className="flex items-center space-x-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {progress !== undefined && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
