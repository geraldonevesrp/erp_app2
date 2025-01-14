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
  
  // Busca o perfil do usuário logado
  const { data: userPerfil } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (!userPerfil) {
    console.log('Perfil do usuário não encontrado')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  // Verifica se a rota corresponde ao tipo de perfil
  if (pathname.startsWith('/erp') && userPerfil.tipo !== PERFIL_TIPOS.ERP) {
    console.log('Usuário não tem permissão para acessar área ERP')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  if (pathname.startsWith('/revendas') && userPerfil.tipo !== PERFIL_TIPOS.REVENDA) {
    console.log('Usuário não tem permissão para acessar área de Revendas')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  if (pathname.startsWith('/master') && userPerfil.tipo !== PERFIL_TIPOS.MASTER) {
    console.log('Usuário não tem permissão para acessar área Master')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  // Verifica se é uma página de revenda e se o status está aguardando ativação
  if (pathname.startsWith('/revendas') && userPerfil?.revenda_status === 1 && pathname !== '/revendas/ativar_revenda') {
    return NextResponse.redirect(new URL('/revendas/ativar_revenda', req.url))
  }

  // Se a rota for /revendas/ativar_revenda e o status não for 1, redireciona para /revendas
  if (pathname === '/revendas/ativar_revenda' && userPerfil?.revenda_status !== 1) {
    return NextResponse.redirect(new URL('/revendas', req.url))
  }

  // Busca o perfil do domínio atual (se existir)
  let domainPerfil;
  if (isDevelopment) {
    // Em desenvolvimento, usa o mesmo perfil do usuário
    domainPerfil = userPerfil
  } else {
    // Em produção, busca pelo subdomínio
    const subdomain = hostname.split('.')[0]
    const { data: perfilData } = await supabase
      .from('perfis')
      .select('*')
      .eq('dominio', subdomain)
      .single()
    
    domainPerfil = perfilData
  }

  if (!domainPerfil) {
    console.log('Perfil do domínio não encontrado')
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  // Verifica se o usuário tem acesso ao perfil do domínio
  if (userPerfil.id !== domainPerfil.id) {
    const { data: perfilAccess } = await supabase
      .from('perfis_users')
      .select('*')
      .eq('perfil_id', domainPerfil.id)
      .eq('user_id', session.user.id)
      .single()

    if (!perfilAccess) {
      console.log('Usuário não tem acesso ao perfil do domínio')
      return NextResponse.redirect(new URL('/auth/usuario-nao-autorizado', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|imagens).*)',
  ],
}
