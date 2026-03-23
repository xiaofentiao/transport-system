import { create } from 'zustand'

import { routes } from '@/router/config'
import type { AppRouteObject, MenuItem } from '@/type/routes'

type RouteState = {
  breadCrumbList: any[]
  authMenus: MenuItem[]
  authRoutes: AppRouteObject[]
  setBreadCrumbList: (v: any[]) => void
  setAuthMenus: (v: MenuItem[]) => void
  setAuthRoutes: (v: AppRouteObject[]) => void
}

function joinPath(base: string, path: string) {
  const left = base.endsWith('/') ? base.slice(0, -1) : base
  const right = path.startsWith('/') ? path.slice(1) : path
  if (!left) return `/${right}`
  if (!right) return left
  return `${left}/${right}`
}

/**
 * 从路由配置生成菜单树：
 * 1) 以 meta.hideInMenu 控制是否展示
 * 2) 使用相对路由组合成完整 path
 */
function buildMenusFromRoutes(routeTree: AppRouteObject[]) {
  const root = routeTree.find(r => r.path === '/')
  const children = root?.children ?? []

  const walk = (nodes: AppRouteObject[], basePath: string): MenuItem[] => {
    return nodes
      .filter(n => !n.meta?.hideInMenu)
      .map((n) => {
        const nodePath = n.index ? basePath : joinPath(basePath, String(n.path ?? ''))
        const title = n.meta?.title ?? n.name ?? nodePath
        const childrenMenus = Array.isArray(n.children) && n.children.length
          ? walk(n.children, nodePath)
          : undefined

        return {
          path: nodePath,
          title,
          icon: n.meta?.icon,
          children: childrenMenus
        }
      })
  }

  return walk(children, '/')
}

export const useRouteStore = create<RouteState>((set) => ({
  breadCrumbList: [],
  authMenus: buildMenusFromRoutes(routes),
  authRoutes: routes,
  setBreadCrumbList: (v) => set({ breadCrumbList: v }),
  setAuthMenus: (v) => set({ authMenus: v }),
  setAuthRoutes: (v) => set({ authRoutes: v }),
}))
