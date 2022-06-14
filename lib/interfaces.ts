export type Seed = {
  name: string
  comment: string
  value: string
  group?: string
}

export type Seeds = Array<Seed>

export type User = {
  id: number
  name: string
  email: string
  image?: string
}

export type DataItem = {
  id: number
  domain: string
  path: string
  name: string
  comment: string
  value: string
  type: number
  isDelete: number
  createdAt: string
  updatedAt: string
  publishAt: string
  user?: User
  createBy: Number
}

export type DataItems = Array<DataItem>

export type SquashItem = {
  path: string
  value: any
  updatedAt: string
  publishAt: string
}

export type SquashItems = Array<SquashItem>
