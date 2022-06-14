import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, useTheme, Input, useInput, Table, useModal, Modal, useToasts, Spacer, Select } from '@geist-ui/core'
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
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const { setVisible: setPublishModalVisible, bindings: publishBindings } = useModal()
  const [publishPaths, setPublishPaths] = useState<string[]>([])
  const domain = router.query.domain

  const { data, error, mutate } = useSWR(`/api/${domain}/data`)
  const { data: squashList } = useSWR(`/api/${domain}/squash`)

  const handleUpdate = (type: string, payload: any) => {
    if (type === 'add') {
      mutate()
    } else if (type === 'update') {
      mutate((mate: DataItems) => {
        const index = mate.findIndex((item: DataItem) => item.id === payload.id)
        mate[index] = payload
        return mate
      })
    } else if (type === 'remove') {
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
    const res = await fetch(`/api/data/${current}`, {
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

  const handlePublishSelect = (p: string | string[]) => {
    const paths = Array.isArray(p) ? p : [p]
    setPublishPaths(paths)
  }

  const handlePublish = async () => {
    setPublishPaths(squashList.map((t: any) => t.path))
    setPublishModalVisible(true)
  }

  const onPublish = async () => {
    setLoading(true)
    const res = await fetch(`/api/${domain}/publish`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishPaths),
    })
    if (res) {
      setToast({
        text: 'Publish data Successfully.',
        type: 'success',
      })
      setPublishModalVisible(false)
    }
    setLoading(false)
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
          <Button auto type="success" icon={<UploadCloud />} onClick={handlePublish} scale={2/3}>
            Publish
          </Button>
          <Spacer w={0.5} />
          <Button auto type="secondary" icon={<Plus />} onClick={handleNew} scale={2/3}>
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
      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to delete this item?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onRemove}>OK</Modal.Action>
      </Modal>
      <Modal {...publishBindings}>
        <Modal.Title>Confirm to Publish</Modal.Title>
        <Modal.Content>
          {
            squashList && (
              <Select placeholder="Paths" multiple width="100%" value={publishPaths} onChange={handlePublishSelect}>
                {
                  squashList.map((item: any) => (
                    <Select.Option key={item.path} value={item.path}>{item.path}</Select.Option>
                  ))
                }
              </Select>
            )
          }
        </Modal.Content>
        <Modal.Action passive onClick={() => setPublishModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onPublish}>Publish</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Data
