import type { ReactElement } from 'react'
import { Layout } from 'antd'

import AppHeader from './components/header'
import Main from './components/main'
import SideBar from './components/sideBar'

import './index.less'

/** 后台主布局：顶栏 + 侧栏 + 内容区 */
export default function LayOut(): ReactElement {
  return (
    <Layout className="contents">
      <AppHeader />
      <Layout className="site-layout">
        <SideBar />
        <Main />
      </Layout>
    </Layout>
  )
}
