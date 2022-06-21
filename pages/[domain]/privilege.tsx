import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Table, useModal, Modal, useToasts } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'
import FilterTable from 'components/filter-table'
import dynamic from 'next/dynamic'
import Skeleton from 'components/skeleton'

const GiveUserModal= dynamic(() => import('../../components/give-user-modal'), {
  ssr: false,
  loading: () => <Skeleton width={95} height={32} />
})

const Privilege: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const [id, setId] = useState<number>()

  const { data: privilege, error, mutate } = useSWR(domain && `/api/privilege/${domain}`)

  const handleRemove = async (val: number) => {
    setModalVisible(true)
    setId(val)
  }

  const onRemove = async () => {
    setLoading(true)
    const res = await fetch(`/api/privilege/${domain}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    if (result.id) {
      setModalVisible(false)
      mutate()
      setToast({
        text: 'Removed privilege Successfully',
        type: 'success'
      })
    }
    setLoading(false)
  }

  const renderUser = (user: string, rowData: any) => {
    return (
      <>{rowData.user.name}({rowData.user.email})</>
    )
  }
  const renderAction = (id: number, rowData: any) => {
    return (
      <Button auto scale={0.25} onClick={() => handleRemove(id)}>Remove</Button>
    )
  }

  return (
    <Layout title="Privilege">
      <FilterTable data={privilege} filter={['user.name']} buttons={(
        <GiveUserModal onUpdate={(type: string) => mutate()} />
      )}>
        <Table.Column prop="userId" label="name" render={renderUser} />
        <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
        <Table.Column prop="id" label="operation" width={100} render={renderAction} />
      </FilterTable>
      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to remove this item?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onRemove}>OK</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Privilege
