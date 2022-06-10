import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@geist-ui/core'
import useTranslation from 'next-translate/useTranslation'
import { Dropdown, DropdownItem } from 'components/dropdown'
import ChevronUpDown from '@geist-ui/icons/chevronUpDown'
import Check from '@geist-ui/icons/check'

type Props = {
  data: any
}

const DomainSelect: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const domain = ''

  const handleSelect = (domain: string) => {
    router.push({
      pathname: router.pathname,
      query: { domain },
    })
  }

  const UserSettingsPop = () => {
    return (
      <>
        <DropdownItem title disableAutoClose>
          {t('Domains')}
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
      </>
    )
  }
  return (
    <>
      <Dropdown content={<UserSettingsPop />} placement="bottomStart" portalClassName="domain-select">
        <Button type="abort" auto iconRight={<ChevronUpDown />} scale={2/3} pl={0.2}>{domain}</Button>
      </Dropdown>
      <style jsx global>{`
        .tooltip-content.popover.drop-menu-box.domain-select {
          width: 280px;
        }
        .tooltip .dropdown-button .btn {
          width: 120px;
          max-width: 120px;
        }
        .tooltip .dropdown-button .btn .text {
          width: 100px;
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
