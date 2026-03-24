import React, { Suspense } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import NLoading from '@/components/loading'
import MyRouter from '@/router'
import { PROJECT_THEME_COLOR } from './utils/constant'

type AppErrorBoundaryProps = {
  children: React.ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

class AppErrorBoundary extends React.PureComponent<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 24 }}>页面出现异常，请刷新重试。</div>
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: PROJECT_THEME_COLOR
        }
      }}
    >
      <AppErrorBoundary>
        <Suspense fallback={<NLoading />}>
          <MyRouter />
        </Suspense>
      </AppErrorBoundary>
    </ConfigProvider>
  )
}

