import { useCallback, type ReactElement } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Space } from 'antd'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/store/app'

import Avatar from './components/avatar'
import CustomBreadcrumb from '../breadcrumb'

import './index.less'

const { Header } = Layout

/** 顶栏：标题、侧栏折叠、面包屑与用户信息 */
export default function AppHeader(): ReactElement {
  const { collapsed: isColl, setCollapsed: setColl } = useAppStore(
    useShallow((s) => ({ collapsed: s.collapsed, setCollapsed: s.setCollapsed })),
  )

  const toggle = useCallback(() => {
    setColl(!isColl)
  }, [isColl, setColl])

  const TriggerIcon = isColl ? MenuUnfoldOutlined : MenuFoldOutlined

  return (
    <Header className="site-layout-background t-header flex row-sp col-c">
      <div className="flex row-s col-c">
        <div className="mgr10 fw-b">模板管理</div>
        <TriggerIcon className="trigger" onClick={toggle} />
      </div>
      <div><CustomBreadcrumb /></div>
      <Space className="flex row-l col-c">
        <Avatar />
      </Space>
    </Header>
  )
}
