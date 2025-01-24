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
  '/public/inscricao-erp',
  '/public/inscricao-erp/sucesso',
  '/public/home',
  '/public/dominio-invalido'
]

// Páginas que não precisam de subdomínio
const NO_SUBDOMAIN_PAGES = [
  '/public/inscricao-revenda'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Se for uma página pública, rota do asaas_testes ou API do asaas, permite acesso direto
  if (PUBLIC_PAGES.includes(pathname) || 
      pathname.startsWith('/asaas_testes') || 
      pathname.startsWith('/api/asaas')) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  // Pega o hostname e identifica o ambiente
  const hostname = req.headers.get('host') || ''
  const isDevelopment = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const subdomain = hostname.split('.')[0]

  // Se for uma rota pública que requer subdomínio
  if (pathname.startsWith('/public/inscricao-')) {
    // Em desenvolvimento, verifica se tem subdomínio, exceto para páginas que não precisam
    if (isDevelopment && !hostname.includes('.') && !NO_SUBDOMAIN_PAGES.includes(pathname)) {
      return NextResponse.redirect(new URL('/public/dominio-invalido', req.url))
    }
  }

  // Verifica a sessão primeiro
  const { data: { session } } = await supabase.auth.getSession()

  // Se não estiver autenticado, redireciona para login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Verifica se é uma rota que requer perfil específico
  if (pathname.startsWith('/revendas')) {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('tipo')
      .eq('id', session.user.user_metadata.perfil_id)
      .single()

    if (!perfil || perfil.tipo !== PERFIL_TIPOS.REVENDA) {
      return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/revendas/:path*',
    '/erp/:path*',
    '/master/:path*',
    '/auth/:path*',
    '/public/:path*',
    '/asaas_testes/:path*',
    '/api/asaas/:path*'
  ]
}
