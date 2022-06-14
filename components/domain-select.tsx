import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, useTheme } from '@geist-ui/core'
import { Dropdown, DropdownItem } from 'components/dropdown'
import ChevronUpDown from '@geist-ui/icons/chevronUpDown'
import Check from '@geist-ui/icons/check'
import Plus from '@geist-ui/icons/plus'

type Props = {
  data: any
  scope: string
}

const DomainSelect: React.FC<Props> = ({ data, scope }) => {
  const router = useRouter()
  const theme = useTheme()
  const domain = scope

  const handleSelect = async (domain: string) => {
    const res = await fetch(`/api/domains/${domain}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    if (result.domain === domain) {
      router.push(router.pathname.replace('[domain]', domain))
    }
  }

  const UserSettingsPop = () => {
    return (
      <>
        <DropdownItem title disableAutoClose>
          Domains
        </DropdownItem>
        {
          data.map((item: any) => {
            return (
              <DropdownItem key={item.id} className={domain === item.domain ? 'checked' : ''} onClick={() => handleSelect(item.domain)}>
                <span>{item.domain}</span>
                {
                  domain === item.domain ? (
                    <Check size={18} />
                  ) : null
                }
              </DropdownItem>
            )
          })
        }
        <DropdownItem>
          <Link href="/domains">Add New Domain</Link>
          <Plus size={18} />
        </DropdownItem>
      </>
    )
  }
  return (
    <>
      <Dropdown content={<UserSettingsPop />} placement="bottomStart" portalClassName="domain-select">
        <Button type="abort" auto iconRight={<ChevronUpDown />} scale={2/3} pl={0.2}>{(domain || '').split('.')[0]}</Button>
      </Dropdown>
      <style jsx global>{`
        .tooltip-content.popover.drop-menu-box.domain-select {
          width: 280px;
        }
        .tooltip .dropdown-button .btn {
          width: 100px;
          max-width: 100px;
          font-weight: 500;
          font-size: 14px;
          color: ${theme.palette.accents_6};
          text-transform: none;
        }
        .tooltip .dropdown-button .btn .text {
          width: 80px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
          padding-right: 0;
        }
      `}</style>
    </>
  )
}

export default DomainSelect
