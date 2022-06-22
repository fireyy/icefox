import React, { useState } from 'react'
import type { NextPage } from 'next'
import Layout from 'components/layout'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Button, Grid, Table } from '@geist-ui/core'
import { formatDate } from 'lib/utils'
import dynamic from 'next/dynamic'
import { TableColumnRender, PublishlogItem, PublishlogItems } from 'lib/interfaces'

const PublishdataDrawer = dynamic(() => import('components/publishdata-drawer'), {
  ssr: false
})

const Publishlog: NextPage = () => {
  const router = useRouter()
  const domain = router.query.domain
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [publishdata, setPublishdata] = useState<number>(0)

  const { data = [] } = useSWR<PublishlogItems>(domain && `/api/publishlog/${domain}`)

  const handleDetail = async (id: number) => {
    setDrawerVisible(true)
    setPublishdata(id)
  }

  const renderUser: TableColumnRender<PublishlogItem> = (user, rowData) => {
    return (
      <>{rowData?.user?.name}({rowData?.user?.email})</>
    )
  }

  const renderData: TableColumnRender<PublishlogItem> = (domain, rowData) => {
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
      <PublishdataDrawer pid={publishdata} visible={drawerVisible} onClose={() => setDrawerVisible(false)} placement="right" />
    </Layout>
  )
}

export default Publishlog
