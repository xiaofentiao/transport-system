import React, { type ReactElement } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import { useRouteStore } from '@/store/route'
import type { AppRouteObject } from '@/type/routes'

type RoutesViewProps = {
  routes: AppRouteObject[]
}

/**
 * 在 BrowserRouter 子树内调用 useRoutes，避免在父组件内联定义子组件导致重复挂载。
 */
function RoutesView({ routes }: RoutesViewProps): ReactElement | null {
  return useRoutes(routes)
}

/**
 * 路由入口：
 * 1) 统一 BrowserRouter basename（跟随 Vite 的 base 配置）
 * 2) 从 store 读取可访问路由，后续可接入权限路由
 */
function MyRouter(): ReactElement {
  const routes = useRouteStore((s) => s.authRoutes)

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true }}>
      <RoutesView routes={routes} />
    </BrowserRouter>
  )
}

export default React.memo(MyRouter)
