import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, useModal, Modal, useToasts, Input } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'

type Props = {
  onUpdate: (type: string, payload?: any) => void
}

type FormData = {
  domain: string
}

const NewDomainModal: React.FC<Props> = ({ onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const { setToast } = useToasts()
  const { visible, setVisible, bindings } = useModal()
  const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await fetch('/api/domains', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    onUpdate && onUpdate('new')
    setToast({
      text: 'Added Domain Successfully',
      type: 'success',
    })
    setVisible(false)
    setLoading(false)
    reset()
  })
  return (
    <>
      <Button auto type="secondary" icon={<Plus />} onClick={() => setVisible(true)} scale={2/3}>
        New
      </Button>
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
    </>
  )
}

export default NewDomainModal
