import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import {
  Link,
  Keyboard,
  useTheme,
  Avatar,
  Spacer,
  Select,
} from '@geist-ui/core'
import MoonIcon from '@geist-ui/icons/moon'
import SunIcon from '@geist-ui/icons/sun'
import Display from '@geist-ui/icons/display'
import { useTheme as useNextTheme } from 'next-themes'
import setLanguage from 'next-translate/setLanguage'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Dropdown, DropdownItem } from 'components/dropdown'

type Props = {
  email: string
}

const UserSettingsPop: React.FC<Props> = ({ email }) => {
  const { theme, setTheme } = useNextTheme()
  const { locale, locales = [] } = useRouter()
  const { t } = useTranslation('common')

  const switchLocale = async (lang: string | string[]) => {
    await setLanguage(lang as string)
  }

  return (
    <>
      <DropdownItem title>
        Signed in as {email}
      </DropdownItem>
      <DropdownItem>
        <NextLink href="/domains">{t('Domains')}</NextLink>
      </DropdownItem>
      <DropdownItem line />
      <DropdownItem>
        {t('Lang')}
        <Select
          disableMatchWidth
          height="28px"
          onChange={switchLocale}
          value={locale}
          title={t('Switch Language')}
          ml={0.5}
          style={{ minWidth: '7em' }}>
          {
            locales.map(l => (
              <Select.Option key={l} value={l}>
                <span className="select-content">
                  {t(`${l}`)}
                </span>
              </Select.Option>
            ))
          }
        </Select>
      </DropdownItem>
      <DropdownItem line />
      <DropdownItem>
        {t('Theme')}
        <Select
          disableMatchWidth
          height="28px"
          onChange={(type) => setTheme(type as string)}
          value={theme}
          title={t('Switch Themes')}
          ml={0.5}
          style={{ minWidth: '7em' }}>
          <Select.Option value="system">
            <span className="select-content">
              <Display size={12} /> {t('System')}
            </span>
          </Select.Option>
          <Select.Option value="light">
            <span className="select-content">
              <SunIcon size={12} /> {t('Light')}
            </span>
          </Select.Option>
          <Select.Option value="dark">
            <span className="select-content">
              <MoonIcon size={12} /> {t('Dark')}
            </span>
          </Select.Option>
        </Select>
      </DropdownItem>
      <DropdownItem line />
      <DropdownItem>
        <a href="/api/auth/signout">
          {t('Logout')}
        </a>
      </DropdownItem>
      <style jsx>{`
        .select-content {
            width: auto;
            height: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .select-content :global(svg) {
            margin-right: 5px;
            margin-left: 2px;
          }
      `}</style>
    </>
  )
}

const Controls: React.FC<unknown> = React.memo(() => {
  const { data: session } = useSession()
  const theme = useTheme()
  const { t } = useTranslation('common')

  return (
    <div className="wrapper">
      <Keyboard
        h="28px"
        command
        font="12px"
        className="shortcuts"
        title={t('search title')}>
        K
      </Keyboard>
      <Spacer w={0.75} />
      { session && session.user && (
        <Dropdown content={<UserSettingsPop email={session.user.email} />} portalClassName="user-settings__popover">
          <button className="user-settings__button">
            <Avatar src={session.user.image} text={session.user.name} />
          </button>
        </Dropdown>
      )}
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
        }
        .wrapper :global(kbd.shortcuts) {
          line-height: 28px !important;
          cursor: help;
          opacity: 0.75;
          border: none;
        }
        .user-settings__button {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          appearance: none;
          cursor: pointer;
        }
        :global(.user-settings__popover) {
          width: 180px !important;
        }
        :global(.user-settings__popover .link) {
          display: block;
          width: 100%;
          padding: ${theme.layout.gapHalf};
          margin: -8px -12px;
          box-sizing: content-box;
        }
        :global(.user-settings__popover .link:hover) {
          background-color: ${theme.palette.accents_1};
        }
        @media (max-width: ${theme.breakpoints.xs.max}) {
          .wrapper :global(kbd.shortcuts) {
            display: none;
          }
        }
      `}</style>
    </div>
  )
})

Controls.displayName = 'Controls'

export default Controls
