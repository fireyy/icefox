import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTheme } from '@geist-ui/core'
import Header from 'components/header'
import Search from 'components/search'

type WithChildren<T = {}> = T & PropsWithChildren<{}>;

interface LayoutProps extends WithChildren {
  title?: string
}

export default function Layout({ title, children }: LayoutProps) {
  const router = useRouter()
  const theme = useTheme()
  const isFront = router.pathname.startsWith('/sign-in')
  const isOverview = router.pathname === '/'

  return (
    <>
      <Head>
        <title>{`${title} - Icefox`}</title>
      </Head>
      {
        !isFront && (
          <>
            <Header />
            <Search />
          </>
        )
      }
      <div className="layout">
        <div className="wrapper">{children}</div>
      </div>
      <style jsx>{`
        .layout {
          min-height: ${ isFront ? '100vh' : 'calc(100vh - var(--geist-page-nav-height))'};
          background-color: ${ isOverview ? 'var(--accent-1)' : 'var(--geist-background)'};
        }
        .wrapper {
          max-width: ${theme.layout.pageWidthWithMargin};
          margin: 0 auto;
          padding: ${theme.layout.gap};
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}
