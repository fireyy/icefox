import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { Button, Grid, useTheme, Input, Table, useModal, Modal, useToasts, Spacer } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'
import InputFilter from 'components/input-filter'

type FormData = {
  domain: string
}

const Domains: NextPage = () => {
  const theme = useTheme()
  const { visible, setVisible, bindings } = useModal()
  const { visible: modalVisible, setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [domain, setDomain] = useState('')
  const [filterData, setFilterData] = useState([])

  const { data: domains, error, mutate } = useSWR(`/api/domains`)

  useEffect(() => {
    if (domains.domain) {
      setFilterData(domains.domain)
    }
  }, [domains])

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await fetch('/api/domains', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    mutate()
    setToast({
      text: 'Added Domain Successfully',
      type: 'success',
    })
    setVisible(false)
    setLoading(false)
  })

  const handleRemove = (domain: string) => {
    setModalVisible(true)
    setDomain(domain)
  }

  const removeDomain = async () => {
    const res = await fetch(`/api/domains/${domain}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    if (result.name === 'OK') {
      mutate()
      setToast({
        text: 'Removed Domain Successfully'
      })
    } else {
      setToast({
        text: result.message
      })
    }
  }

  const renderLinks = (a: string, rowData: any) => {
    return (
      <>
        <Link href={`/${rowData.domain}/data`}><a>Data</a></Link>
        <Spacer w={0.3} />
        <Link href={`/${rowData.domain}/publishlog`}><a>PublishLog</a></Link>
        <Spacer w={0.3} />
        <Link href={`/${rowData.domain}/privilege`}><a>Privilege</a></Link>
      </>
    )
  }
  const renderAction = (id: number, rowData: any) => {
    return (
      <Button type="secondary" auto scale={1/3} font="12px" onClick={() => handleRemove(rowData.domain)}>Delete</Button>
    )
  }
  const handleFilterChange = (name: string, value: string, callback = () => {}) => {
    if (domains.domain && domains.domain.length > 0) {
      if (value) {
        const filterResult = domains.domain.filter((item: any) => {
          return String(item[name]).toLowerCase().includes(value.toLowerCase())
        })
        setFilterData(filterResult)
      } else {
        setFilterData(domains.domain)
      }
      callback && callback()
    }
  }

  return (
    <Layout title="Domains">
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          <InputFilter name="domain" onChange={handleFilterChange} />
        </Grid>
        <Grid md={12} justify="flex-end">
          <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)} scale={2/3}>
            New
          </Button>
        </Grid>
        <Grid md={24}>
          <Table data={filterData}>
            <Table.Column prop="domain" label="Domain" />
            <Table.Column prop="comment" label="" render={renderLinks} />
            <Table.Column prop="createdAt" label="createdAt" render={(time: string) => (<>{formatDate(time)}</>)} />
            <Table.Column prop="id" label="operation" width={100} render={renderAction} />
          </Table>
        </Grid>
      </Grid.Container>
      <Modal {...bindings}>
        <Modal.Title>Domain</Modal.Title>
        <Modal.Content>
          <form onSubmit={onSubmit}>
            <Input width="100%" {...register('domain')} />
          </form>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onSubmit}>Save</Modal.Action>
      </Modal>
      <Modal {...modalBindings}>
        <Modal.Title>Confirm</Modal.Title>
        <Modal.Content>
          Are you sure you want to delete this item?
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={removeDomain}>OK</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Domains
