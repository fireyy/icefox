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
import { useRouter } from 'next/router'
import { Dropdown, DropdownItem } from 'components/dropdown'

type Props = {
  data: any
}

const UserSettingsPop: React.FC<Props> = ({ data }) => {
  const { theme, setTheme } = useNextTheme()

  return (
    <>
      <DropdownItem title>
        Signed in as {data.user.email}
      </DropdownItem>
      {
      data.user.role === 'ADMIN' && (
          <>
            <DropdownItem className="link">
              <NextLink href="/domains">Domains</NextLink>
            </DropdownItem>
            <DropdownItem className="link">
              <NextLink href="/users">Users</NextLink>
            </DropdownItem>
            <DropdownItem line />
          </>
        )
      }
      <DropdownItem disableAutoClose>
        Theme
        <Select
          disableMatchWidth
          height="28px"
          onChange={(type) => setTheme(type as string)}
          value={theme}
          title="Switch Themes"
          ml={0.5}
          style={{ minWidth: '7em' }}>
          <Select.Option value="system">
            <span className="select-content">
              <Display size={12} /> System
            </span>
          </Select.Option>
          <Select.Option value="light">
            <span className="select-content">
              <SunIcon size={12} /> Light
            </span>
          </Select.Option>
          <Select.Option value="dark">
            <span className="select-content">
              <MoonIcon size={12} /> Dark
            </span>
          </Select.Option>
        </Select>
      </DropdownItem>
      <DropdownItem line />
      <DropdownItem className="link">
        <Link href="/api/auth/signout">
          Logout
        </Link>
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

  return (
    <div className="wrapper">
      <Keyboard
        h="28px"
        command
        font="12px"
        className="shortcuts"
        title="search title">
        K
      </Keyboard>
      <Spacer w={0.75} />
      { session && session.user && (
        <Dropdown content={<UserSettingsPop data={session} />} portalClassName="user-settings__popover">
          <button className="user-settings__button">
            <Avatar src={session.user.image ?? ''} text={session.user.name ?? ''} />
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
