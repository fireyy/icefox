import React, { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Modal, useModal, Button, useToasts, Select, Text } from '@geist-ui/core'
import UploadCloud from '@geist-ui/icons/uploadCloud'

type Props = {

}

const PublishModal: React.FC<Props> = ({}) => {
  const router = useRouter()
  const domain = router.query.domain
  const [loading, setLoading] = useState(false)
  const [publishPaths, setPublishPaths] = useState<string[]>([])
  const { setVisible: setPublishModalVisible, bindings: publishBindings } = useModal()
  const { setToast } = useToasts()

  const { data: squashList } = useSWR(domain && `/api/squash/${domain}`)

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
    const res = await fetch(`/api/publish/${domain}`, {
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
    <>
      <Button auto type="success" icon={<UploadCloud />} onClick={handlePublish} scale={2/3}>
        Publish
      </Button>
      <Modal {...publishBindings}>
        <Modal.Title>Confirm to Publish</Modal.Title>
        <Modal.Content>
          {
            squashList && squashList.length > 0 && (
              <Select placeholder="Paths" multiple width="100%" value={publishPaths} onChange={handlePublishSelect}>
                {
                  squashList.map((item: any) => (
                    <Select.Option key={item.path} value={item.path}>{item.path}</Select.Option>
                  ))
                }
              </Select>
            )
          }
          {
            (!squashList || squashList.length === 0) && (
              <Text>No paths to publish</Text>
            )
          }
        </Modal.Content>
        <Modal.Action passive onClick={() => setPublishModalVisible(false)}>Cancel</Modal.Action>
        <Modal.Action loading={loading} onClick={onPublish}>Publish</Modal.Action>
      </Modal>
    </>
  )
}

export default PublishModal
