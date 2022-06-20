import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, useTheme, Text, Code, useClickAway } from '@geist-ui/core'
import Search from '@geist-ui/icons/search'
import ChevronUpDown from '@geist-ui/icons/chevronUpDown'
import Check from '@geist-ui/icons/check'
import Plus from '@geist-ui/icons/plus'
import InputFilter from './input-filter'

type Props = {
  data: any
  scope: string
  onUpdate?: (domain: string) => void
}

type FilterItem = {
  name: string
  value: string
}

const DomainSelect: React.FC<Props> = ({ data, scope, onUpdate }) => {
  const router = useRouter()
  const theme = useTheme()
  const [domain, setDomain] = useState(scope)
  const [filter, setFilter] = useState<FilterItem | null>(null)
  const [keyData, setKeyData] = useState<[]>(data)
  const [isClear, setIsClear] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  useClickAway(ref, () => {
    setVisible(false)
  })

  const fetchDomain = async (d: string) => {
    await fetch(`/api/domains/${d}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    setDomain(d)
  }

  const handleSelect = async (d: string) => {
    setVisible(false)
    onUpdate && onUpdate(d)
    if (!router.pathname.startsWith('/[domain]')) {
      fetchDomain(d)
    } else if (domain !== d) {
      router.push(router.pathname.replace('[domain]', d))
    }
  }

  useEffect(() => {
    if (router.query.domain && router.query.domain !== domain) {
      const d = router.query.domain as string
      fetchDomain(d)
    }
  }, [router.query.domain, domain])

  const handleFilterChange = (name: string, value: string, callback = () => {}) => {
    if (data) {
      if (value) {
        const filterResult = data.filter((item: any) => {
          return String(item[name]).toLowerCase().includes(value.toLowerCase())
        })
        setFilter({
          name,
          value
        })
        setKeyData(filterResult)
      } else {
        setFilter(null)
        setKeyData(data)
      }
      callback && callback()
    }
  }
  const handleClearSearch = () => {
    setIsClear(isClear+1)
  }
  const handleNew = () => {
    setVisible(false)
    router.push('/domains')
  }

  return (
    <>
      <div ref={ref} className={visible ? 'domain-select visible' : 'domain-select hidden'}>
        <Button className="domain-select-button" type="abort" auto iconRight={<ChevronUpDown />} scale={2/3} pl={0.2} onClick={() => setVisible(!visible)} title={domain}>{(domain || '').split('.')[0]}</Button>
        <div className="popup">
          <div className="filter">
            <InputFilter icon={<Search />} name="domain" onCallback={handleFilterChange} isClear={isClear} width="100%" />
          </div>
          <div className="lists">
            {
              keyData.map((item: any) => {
                return (
                  <div key={item.id} className="item" onClick={() => handleSelect(item.domain)} aria-current={domain === item.domain}>
                    <span>{item.domain}</span>
                    {
                      domain === item.domain ? (
                        <Check size={18} />
                      ) : null
                    }
                  </div>
                )
              })
            }
            {
              !filter && (
                <div className="item" onClick={handleNew}>
                  <span>Add New Domain</span>
                  <Plus size={18} />
                </div>
              )
            }
            {
              keyData && keyData.length === 0 && filter && (
                <div className="nothing">
                  <Text>No results for <Code>{`${filter.name}=${filter.value}`}</Code></Text>
                  <Button auto onClick={handleClearSearch}>Clear Search</Button>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scope_open {0%{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes scope_close {0%{opacity:1;transform:none}to{opacity:0;transform:translateY(10px);visibility: hidden;}}
        .domain-select :global(.domain-select-button) {
          width: 100px;
          max-width: 100px;
          font-weight: 500;
          font-size: 14px;
          color: ${theme.palette.accents_6};
          text-transform: none;
        }
        .domain-select :global(.domain-select-button .text) {
          width: 80px;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
          text-align: left;
          padding-right: 0;
          justify-content: flex-start;
        }
        .domain-select .popup {
          position: absolute;
          top: 50px;
          width: 280px;
          box-shadow: 0 8px 30px rgba(0,0,0,.12);
          background: var(--geist-background);
          border-radius: var(--geist-radius);
          border: 1px solid var(--accent-2);
          overflow: hidden;
          min-width: 280px;
        }
        .domain-select.hidden .popup {
          visibility: hidden;
          animation: scope_close .1s ease forwards;
        }
        .domain-select.visible .popup {
          visibility: visible;
          animation: scope_open .1s ease forwards;
        }
        .domain-select .filter :global(.input-wrapper) {
          border-radius: 0;
          border: 0;
          border-bottom: 1px solid var(--accent-2);
        }
        .domain-select .popup .lists {
          margin: 8px;
          max-height: 190px;
          overflow-y: auto;
          transition: height .1s ease;
          will-change: height;
          position: relative;
        }
        .domain-select .lists .item {
          cursor: pointer;
          font-size: 14px;
          line-height: 20px;
          color: var(--body-color);
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 8px;
          border-radius: var(--geist-radius);
          user-select: none;
        }
        .domain-select .lists .item:hover {
          background: var(--accent-1);
          color: var(--geist-foreground);
        }
        .domain-select .lists .item[aria-current="true"] {
          background: var(--accent-2);
          color: var(--geist-foreground);
        }
        .domain-select .lists .item span {
          flex: 1;
        }
        .nothing {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default DomainSelect
