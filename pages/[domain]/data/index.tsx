import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Button, Table, useModal, Modal, useToasts, Spacer } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DataItem, DataItems } from 'lib/interfaces'
import FilterTable from 'components/filter-table'
import dynamic from 'next/dynamic'
import Skeleton from 'components/skeleton'

const DataDrawer = dynamic(() => import('components/data-drawer'), {
  ssr: false,
  loading: () => null,
})

const PublishModal= dynamic(() => import('components/publish-modal'), {
  ssr: false,
  loading: () => <Skeleton width={95} height={32} />,
})

const Data: NextPage = () => {
  const router = useRouter()
  const [sideVisible, setSideVisible] = useState(false)
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const domain = router.query.domain

  const { data, error, mutate } = useSWR(domain && `/api/key/${domain}`)

  const handleUpdate = (type: string, payload?: DataItem) => {
    if (type === 'add') {
      mutate()
    } else if (type === 'update' && payload) {
      mutate((mate: DataItems) => {
        const index = mate.findIndex((item: DataItem) => item.id === payload.id)
        mate[index] = payload
        return mate
      })
    } else if (type === 'remove' && payload) {
      mutate(data.filter((item: DataItem) => item.id !== payload.id))
    }
  }

  const handleNew = () => {
    setCurrent(0)
    setSideVisible(true)
  }

  const handleEdit = (id: number) => {
    setCurrent(id)
    setSideVisible(true)
  }

  const handleRemove = (id: number) => {
    setCurrent(id)
    setModalVisible(true)
  }

  const onRemove = async () => {
    setLoading(true)
    const res = await fetch(`/api/domains/${domain}/${current}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await res.json()
    if (result) {
      setToast({
        text: 'Removed data Successfully.',
        type: 'success',
      })
      handleUpdate('remove', result)
      setModalVisible(false)
    }
    setLoading(false)
  }

  const renderAction = (id: number) => {
    return (
      <>
        <Button auto scale={0.25} onClick={() => handleEdit(id)}>Edit</Button>
        <Spacer w={0.5} />
        <Button auto scale={0.25} onClick={() => handleRemove(id)}>Remove</Button>
        <Spacer w={0.5} />
        <Button auto scale={0.25} onClick={() => router.push(`/${domain}/data/${id}/changelog`)}>History</Button>
      </>
    )
  }

  return (
    <Layout title="Data">
      <FilterTable data={data} filter={['path', 'name', 'value']} buttons={(
        <>
          <PublishModal />
          <Spacer w={0.5} />
          <Button auto type="secondary" icon={<Plus />} onClick={handleNew} scale={2/3}>
            New
          </Button>
        </>
      )}>
        <Table.Column prop="path" label="path" />
        <Table.Column prop="name" label="name" />
        <Table.Column prop="value" label="value" />
        <Table.Column prop="comment" label="comment" />
        <Table.Column prop="id" label="operation" width={250} render={renderAction} />
      </FilterTable>
      <DataDrawer visible={sideVisible} setVisible={setSideVisible} item={current} onUpdate={handleUpdate} />
      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to delete this item?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onRemove}>OK</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Data
