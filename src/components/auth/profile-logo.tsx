'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getSubdomain } from '@/lib/utils/subdomain'

interface Profile {
  id: string
  nome: string
  logo_url: string
}

export function ProfileLogo() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const subdomain = getSubdomain(window.location.hostname)
        
        if (!subdomain) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('perfis')
          .select('id, nome, logo_url')
          .eq('dominio', subdomain)
          .single()

        if (error) {
          console.error('Erro ao carregar perfil:', error)
          return
        }

        setProfile(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!profile?.logo_url) {
    return (
      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-4xl font-bold text-primary">
          {profile?.nome?.charAt(0) || '?'}
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-32 h-32">
      <Image
        src={profile.logo_url}
        alt={`Logo ${profile.nome}`}
        fill
        className="rounded-full object-cover"
      />
    </div>
  )
}
