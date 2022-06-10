import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Controls from './controls'
import { useTheme, Tabs } from '@geist-ui/core'
import useSWR from 'swr'
import DomainSelect from 'components/domain-select'
import Divider from '@geist-ui/icons/divider'
import { getCurrentRoutePath } from 'lib/utils'

const Header: React.FC<unknown> = () => {
  const router = useRouter()
  const theme = useTheme()

  const currentUrlTabValue = getCurrentRoutePath()

  const handleTabChange = useCallback(
    (tab: string) => {
      const shouldRedirectDefaultPage = currentUrlTabValue !== tab
      if (!shouldRedirectDefaultPage) return
      const defaultPath = `/${tab}`
      router.push(defaultPath)
    },
    [currentUrlTabValue],
  )

  const { data: domains } = useSWR(`/api/domains`)

  return (
    <>
      <div className="header-wrapper">
        <nav className="header">
          <div className="content">
            <div className="logo">
              <NextLink href={`/`}>
                <a aria-label="Go Home" title="IceFox">
                  <svg aria-label="logo" height="20" viewBox="0 0 142 140" fill={theme.palette.foreground}>
                    <path d="M25.5 9L50.1817 54.75H0.818275L25.5 9Z" />
                    <path d="M116.5 9L141.182 54.75H91.8183L116.5 9Z" />
                    <path d="M71.5 135L2.65098 58.5L140.349 58.5L71.5 135Z" />
                  </svg>
                </a>
              </NextLink>
            </div>
            <Divider color={theme.palette.accents_2} />
            <DomainSelect data={domains} />
            <div className="menu">
              <Tabs
                value={currentUrlTabValue}
                leftSpace={0}
                activeClassName="current"
                hideDivider
                onChange={handleTabChange}>
                <Tabs.Item font="14px" label="Overview" value="" />
                <Tabs.Item font="14px" label="Data" value="data" />
                <Tabs.Item font="14px" label="Publish Log" value="publishlog" />
                <Tabs.Item font="14px" label="Privilege" value="privilege" />
              </Tabs>
            </div>

            <div className="controls">
              <Controls />
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .header-wrapper {
          height: var(--geist-page-nav-height);
        }
        .header {
          position: fixed;
          top: 0;
          height: var(--geist-page-nav-height);
          width: 100%;
          background-color: ${theme.palette.background};
          box-shadow: inset 0 -1px ${theme.palette.accents_2};
          z-index: 999;
        }
        nav .content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          height: 100%;
          margin: 0 auto;
          user-select: none;
          padding: 0 ${theme.layout.gap};
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .logo a {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          font-size: 1rem;
          font-weight: 500;
          color: inherit;
          height: 28px;
        }
        .logo svg {
          margin-right: 5px;
        }
        .menu {
          flex: 1 1;
          padding: 0 ${theme.layout.gapHalf};
        }
        .menu :global(.content) {
          display: none;
        }
        .controls {
          flex: 1 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .controls :global(.menu-toggle) {
          display: flex;
          align-items: center;
          min-width: 40px;
          height: 40px;
          padding: 0;
        }
        @media (max-width: ${theme.breakpoints.sm.max}) {
          .logo a {
            font-size: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Header
