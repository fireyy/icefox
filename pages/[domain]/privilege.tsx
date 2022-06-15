import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid, useTheme, AutoComplete, Table, useModal, Modal, useToasts } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import Plus from '@geist-ui/icons/plus'
import { formatDate } from 'lib/utils'
import InputFilter from 'components/input-filter'
import { User } from 'lib/interfaces'

const Privilege: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const { visible, setVisible, bindings } = useModal()
  const [id, setId] = useState<number>()
  const [filterData, setFilterData] = useState([])
  const [users, setUsers] = useState<JSX.Element[]>([])

  const { data: privilege, error, mutate } = useSWR(`/api/privilege/${domain}`)
  const { data: allUsers } = useSWR<User[]>(`/api/users`)

  useEffect(() => {
    if (privilege && privilege.length > 0) {
      setFilterData(privilege)
    }
  }, [privilege])

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
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
        text: 'Removed privilege Successfully'
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
  const handleFilterChange = (name: string, value: string, callback = () => {}) => {
    if (privilege && privilege.length > 0) {
      if (value) {
        const filterResult = privilege.filter((item: any) => {
          return String(item[name]).toLowerCase().includes(value.toLowerCase())
        })
        setFilterData(filterResult)
      } else {
        setFilterData(privilege)
      }
      callback && callback()
    }
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
      <AutoComplete.Option value={`${user.id}`} key={user.id}>
        {user.name}({user.email})
      </AutoComplete.Option>
    ))
  }
  return (
    <Layout title="Privilege">
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          <InputFilter name="user" onChange={handleFilterChange} />
        </Grid>
        <Grid md={12} justify="flex-end">
          <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)} scale={2/3}>
            New
          </Button>
        </Grid>
        <Grid md={24}>
          <Table data={filterData}>
            <Table.Column prop="userId" label="name" render={renderUser} />
            <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
            <Table.Column prop="id" label="operation" width={100} render={renderAction} />
          </Table>
        </Grid>
      </Grid.Container>
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
            clearable
            searching={loading}
            options={users}
            placeholder="Enter user name here"
            onSearch={searchHandler}
            onChange={(val: string) => setId(Number(val))}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onSubmit}>Save</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Privilege
