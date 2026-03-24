import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type BreadType = {
  name: string | ReactNode
  path?: string
  back?: boolean
}

export type RouteMeta = {
  auth?: boolean
  hideInMenu?: boolean
  icon?: string
  title?: string
  breadList?: BreadType[]
}

export type AppRouteObject = RouteObject & {
  meta?: RouteMeta
  name?: string
  url?: string
  children?: AppRouteObject[]
}

export type MenuItem = {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}
