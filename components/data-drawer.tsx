import React, { useEffect, useState } from 'react'
import { Drawer, Text, Textarea, Grid, useToasts, Input, Toggle, Button, Select, Slider } from '@geist-ui/core'
import { DataItem } from 'lib/interfaces'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { dataKeyType } from 'lib/contants'
import useSWR from 'swr'

type Props = {
  visible: boolean,
  setVisible: (state: boolean) => void,
  item: number,
  onUpdate: (type: string, payload?: any) => void
}

type FormData = {
  name: string
  path: string
  type: number
  value: string
  comment: string
}

type InputTypes = {
  type: 'default' | 'secondary' | 'success' | 'warning' | 'error'
}

const PackageDetail: React.FC<Props> = ({ visible, setVisible, item, onUpdate }) => {
  const { register, setValue, getValues, handleSubmit, watch, reset: resetData, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isEdit = item ? true : false
  const { setToast } = useToasts()
  const domain = router.query.domain
  const watchType = watch('type', 1)
  const watchValue = watch('value')
  const registerValue = {
    ...{
      type: errors.value?.type === 'required' ? 'error': 'default',
    } as InputTypes,
    ...register('value', {
      required: true,
    })
  }

  const { data, error, mutate } = useSWR(item !== 0 && `/api/domains/${domain}/${item}`)

  useEffect(() => {
    if (data) {
      setValue('name', data.name)
      setValue('path', data.path)
      setValue('type', data.type)
      setValue('value', data.value)
      setValue('comment', data.comment)
    }
  }, [data])

  const handleTypeChange = (val: string | string[]) => {
    const type = Number(val)
    setValue('type', type)
    setValue('value', '')
  }

  const onSubmit = handleSubmit(async (data) => {
    if (data.type === 4 && data.value === '') {
      data.value = 'false'
    }
    setLoading(true)
    let url = isEdit ? `/api/domains/${domain}/${item}` : `/api/domains/${domain}`
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? {
        value: data.value,
        comment: data.comment,
      } : data),
    })
    const result = await res.json()
    if (result.id) {
      handleDrawerClose()
      setToast({
        text: isEdit ? 'Updated data Successfully.' : 'Added new data Successfully.',
        type: 'success',
      })
      onUpdate(isEdit ? 'update' : 'add', result)
    } else {
      setToast({
        text: 'Failed to add new data.',
        type: 'error',
      })
    }
    setLoading(false)
  })

  const handleDrawerClose = () => {
    setVisible(false)
    resetData()
  }

  return (
    <>
      <Drawer visible={visible} onClose={handleDrawerClose} placement="right">
        <Drawer.Subtitle>Add new key to {domain}</Drawer.Subtitle>
        <Drawer.Content>
          <form className="data-drawer" onSubmit={onSubmit}>
            <Grid.Container gap={2} justify="center">
              <Grid xs={24} direction="column">
                <Text h6>Path <Text span type="error">{errors.path?.message}</Text></Text>
                <Input type={errors.path?.type ? 'error': 'default'} placeholder="Text" width="100%"
                  {...register('path', {
                    required: 'Path is required',
                    pattern: {
                      value: /^\/([A-z0-9-_+]+\/)*([A-z0-9]+)$/,
                      message: 'Path muse start with /'
                    }
                  })} readOnly={isEdit} disabled={isEdit} />
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Name <Text span type="error">{errors.name?.type === 'required' && 'is required'}</Text></Text>
                <Input type={errors.name?.type === 'required' ? 'error': 'default'} placeholder="Text" width="100%" {...register('name', { required: true })} readOnly={isEdit} disabled={isEdit} />
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Type</Text>
                <Select disabled={isEdit} placeholder="Choose one" value={`${watchType}`} onChange={handleTypeChange}>
                  {
                    dataKeyType.map((item, index) => (
                      <Select.Option key={item.text} value={`${item.value}`}>{item.text}</Select.Option>
                    ))
                  }
                </Select>
              </Grid>
              <Grid xs={24} direction="column">
                <Text h6>Value <Text span type="error">{errors.value?.type === 'required' && 'is required'}</Text></Text>
                {
                  watchType === 1 && <Input placeholder="Text" width="100%" {...registerValue} />
                }
                {
                  (watchType === 2 || watchType === 9) && <Textarea placeholder="Text" width="100%" {...registerValue} />
                }
                {
                  watchType === 3 && <Input placeholder="Number" htmlType="number" {...registerValue} />
                }
                {
                  watchType === 4 && <Toggle checked={watchValue === '' || watchValue === 'false' ? false : true} onChange={(e) => setValue('value', `${e.target.checked}`)} />
                }
                {
                  watchType === 5 && <Input placeholder="Number" max={100} min={0} htmlType="number" {...registerValue} />
                }
                {
                  watchType === 6 && <Input htmlType="date" {...registerValue} />
                }
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
          overflow: auto;
        }
      `}</style>
    </>
  )
}

export default PackageDetail
