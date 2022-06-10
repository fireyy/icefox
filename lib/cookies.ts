import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiResponse } from 'next'

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  res.setHeader('Set-Cookie', serialize(name, stringValue, {httpOnly: true, sameSite: 'lax', ...options}))
}

export const setScopeCookie = (res: NextApiResponse, domain: string) => {
  setCookie(res, 'scope', domain, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export const getCookie = (key: string) => {
  const cookieData = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)')?.pop() || ''

  return cookieData.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
}
