import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid, useTheme, AutoComplete, Table, useModal, Modal, useToasts, User as UserItem } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import Plus from '@geist-ui/icons/plus'
import { formatDate } from 'lib/utils'
import { User } from 'lib/interfaces'
import FilterTable from 'components/filter-table'

const Privilege: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const { visible, setVisible, bindings } = useModal()
  const [id, setId] = useState<number>()
  const [users, setUsers] = useState<JSX.Element[]>([])

  const { data: privilege, error, mutate } = useSWR(domain && `/api/privilege/${domain}`)
  const { data: allUsers } = useSWR<User[]>(`/api/users`)

  useEffect(() => {
    if (allUsers) {
      setUsers(makeOptions(allUsers))
    }
  }, [allUsers])

  const handleRemove = async (val: number) => {
    setModalVisible(true)
    setId(val)
  }

  const onSubmit = async () => {
    setLoading(true)
    const res = await fetch(`/api/privilege/${domain}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: id
      }),
    })
    const result = await res.json()
    if (result.id) {
      setVisible(false)
      setToast({
        text: 'Added privilege Successfully.',
        type: 'success',
      })
      setLoading(false)
      mutate()
    }
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
  const searchHandler = async (val: string) => {
    if (!val) return setUsers(makeOptions(allUsers || []))
    setLoading(true)
    const res = await fetch(`/api/users?s=${val}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    setUsers(makeOptions(result))
    setLoading(false)
  }
  const makeOptions = (users: User[]) => {
    return users.map(user => (
      <AutoComplete.Option value={`${user.name}`} key={user.id}>
        <UserItem src={user.image} name={user.name} py={0.5}>
          {user.email}
        </UserItem>
      </AutoComplete.Option>
    ))
  }
  const handleAutoChange = (val: string) => {
    const user = (allUsers || []).find(user => user.name === val)
    setId(user?.id)
  }
  return (
    <Layout title="Privilege">
      <FilterTable data={privilege} filter={['user.name']} buttons={(
        <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)} scale={2/3}>
          New
        </Button>
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
      <Modal {...bindings}>
        <Modal.Title>User Name</Modal.Title>
        <Modal.Content>
          <AutoComplete
            width="100%"
            clearable
            searching={loading}
            options={users}
            placeholder="Enter user name here"
            onSearch={searchHandler}
            onChange={handleAutoChange}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onSubmit}>Save</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Privilege
