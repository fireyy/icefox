import React, { useState } from 'react'
import type { NextPage } from 'next'
import Layout from 'components/layout'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Button, Grid, Table, Drawer, Code } from '@geist-ui/core'
import { formatDate } from 'lib/utils'

const Publishlog: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [publishdata, setPublishdata] = useState([])

  const { data } = useSWR(`/api/publishlog/${domain}`)

  const handleDetail = async (id: number) => {
    setDrawerVisible(true)
    const res = await fetch(`/api/publishdata/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await res.json()
    setPublishdata(result)
  }

  const renderUser = (user: string, rowData: any) => {
    return (
      <>{rowData.user.name}({rowData.user.email})</>
    )
  }

  const renderData = (domain: string, rowData: any) => {
    return (
      <Button auto scale={0.25} onClick={() => handleDetail(rowData.id)}>Detail</Button>
    )
  }

  return (
    <Layout title="Publish Log">
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={24}>
          <Table data={data}>
            <Table.Column prop="id" label="ID" />
            <Table.Column prop="createBy" label="By" render={renderUser} />
            <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
            <Table.Column prop="domain" label="data" render={renderData} />
          </Table>
        </Grid>
      </Grid.Container>
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} placement="right">
        <Drawer.Title>Data</Drawer.Title>
        <Drawer.Subtitle>This is a drawer</Drawer.Subtitle>
        <Drawer.Content>
          <Code block>
          {
            publishdata.map((item: any) => (`${item.path} - ${item.name}:${item.value}`)).join('\n')
          }
          </Code>
        </Drawer.Content>
      </Drawer>
    </Layout>
  )
}

export default Publishlog
