import { App } from 'antd'
import { useLayoutEffect, type ReactElement } from 'react'

import { registerAntdMessage } from '@/utils/antdMessage'

/**
 * 将 App.useApp() 提供的 message 注册到全局，供 services 等非组件代码使用。
 */
export function AntdMessageRegistrar(): ReactElement | null {
  const { message } = App.useApp()

  useLayoutEffect(() => {
    registerAntdMessage(message)
  }, [message])

  return null
}
