import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se for a página inicial, permite o acesso
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Se for uma rota de autenticação, permite o acesso
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next()
  }

  // Para todas as outras rotas, verifica se o usuário está autenticado
  const token = request.cookies.get('auth-token')

  // Se não houver token, redireciona para o login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/tests/:path*',
    '/evaluations/:path*',
    '/results/:path*',
  ],
} 