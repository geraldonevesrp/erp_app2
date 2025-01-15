import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PERFIL_TIPOS } from '@/types/perfil'

// Páginas públicas que não precisam de autenticação
const PUBLIC_PAGES = [
  '/auth/login',
  '/auth/logout',
  '/auth/sem-acesso',
  '/auth/usuario-nao-autorizado',
  '/public/inscricao-revenda',
  '/public/inscricao-revenda/sucesso',
  '/public/home'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname
  const supabase = createMiddlewareClient({ req, res })

  // Se for uma página pública, permite acesso direto
  if (PUBLIC_PAGES.includes(pathname)) {
    return res
  }

  // Verifica a sessão primeiro
  const { data: { session } } = await supabase.auth.getSession()

  // Se não estiver autenticado, redireciona para login
  if (!session) {
    const url = new URL('/auth/login', req.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Pega o hostname e identifica o ambiente
  const hostname = req.headers.get('host') || ''
  const isDevelopment = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  
  console.log('=== Middleware Debug ===')
  console.log('Hostname:', hostname)
  console.log('Is Development:', isDevelopment)
  console.log('Pathname:', pathname)
  console.log('Session User:', session.user.id)
  
  // Busca o perfil do usuário logado
  const { data: userPerfis, error: userError } = await supabase
    .from('perfis')
    .select('*, perfis_tipos(*)')
    .eq('user_id', session.user.id)

  console.log('User Perfis:', userPerfis)
  console.log('User Error:', userError)

  if (!userPerfis || userPerfis.length === 0) {
    console.log('Nenhum perfil encontrado para o usuário')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  let perfilTipo = null

  // Em desenvolvimento, verifica se tem subdomínio
  const subdomain = hostname.split('.')[0]
  console.log('Subdomain:', subdomain)

  if (isDevelopment && hostname.includes('.')) {
    // Se tem subdomínio, busca o perfil correspondente
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfis')
      .select('*, perfis_tipos(*)')
      .eq('dominio', subdomain)
      .single()
    
    console.log('Perfil do subdomínio:', perfilData)
    console.log('Erro ao buscar perfil:', perfilError)

    if (perfilData) {
      console.log('Usando perfil do subdomínio como principal')
      perfilTipo = perfilData.tipo
      console.log('Tipo do perfil:', perfilTipo)

      // Verifica se o usuário tem acesso a este perfil
      const hasDirectAccess = userPerfis.some(p => p.id === perfilData.id)
      console.log('Has Direct Access:', hasDirectAccess)

      if (!hasDirectAccess) {
        const { data: perfilAccess, error: accessError } = await supabase
          .from('perfis_users')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('perfil_id', perfilData.id)
          .single()

        console.log('Perfil Access:', perfilAccess)
        console.log('Access Error:', accessError)

        if (!perfilAccess) {
          console.log('Usuário não tem acesso ao perfil do subdomínio')
          return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
        }
      }
    }
  }

  // Verifica se a rota corresponde ao tipo de perfil
  console.log('Verificando acesso à rota:', pathname)
  console.log('Tipo do perfil:', perfilTipo)
  console.log('Tipo ERP:', PERFIL_TIPOS.ERP)

  if (pathname.startsWith('/erp') && perfilTipo !== PERFIL_TIPOS.ERP) {
    console.log('Usuário não tem permissão para acessar área ERP')
    console.log('Tipo do perfil:', perfilTipo)
    console.log('Tipo esperado:', PERFIL_TIPOS.ERP)
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  if (pathname.startsWith('/revendas') && perfilTipo !== PERFIL_TIPOS.REVENDA) {
    console.log('Usuário não tem permissão para acessar área de Revendas')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  if (pathname.startsWith('/master') && perfilTipo !== PERFIL_TIPOS.MASTER) {
    console.log('Usuário não tem permissão para acessar área Master')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  console.log('Acesso permitido')
  console.log('=== Fim Middleware Debug ===')

  // Se chegou até aqui, permite o acesso
  return res
}

export const config = {
  matcher: [
    '/revendas/:path*',
    '/erp/:path*',
    '/master/:path*',
    '/auth/:path*'
  ],
}
