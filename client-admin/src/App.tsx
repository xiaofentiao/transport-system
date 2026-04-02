import React, { Suspense, type ReactElement } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import { AntdMessageRegistrar } from '@/components/antdMessageRegistrar'
import NLoading from '@/components/loading'
import MyRouter from '@/router'
import { PROJECT_THEME_COLOR } from './utils/constant'

type AppErrorBoundaryProps = {
  children: React.ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

/** 捕获子树渲染错误，避免整页白屏 */
class AppErrorBoundary extends React.PureComponent<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div style={{ padding: 24 }}>页面出现异常，请刷新重试。</div>
    }
    return this.props.children
  }
}

/** 根组件：Ant Design 主题与中文、全局 Suspense、错误边界 */
export default function App(): ReactElement {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: PROJECT_THEME_COLOR
        }
      }}
    >
      <AntdApp>
        <AntdMessageRegistrar />
        <AppErrorBoundary>
          <Suspense fallback={<NLoading />}>
            <MyRouter />
          </Suspense>
        </AppErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  )
}

