import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, Table, useToasts, Text } from '@geist-ui/core'
import Layout from 'components/layout'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'
import InputFilter from 'components/input-filter'
import { useSession } from 'next-auth/react'

const Users: NextPage = () => {
  const { data: session } = useSession()
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [filterData, setFilterData] = useState([])

  const { data: users, error, mutate } = useSWR(`/api/users`)

  useEffect(() => {
    if (users) {
      setFilterData(users)
    }
  }, [users])

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

  const renderAction = (id: number, rowData: any) => {
    const role = rowData.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (Number(session?.user?.id) === id) return <Text span>It&apos;s you</Text>

    return (
      <Button type="secondary" auto scale={1/3} font="12px" onClick={() => editUser(id, role)} loading={loading}>Set As `{role}`</Button>
    )
  }
  const handleFilterChange = (name: string, value: string, callback = () => {}) => {
    if (users && users.length > 0) {
      if (value) {
        const filterResult = users.domain.filter((item: any) => {
          return String(item[name]).toLowerCase().includes(value.toLowerCase())
        })
        setFilterData(filterResult)
      } else {
        setFilterData(users)
      }
      callback && callback()
    }
  }

  return (
    <Layout title="Domains">
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          <InputFilter name="name" onChange={handleFilterChange} />
        </Grid>
        <Grid md={24}>
          <Table data={filterData}>
            <Table.Column prop="name" label="name" />
            <Table.Column prop="email" label="email" />
            <Table.Column prop="role" label="role" />
            <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
            <Table.Column prop="id" label="operation" width={100} render={renderAction} />
          </Table>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export default Users
