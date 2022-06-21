import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid, Table, useModal, Modal, useToasts, Breadcrumbs, Pagination, TableColumnProps } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import ArrowLeft from '@geist-ui/icons/arrowLeft'
import { formatDate } from 'lib/utils'
import FilterTable from 'components/filter-table'
import { ChangelogItem, TableColumnRender } from 'lib/interfaces'

const Changelog: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const keyId = router.query.id
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const [value, setValue] = useState('')
  const [pageIndex, setPageIndex] = useState(1)

  const { data: keyData } = useSWR(domain && `/api/domains/${domain}/${keyId}`)
  const { data = { data: [] }, error, mutate } = useSWR(keyId && `/api/changelog/${keyId}?page=${pageIndex}&limit=10`)

  const handleReuse = async (val: string) => {
    setModalVisible(true)
    setValue(val)
  }

  const onReuse = async () => {
    setLoading(true)
    const res = await fetch(`/api/domains/${domain}/${keyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value,
      }),
    })
    const result = await res.json()
    if (result.id) {
      setModalVisible(false)
      setToast({
        text: 'Updated data Successfully.',
        type: 'success',
      })
      setLoading(false)
      mutate()
    }
  }

  const renderUser: TableColumnRender<ChangelogItem> = (createBy, rowData) => {
    return (
      <>{rowData?.user?.name}({rowData?.user?.email})</>
    )
  }
  const renderAction: TableColumnRender<ChangelogItem> = (id, rowData) => {
    return (
      <Button auto scale={0.25} onClick={() => handleReuse(rowData.value)}>Reuse</Button>
    )
  }
  return (
    <Layout title="Change Log">
      <Breadcrumbs mb={1}>
        <Breadcrumbs.Item onClick={() => router.back()}><ArrowLeft /></Breadcrumbs.Item>
        <Breadcrumbs.Item>{domain}{keyData?.path}:{keyData?.name}</Breadcrumbs.Item>
      </Breadcrumbs>
      <FilterTable data={data.data} filter={['value']}>
        <Table.Column prop="value" label="value" />
        <Table.Column prop="createBy" label="by" render={renderUser} />
        <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
        <Table.Column prop="id" label="operation" width={100} render={renderAction} />
      </FilterTable>
      <Pagination count={data.pageCount} onChange={(p) => setPageIndex(p)} mt={2} />
      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to reuse this value?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onReuse}>OK</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Changelog
