import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

const blacklist = [
  '/api/',
  '/sign-in',
  '/domains'
]

export function middleware(request: NextRequest) {
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !blacklist.find(t => request.nextUrl.pathname.includes(t))

  if (shouldHandleLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/domain/${request.nextUrl.pathname}`
    return NextResponse.redirect(url)
  }

  return undefined
}
