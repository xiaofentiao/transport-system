import React from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import { useRouteStore } from '@/store/route'

/**
 * 路由入口：
 * 1) 统一 BrowserRouter basename（跟随 Vite 的 base 配置）
 * 2) 从 store 读取可访问路由，后续可接入权限路由
 */
function MyRouter() {
  const routes = useRouteStore((s) => s.authRoutes)

  const RoutesView = () => {
    return useRoutes(routes)
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true }}>
      <RoutesView />
    </BrowserRouter>
  )
}

export default React.memo(MyRouter)
