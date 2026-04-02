import type { MessageInstance } from 'antd/es/message/interface'

let messageApi: MessageInstance | null = null

/**
 * 在根组件中通过 App.useApp() 注入 message，供 axios 拦截器等非 React 场景使用（可消费 ConfigProvider 主题）。
 */
export function registerAntdMessage(api: MessageInstance): void {
  messageApi = api
}

/**
 * 返回已注册的 message；应在 AntdMessageRegistrar 挂载之后再发起依赖提示的请求。
 */
export function getAntdMessage(): MessageInstance {
  if (!messageApi) {
    throw new Error('[antdMessage] message API 尚未注册，请确认已在 <App> 内渲染 AntdMessageRegistrar')
  }
  return messageApi
}
