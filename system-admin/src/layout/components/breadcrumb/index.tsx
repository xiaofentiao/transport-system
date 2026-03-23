import { Breadcrumb } from 'antd'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useRouteStore } from '@/store/route'
import type { MenuItem } from '@/type/routes'

function findMenuChain(menus: MenuItem[], pathname: string): MenuItem[] {
  for (const m of menus) {
    if (m.path === pathname) return [m]
    if (Array.isArray(m.children) && m.children.length) {
      const childChain = findMenuChain(m.children, pathname)
      if (childChain.length) return [m, ...childChain]
    }
  }
  return []
}

function CustomBreadcrumb() {
  const location = useLocation()
  const menus = useRouteStore((s) => s.authMenus)
  const pathname = location.pathname

  const breadcrumbItems = useMemo(() => {
    const chain = findMenuChain(menus, pathname)
    return chain.map((m) => ({ title: m.title }))
  }, [menus, pathname])

  return <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
}

export default CustomBreadcrumb
