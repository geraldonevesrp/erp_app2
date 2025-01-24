'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function TestSessionPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkSession() {
      try {
        console.log('=== Verificando sessão ===')
        // Verificar sessão
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('Sessão:', session)
        if (sessionError) throw sessionError

        // Se tiver sessão, buscar perfil
        let perfilData = null
        if (session?.user?.user_metadata?.perfil_id) {
          console.log('Buscando perfil:', session.user.user_metadata.perfil_id)
          const { data: perfil, error: perfilError } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', session.user.user_metadata.perfil_id)
            .single()
            
          if (perfilError) throw perfilError
          console.log('Perfil encontrado:', perfil)
          perfilData = perfil
        } else {
          console.log('Sem perfil_id nos metadados')
        }

        setSessionData({
          session,
          perfil: perfilData
        })
      } catch (err: any) {
        console.error('Erro ao verificar sessão:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Erro: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Status da Sessão</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Usuário</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(sessionData?.session?.user, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Perfil</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(sessionData?.perfil, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
