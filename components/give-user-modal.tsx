import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Button, AutoComplete, useModal, Modal, useToasts, User as UserItem } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import { User } from 'lib/interfaces'

type Props = {
  onUpdate: (type: string, payload?: any) => void
}

const GiveUserModal: React.FC<Props> = ({ onUpdate }) => {
  const router = useRouter()
  const domain = router.query.domain
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { visible, setVisible, bindings } = useModal()
  const [users, setUsers] = useState<JSX.Element[]>([])
  const [id, setId] = useState<number>()

  const { data: allUsers } = useSWR<User[]>(`/api/users`)

  useEffect(() => {
    if (allUsers) {
      setUsers(makeOptions(allUsers))
    }
  }, [allUsers])

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
      onUpdate && onUpdate('new')
    }
  }
  return (
    <>
      <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)} scale={2/3}>
        New
      </Button>
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
    </>
  )
}

export default GiveUserModal
