import type { ReactElement } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

/** 主内容区：渲染子路由 Outlet */
export default function Main(): ReactElement {
  return (
    <Content
      style={{
        padding: '10px 14px 14px 14px',
        backgroundColor: '#f2f7ff'
      }}
    >
      <div className='card'>
        <Outlet />
      </div>
    </Content>
  )
}
