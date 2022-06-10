import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

const blacklist = [
  '/api/',
  '/sign-in',
  '/domains'
]

export function middleware(request: NextRequest) {
  console.log('middleware', request.cookies)
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !blacklist.find(t => request.nextUrl.pathname.includes(t))

  // if (shouldHandleLocale) {
  //   const url = request.nextUrl.clone()
  //   const scope = request.cookies.scope || ''
  //   url.pathname = `/${scope}${request.nextUrl.pathname}`
  //   return NextResponse.redirect(url)
  // }

  return undefined
}
