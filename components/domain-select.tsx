import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@geist-ui/core'
import useTranslation from 'next-translate/useTranslation'
import { Dropdown, DropdownItem } from 'components/dropdown'
import ChevronUpDown from '@geist-ui/icons/chevronUpDown'
import useDomain from 'lib/use-domain'

type Props = {
  data: any
}

const DomainSelect: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const domain = useDomain()

  useEffect(() => {
    if (data && data.length !== 0 && data[0].domain !== domain) {
      router.push({
        pathname: router.pathname,
        query: { domain: data[0].domain },
      })
    }
  }, [data, domain, router])

  const UserSettingsPop = () => {
    return (
      <>
        <DropdownItem title>
          {t('Domains')}
        </DropdownItem>
        {
          data.map((item: any) => {
            return (
              <DropdownItem key={item.id}>
                {item.domain}
              </DropdownItem>
            )
          })
        }
      </>
    )
  }
  return (
    <>
      <Dropdown content={<UserSettingsPop />} placement="bottomStart" portalClassName="user-settings__popover">
        <Button type="abort" auto iconRight={<ChevronUpDown />} scale={2/3}>{domain}</Button>
      </Dropdown>
    </>
  )
}

export default DomainSelect
