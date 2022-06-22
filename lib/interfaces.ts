import type { User as USER, Key, Domain, changelog, privilege, publishlog, publishdata } from '@prisma/client'

export type Seed = {
  name: string
  comment: string
  value: string
  group?: string
}

export type Seeds = Array<Seed>

export type User = USER

export type DataItem = Key & {
  user?: User
}

export type DataItems = Array<DataItem>

export type SquashItem = {
  path: string
  value: any
  updatedAt: string
  publishAt: string
}

export type SquashItems = Array<SquashItem>

export type DomainItem = Domain & {
  user?: User
}

export type DomainItems = Array<DomainItem>

export type DomainData = {
  scope: string
  domain: DomainItems
}

export type ChangelogItem = changelog & {
  user?: User
}

export type ChangelogItems = Array<ChangelogItem>

export type ChangelogData = {
  page: string
  pageCount: number
  total: number
  data: ChangelogItems
}

export type TableColumnRender<T extends Record<string, any>> = (
  value: T[keyof T],
  rowData: T,
  rowIndex: number,
) => JSX.Element | void

export type PrivilegeItem = privilege & {
  user?: User
}

export type PrivilegeItems = Array<PrivilegeItem>

export type PublishlogItem = publishlog & {
  user?: User
}

export type PublishlogItems = Array<PublishlogItem>

export type PublishdataItem = publishdata
export type PublishdataItems = Array<PublishdataItem>
