import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, Table, useToasts, Text } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'
import { useSession } from 'next-auth/react'
import FilterTable from 'components/filter-table'
import { Users, User, TableColumnRender } from 'lib/interfaces'

const Users: NextPage = () => {
  const { data: session } = useSession()
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)

  const { data: users, error, mutate } = useSWR<Users>(`/api/users`)

  const editUser = async (id: number, role: string) => {
    setLoading(true)
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role
      }),
    })
    const result = await res.json()
    if (result) {
      mutate()
      setToast({
        text: 'Updated user Successfully'
      })
    }
    setLoading(false)
  }

  const renderAction: TableColumnRender<User> = (id, rowData) => {
    const role = rowData.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (Number(session?.user?.id) === id) return <Text span>It&apos;s you</Text>

    return (
      <Button type="secondary" auto scale={1/3} font="12px" onClick={() => editUser(Number(id), role)} loading={loading}>Set As `{role}`</Button>
    )
  }

  return (
    <Layout title="Domains">
      <FilterTable data={users} filter={['name']}>
        <Table.Column prop="name" label="name" />
        <Table.Column prop="email" label="email" />
        <Table.Column prop="role" label="role" />
        <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
        <Table.Column prop="id" label="operation" width={100} render={renderAction} />
      </FilterTable>
    </Layout>
  )
}

export default Users
