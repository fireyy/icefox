import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

const blacklist = [
  '/api/',
  '/sign-in',
  '/domains'
]

export function middleware(request: NextRequest) {
  const scope = request.cookies.scope
  const hasScope = !!scope && !request.nextUrl.pathname.includes(scope)

  const shouldHandleRedirect =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !blacklist.find(t => request.nextUrl.pathname.includes(t)) &&
    request.nextUrl.pathname !== '/' &&
    hasScope

  if (shouldHandleRedirect) {
    console.log('should handle locale')
    const url = request.nextUrl.clone()
    url.pathname = `/${scope}${request.nextUrl.pathname}`

    return NextResponse.redirect(url)
  }

  return undefined
}
