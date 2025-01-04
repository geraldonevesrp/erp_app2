'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/auth/login'
    }
    
    logout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Saindo...</span>
      </div>
    </div>
  )
}
