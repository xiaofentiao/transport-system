import type { ReactElement, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { ConfigProvider, Layout, Menu, type MenuProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { SvgIcon } from '@/components/svgIcon'
import { useAppStore } from '@/store/app'
import { useRouteStore } from '@/store/route'
import type { MenuItem as AppMenuItem } from '@/type/routes'

import './index.less'

const { Sider } = Layout

type AntMenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: ReactNode,
  key: React.Key,
  icon?: ReactNode,
  children?: AntMenuItem[],
  type?: 'group',
): AntMenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as AntMenuItem
}

function navTo(path: string, title: string) {
  return <Link to={path}>{title}</Link>
}

/** 侧栏导航：由路由 store 生成菜单并同步当前路径 */
export default function SideBar(): ReactElement {
  const { collapsed: isColl, activeId: activeIdName, setActiveId } = useAppStore(
    useShallow((s) => ({
      collapsed: s.collapsed,
      activeId: s.activeId,
      setActiveId: s.setActiveId,
    })),
  )
  const location = useLocation()
  const menuList = useRouteStore((s) => s.authMenus)

  const userMenus: MenuProps['items'] = useMemo(() => {
    const walk = (nodes: AppMenuItem[]): AntMenuItem[] => {
      return nodes.map((n) => {
        const children = Array.isArray(n.children) && n.children.length
          ? walk(n.children)
          : undefined

        return getItem(
          navTo(n.path, n.title),
          n.path,
          n.icon ? <SvgIcon iconClass={n.icon} /> : undefined,
          children
        )
      })
    }

    return Array.isArray(menuList) ? walk(menuList) : []
  }, [menuList])

  useEffect(() => {
    setActiveId(location.pathname)
  }, [location.pathname, setActiveId])

  return (
    <Sider trigger={null} collapsible collapsed={isColl} className="side-bar" width={200}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: 'rgba(0, 0, 0, 0.85)',
              itemSelectedColor: '#14b8a6',
              itemHoverColor: 'rgba(0, 0, 0, 0.95)',
              // 父级 submenu 在子项选中时不用 primary 蓝
              subMenuItemSelectedColor: 'rgba(0, 0, 0, 0.95)',
            },
          },
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeIdName]}
          items={userMenus}
          className="side-bar-menu"
        />
      </ConfigProvider>
    </Sider>
  )
}
