import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_FILE = /\.(.*)$/

const blacklist = [
  '/api/',
  '/sign-in',
  '/domains',
  '/no-permission',
]

const adminRoleProtect = [
  '/privilege',
  '/domains',
]

export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()
  const scope = request.cookies.scope

  console.log('pathname', pathname)

  if (PUBLIC_FILE.test(pathname)) return NextResponse.next()

  // FIXME: type check
  const token: any = await getToken({
    req: request,
    secret: process.env.SECRET,
  })

  // Allow the requests if the following in true
  // 1) Its a request for next-auth session & provider fetching
  // 2) The token exists

  if (pathname === '/sign-in' && token) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (pathname.includes('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect them to login if they don't have token and are requesting a protected route
  if (!token && pathname !== '/sign-in') {
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (token && adminRoleProtect.find(t => pathname === t) && token.role !== 'ADMIN') {
    url.pathname = '/no-permission'
    return NextResponse.redirect(url)
  }

  const hasScope = !!scope && !pathname.includes(scope)

  const shouldHandleRedirect =
    !PUBLIC_FILE.test(pathname) &&
    !blacklist.find(t => pathname.includes(t)) &&
    pathname !== '/' &&
    hasScope

  if (shouldHandleRedirect) {
    console.log('should handle locale')
    url.pathname = `/${scope}${pathname}`

    return NextResponse.redirect(url)
  }

  return undefined
}
