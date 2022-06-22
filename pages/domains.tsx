import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { Button, Table, useModal, Modal, useToasts, Spacer } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'
import FilterTable from 'components/filter-table'
import { DomainData, DomainItem, TableColumnRender } from 'lib/interfaces'
import dynamic from 'next/dynamic'

const NewDomainModal = dynamic(() => import('components/new-domain-modal'), {
  ssr: false
})

const Domains: NextPage = () => {
  const { visible: modalVisible, setVisible: setModalVisible, bindings: modalBindings } = useModal()

  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [domain, setDomain] = useState('')

  const { data: domains = { scope: '', domain: [] }, error, mutate } = useSWR<DomainData>(`/api/domains`)

  const handleRemove = (domain: string) => {
    setModalVisible(true)
    setDomain(domain)
  }

  const removeDomain = async () => {
    setLoading(true)
    const res = await fetch(`/api/domains/${domain}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    if (result.name === 'OK') {
      mutate()
      setToast({
        text: 'Removed Domain Successfully'
      })
    } else {
      setToast({
        text: result.message
      })
    }
    setLoading(false)
  }

  const renderLinks: TableColumnRender<DomainItem> = (a, rowData) => {
    return (
      <>
        <Link href={`/${rowData.domain}/data`}><a>Data</a></Link>
        <Spacer w={0.3} />
        <Link href={`/${rowData.domain}/publishlog`}><a>PublishLog</a></Link>
        <Spacer w={0.3} />
        <Link href={`/${rowData.domain}/privilege`}><a>Privilege</a></Link>
      </>
    )
  }
  const renderAction: TableColumnRender<DomainItem> = (id, rowData) => {
    return (
      <Button type="secondary" auto scale={1/3} font="12px" onClick={() => handleRemove(rowData.domain)}>Delete</Button>
    )
  }
  const handleUpdate = (type: string) => {
    if (type === 'new') {
      mutate()
    }
  }

  return (
    <Layout title="Domains">
      <FilterTable data={domains.domain} filter={['domain']} buttons={(
        <NewDomainModal onUpdate={handleUpdate} />
      )}>
        <Table.Column prop="domain" label="Domain" />
        <Table.Column prop="createBy" label="" render={renderLinks} />
        <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
        <Table.Column prop="id" label="operation" width={100} render={renderAction} />
      </FilterTable>

      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to delete this item?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={removeDomain}>OK</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Domains
