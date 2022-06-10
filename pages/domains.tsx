import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, useTheme, Input, useInput, Table, useModal, Modal, useToasts } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import useTranslation from 'next-translate/useTranslation'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { formatDate } from 'lib/utils'

type FormData = {
  domain: string
}

const Domains: NextPage = () => {
  const theme = useTheme()
  const { t } = useTranslation('common')
  const { visible, setVisible, bindings } = useModal()
  const { state, setState, bindings:inputBindings } = useInput('')
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)

  const { data: domains, error, mutate } = useSWR(`/api/domains`)

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await fetch('/api/domains', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    mutate()
    setToast({
      text: t('Added Successfully', {
        msg: t('Domain')
      }),
      type: 'success',
    })
    setVisible(false)
    setLoading(false)
  })

  const removeDomain = async (domain: string) => {
    const res = await fetch(`/api/${domain}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await res.json()
    if (result.name === 'OK') {
      mutate()
      setToast({
        text: t('Removed Successfully', {
          msg: t('Domain')
        })
      })
    } else {
      setToast({
        text: t(result.message)
      })
    }
  }

  const renderLinks = () => {
    return (
      <a>123</a>
    )
  }
  const renderAction = (id: number, rowData: any) => {
    return (
      <Button type="secondary" auto scale={1/3} font="12px" onClick={() => removeDomain(rowData.domain)}>{t('Delete')}</Button>
    )
  }

  return (
    <Layout title={t('Domains')}>
      <Grid.Container gap={2} justify="flex-start">
        <Grid md={12}>
          <Input placeholder='domain filter' />
        </Grid>
        <Grid md={12} justify="flex-end">
          <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)}>
            {t('New')}
          </Button>
        </Grid>
        <Grid md={24}>
          <Table data={domains}>
            <Table.Column prop="domain" label={t('Domain')} />
            <Table.Column prop="comment" label="" render={renderLinks} />
            <Table.Column prop="createdAt" label={t('createdAt')} render={(time: string) => (<>{formatDate(time)}</>)} />
            <Table.Column prop="id" label={t('operation')} width={100} render={renderAction} />
          </Table>
        </Grid>
      </Grid.Container>
      <Modal {...bindings}>
        <Modal.Title>{t('Domain')}</Modal.Title>
        <Modal.Content>
          <form onSubmit={onSubmit}>
            <Input width="100%" {...register('domain')} />
          </form>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>{t('Cancel')}</Modal.Action>
        <Modal.Action loading={loading} onClick={onSubmit}>{t('Save')}</Modal.Action>
      </Modal>
    </Layout>
  )
}

export default Domains
