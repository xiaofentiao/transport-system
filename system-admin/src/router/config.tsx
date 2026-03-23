import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import NLoading from "@/components/loading";
import type { AppRouteObject } from '@/type/routes'

// 路由 抽离成为JS对象形式
/**
 * 路由懒加载统一入口：
 * 1) 用 Suspense 包裹页面组件
 * 2) 使用统一 Loading，避免页面抖动与重复实现
 */
export function lazyLoad(Comp: React.LazyExoticComponent<React.ComponentType>) {
	return (
		<Suspense fallback={<NLoading />}>
			<Comp />
		</Suspense>
	)
}

export const subRoutes: AppRouteObject[] = [
	{
		index: true,
		meta: { hideInMenu: true },
		element: lazyLoad(React.lazy(() => import('@/pages/home/index')))
	},
	{
		path: 'form-modal-demo',
		name: 'formModalDemo',
		meta: { title: '表单弹窗演示', icon: 'fa-dashboard' },
		element: lazyLoad(React.lazy(() => import('@/pages/form-modal-demo/index')))
	},
	{
		path: 'settings',
		name: 'settings',
		meta: { title: '系统设置', icon: 'fa-cogs' },
		children: [
			{
				path: 'user',
				name: 'userManage',
				meta: { title: '用户管理' },
				element: lazyLoad(React.lazy(() => import('@/pages/settings/user')))
			},
			{
				path: 'role',
				name: 'roleManage',
				meta: { title: '角色管理' },
				element: lazyLoad(React.lazy(() => import('@/pages/settings/role')))
			},
			{
				path: 'menu',
				name: 'menuManage',
				meta: { title: '菜单管理' },
				element: lazyLoad(React.lazy(() => import('@/pages/settings/menu')))
			}
		]
	},
	{
		path: '/template/listModule',
		name: 'listModule',
		meta: { title: '列表模板', icon: 'fa-first-order' },
		element: lazyLoad(React.lazy(() => import('@/pages/_templates/index')))
	}
]

//全局路由配置表
export const routes: AppRouteObject[] = [
	{
		path: '/',
		name: 'root',
		element: lazyLoad(React.lazy(() => import('@/layout/index'))),
		children: subRoutes
	},
	{
		path: '/login',
		name: 'login',
		meta: { hideInMenu: true },
		element: lazyLoad(React.lazy(() => import('@/pages/login/index')))
	},
	{
		path: '/login/forgot',
		name: 'forgotPassword',
		meta: { hideInMenu: true },
		element: lazyLoad(React.lazy(() => import('@/pages/login/forgot')))
	},
	{
		path: '/login/reset',
		name: 'resetPassword',
		meta: { hideInMenu: true },
		element: lazyLoad(React.lazy(() => import('@/pages/login/reset')))
	},
	{
		path: '*',
		name: 'notFound',
		meta: { hideInMenu: true },
		element: lazyLoad(React.lazy(() => import('@/pages/404')))
	}
]
