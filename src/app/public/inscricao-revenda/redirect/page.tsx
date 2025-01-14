'use client'

import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function RedirectPage() {
  useEffect(() => {
    const handleRedirect = async () => {
      const supabase = createClientComponentClient()
      
      try {
        // Pega os parâmetros da URL
        const params = new URLSearchParams(window.location.search)
        const dominio = params.get('dominio')
        
        if (!dominio) {
          throw new Error('Domínio não fornecido')
        }

        // Verifica se tem sessão
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('Sessão não encontrada')
        }

        // Configura o redirecionamento para o subdomínio
        const protocol = window.location.protocol
        const hostname = window.location.hostname
        const port = window.location.port
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1'

        // Constrói a URL base com o subdomínio
        let baseUrl
        if (isDevelopment) {
          baseUrl = `${protocol}//${dominio}.${hostname}${port ? `:${port}` : ''}`
        } else {
          const domainParts = hostname.split('.')
          const mainDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : hostname
          baseUrl = `${protocol}//${dominio}.${mainDomain}`
        }

        // Configura os cookies de autenticação
        document.cookie = `sb-access-token=${session.access_token}; path=/; domain=${isDevelopment ? `${dominio}.${hostname}` : `.${hostname}`}; max-age=${60 * 60 * 24 * 7}`
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; domain=${isDevelopment ? `${dominio}.${hostname}` : `.${hostname}`}; max-age=${60 * 60 * 24 * 7}`

        // Redireciona para o subdomínio
        window.location.href = `${baseUrl}/revendas`
      } catch (error) {
        console.error('Erro no redirecionamento:', error)
        window.location.href = '/auth/login'
      }
    }

    handleRedirect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mt-4 flex justify-center">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-600">
          Redirecionando para sua revenda...
        </p>
      </div>
    </div>
  )
}
