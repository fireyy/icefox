import React from 'react'
import { Drawer, DrawerProps, Table } from '@geist-ui/core'
import { PublishdataItems } from 'lib/interfaces'
import useSWR from 'swr'

type Props = {
  pid: number
} & DrawerProps

const PublishdataDrawer: React.FC<Props> = ({ pid, ...props }) => {
  const { data = [] } = useSWR<PublishdataItems>(pid !== 0 && `/api/publishdata/${pid}`)

  return (
    <Drawer {...props} placement="right">
      <Drawer.Title>Published Data</Drawer.Title>
      <Drawer.Content>
        <Table width={30} data={data}>
          <Table.Column prop="path" label="path" />
          <Table.Column prop="name" label="name" />
          <Table.Column prop="value" label="value" />
        </Table>
      </Drawer.Content>
    </Drawer>
  )
}

export default PublishdataDrawer
