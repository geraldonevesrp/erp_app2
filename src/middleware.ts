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

// Páginas que não precisam verificar perfil
const PUBLIC_PAGES = [
  '/auth/sem-acesso',
  '/auth/usuario-nao-autorizado',
  '/auth/login'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Se for uma página pública, permite acesso direto
  if (PUBLIC_PAGES.includes(pathname)) {
    return res
  }

  // Pega o hostname e identifica o subdomínio
  const hostname = req.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]
  
  // Se for domínio principal, redireciona para sem-acesso
  if (hostname === 'localhost' || hostname === 'www' || hostname === 'erp1.com.br') {
    const url = new URL('/auth/sem-acesso', req.url)
    return NextResponse.redirect(url)
  }

  const supabase = createMiddlewareClient({ req, res })

  // Busca o perfil pelo subdomínio
  const { data: perfil } = await supabase
    .from('perfis')
    .select('*')
    .eq('dominio', subdomain)
    .single()

  if (!perfil) {
    console.log('Perfil não encontrado para o subdomínio:', subdomain)
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  // Para todas as outras rotas, verifica autenticação
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redireciona para login mantendo o subdomínio
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Verifica se o usuário é o proprietário do perfil ou tem acesso via perfis_users
  const isOwner = perfil.user_id === session.user.id

  if (!isOwner) {
    // Verifica se tem acesso via perfis_users
    const { data: userPerfil } = await supabase
      .select('*')
      .from('perfis_users')
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
        return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
    }
  }

  // Verifica se o usuário está acessando a área correta
  const isRevendaAccessing = pathname.startsWith('/revendas') && perfil.tipo === PERFIL_TIPOS.REVENDA
  const isErpAccessing = pathname.startsWith('/erp') && perfil.tipo === PERFIL_TIPOS.ERP
  const isMasterAccessing = pathname.startsWith('/master') && perfil.tipo === PERFIL_TIPOS.MASTER

  if (!isRevendaAccessing && !isErpAccessing && !isMasterAccessing) {
    console.log('Usuário tentando acessar área não permitida:', pathname)
    return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
