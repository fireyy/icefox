import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Grid, useTheme, Input, useInput, Table, useModal, Modal, useToasts } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import useTranslation from 'next-translate/useTranslation'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

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
      text: t('Added Successfully.', {
        msg: t('Domain')
      }),
      type: 'success',
    })
    setVisible(false)
    setLoading(false)
  })

  const renderLinks = () => {
    return (
      <a>123</a>
    )
  }
  const renderAction = () => {
    return (
      <Button type="error" auto scale={1/3} font="12px">Remove</Button>
    )
  }

  return (
    <Layout title={t('Domains')}>
      <Grid.Container gap={2} marginTop={1} justify="flex-start">
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
            <Table.Column prop="domain" label="domain" />
            <Table.Column prop="comment" label="Links" render={renderLinks} />
            <Table.Column prop="createdAt" label="time" />
            <Table.Column prop="id" label="operation" width={150} render={renderAction} />
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
