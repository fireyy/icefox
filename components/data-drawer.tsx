import React, { useEffect, useState } from 'react'
import { Drawer, Text, Textarea, Grid, useToasts, Input, Toggle, Button, Select, Slider } from '@geist-ui/core'
import { DataItem } from 'lib/interfaces'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { dataKeyType } from 'lib/contants'

type Props = {
  action?: string,
  visible: boolean,
  setVisible: (state: boolean) => void,
  item?: DataItem,
  onUpdate: (type: string, payload?: any) => void
}

type FormData = {
  name: string
  path: string
  type: number
  value: string
  comment: string
}

const PackageDetail: React.FC<Props> = ({ action = 'new', visible, setVisible, item, onUpdate }) => {
  const { register, setValue, getValues, handleSubmit, reset: resetData, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const [valueType, setValueType] = useState(1)
  const router = useRouter()
  const isEdit = action === 'edit'
  const { setToast } = useToasts()
  const domain = router.query.domain

  const handleTypeChange = (val: string | string[]) => {
    const type = Number(val)
    setValue('type', type)
    setValue('value', '')
    setValueType(type)
  }

  const renderValueContent = () => {
    switch (valueType) {
      case 1:
        return <Input placeholder="Text" width="100%" {...register('value')} />
      case 2:
      case 9:
        return <Textarea placeholder="Text" width="100%" {...register('value')} />
      case 3:
        return <Input placeholder="Number" htmlType="number" {...register('value')} />
      case 4:
        const val = getValues('value')
        return <Toggle checked={val === '' || val === 'false' ? false : true} onChange={(e) => setValue('value', `${e.target.checked}`)} />
      case 5:
        return <Input placeholder="Number" max={100} min={0} htmlType="number" {...register('value')} />
      case 6:
        return <Input htmlType="date" {...register('value')} />
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    if (data.type === 4 && data.value === '') {
      data.value = 'false'
    }
    setLoading(true)
    let url = isEdit ? `/${item?.id}` : ''
    const res = await fetch(`/api/${domain}/data` + url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.id) {
      setToast({
        text: 'Added new data Successfully.',
        type: 'success',
      })
      setVisible(false)
      onUpdate('add')
      resetData()
      setValueType(1)
    } else {
      setToast({
        text: 'Failed to add new data.',
        type: 'error',
      })
    }
    setLoading(false)
  })

  return (
    <>
      <Drawer visible={visible} onClose={() => setVisible(false)} placement="right">
        <Drawer.Subtitle>Add new key to {domain}</Drawer.Subtitle>
        <Drawer.Content>
          <form className="data-drawer" onSubmit={onSubmit}>
            <Grid.Container gap={2} justify="center">
              <Grid xs={24} direction="column">
                <Text h6>Path</Text>
                <Input placeholder="Text" width="100%" {...register('path')} />
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Name</Text>
                <Input placeholder="Text" width="100%" {...register('name')} />
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Type</Text>
                <Select placeholder="Choose one" value={`${getValues('type') || '1'}`} onChange={handleTypeChange}>
                  {
                    dataKeyType.map((item, index) => (
                      <Select.Option key={item.text} value={`${item.value}`}>{item.text}</Select.Option>
                    ))
                  }
                </Select>
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Value</Text>
                {renderValueContent()}
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Comment</Text>
                <Input placeholder="Text" width="100%" {...register('comment')} />
              </Grid>
              <Grid justify="flex-end">
                <Button type="secondary" htmlType="submit" loading={loading}>Save</Button>
              </Grid>
            </Grid.Container>
          </form>
        </Drawer.Content>
      </Drawer>
      <style jsx>{`
        .data-drawer {
          width: 350px;
        }
      `}</style>
    </>
  )
}

export default PackageDetail
