import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tipos de perfil
const PERFIL_TIPOS = {
  PESSOA: 1,
  REVENDA: 2,
  ERP: 3,
  MASTER: 4,
} as const

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
  
  let perfil;

  if (isDevelopment) {
    // Em desenvolvimento, busca o perfil pelo user_id
    const { data: perfilData } = await supabase
      .from('perfis')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    
    perfil = perfilData
  } else {
    // Em produção, busca pelo subdomínio
    const subdomain = hostname.split('.')[0]
    const { data: perfilData } = await supabase
      .from('perfis')
      .select('*')
      .eq('dominio', subdomain)
      .single()
    
    perfil = perfilData
  }

  if (!perfil) {
    console.log('Perfil não encontrado')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  // Verifica se é uma página de revenda e se o status está aguardando ativação
  if (pathname.startsWith('/revendas') && perfil?.revenda_status === 1 && pathname !== '/revendas/ativar_revenda') {
    return NextResponse.redirect(new URL('/revendas/ativar_revenda', req.url))
  }

  // Se a rota for /revendas/ativar_revenda e o status não for 1, redireciona para /revendas
  if (pathname === '/revendas/ativar_revenda' && perfil?.revenda_status !== 1) {
    return NextResponse.redirect(new URL('/revendas', req.url))
  }

  // Verifica se o usuário é o proprietário do perfil ou tem acesso via perfis_users
  const isOwner = perfil.user_id === session.user.id

  if (!isOwner) {
    // Verifica se tem acesso via perfis_users
    const { data: userPerfil } = await supabase
      .from('perfis_users')
      .select('*')
      .eq('perfil_id', perfil.id)
      .eq('user_id', session.user.id)
      .single()

    if (!userPerfil) {
      console.log('Usuário não autorizado:', session.user.id, 'para perfil:', perfil.id)
      return NextResponse.redirect(new URL('/auth/usuario-nao-autorizado', req.url))
    }
  }

  // Verifica redirecionamento baseado no tipo de perfil
  if (pathname === '/') {
    switch (perfil.tipo) {
      case PERFIL_TIPOS.REVENDA:
        return NextResponse.redirect(new URL('/revendas', req.url))
      case PERFIL_TIPOS.ERP:
        return NextResponse.redirect(new URL('/erp', req.url))
      case PERFIL_TIPOS.MASTER:
        return NextResponse.redirect(new URL('/master', req.url))
      default:
        return NextResponse.redirect(new URL('/pessoa', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|imagens).*)',
  ],
}
