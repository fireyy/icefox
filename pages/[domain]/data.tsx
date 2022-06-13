import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, useTheme, Input, useInput, Table, useModal, Modal, useToasts, Spacer } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import UploadCloud from '@geist-ui/icons/uploadCloud'
import Layout from 'components/layout'
import { useRouter } from 'next/router'
import DataDrawer from 'components/data-drawer'
import useSWR from 'swr'
import { DataItem, DataItems } from 'lib/interfaces'

const Data: NextPage = () => {
  const router = useRouter()
  const [sideVisible, setSideVisible] = useState(false)
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)

  const { data, error, mutate } = useSWR(`/api/${router.query.domain}/data`)

  const handleUpdate = (type: string, data: any) => {
    if (type === 'add') {
      mutate()
    } else if (type === 'update') {
      mutate((mate: DataItems) => {
        const index = mate.findIndex((item: DataItem) => item.id === data.id)
        mate[index] = data
        return mate
      })
    } else if (type === 'remove') {
      mutate(data.filter((item: DataItem) => item.id !== current))
    }
  }

  const handleEdit = (id: number) => {
    setCurrent(id)
    setSideVisible(true)
  }

  const renderAction = (id: number) => {
    return (
      <>
        <Button auto scale={0.25} onClick={() => handleEdit(id)}>Edit</Button>
        <Spacer w={0.5} />
        <Button auto scale={0.25}>Remove</Button>
        <Spacer w={0.5} />
        <Button auto scale={0.25}>History</Button>
      </>
    )
  }

  return (
    <Layout title="Data">
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          <Input placeholder='path filter' />
          <Spacer w={0.5} />
          <Input placeholder='name filter' />
          <Spacer w={0.5} />
          <Input placeholder='value filter' />
        </Grid>
        <Grid md={12} justify="flex-end">
          <Button auto type="success" icon={<UploadCloud />} scale={2/3}>
            Publish
          </Button>
          <Spacer w={0.5} />
          <Button auto type="secondary" icon={<Plus />} onClick={() => setSideVisible(true)} scale={2/3}>
            New
          </Button>
        </Grid>
        <Grid md={24}>
          <Table data={data}>
            <Table.Column prop="path" label="path" />
            <Table.Column prop="name" label="name" />
            <Table.Column prop="value" label="value" />
            <Table.Column prop="comment" label="comment" />
            <Table.Column prop="id" label="operation" width={250} render={renderAction} />
          </Table>
        </Grid>
      </Grid.Container>
      <DataDrawer visible={sideVisible} setVisible={setSideVisible} item={current} onUpdate={handleUpdate} />
    </Layout>
  )
}

export default Data
