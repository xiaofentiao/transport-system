import { message } from 'antd'
import axios from 'axios'

import options from './config'

import { LOCAL_KEYS } from '@/type/local_keys_enum'
import storage from '@/utils/storage'
import type { InternalAxiosRequestConfig } from 'axios'

type AppRequestConfig = InternalAxiosRequestConfig & {
  loading?: boolean
  loadingText?: string
}
// 移除未使用的依赖
const instance = axios.create(options)
let closeLoading: (() => void) | null = null
let isRedirectingToLogin = false

// 添加请求拦截器
instance.interceptors.request.use(
  function (config: AppRequestConfig) {
    // nprogress.start()
    // 在发送请求之前做些什么
    if (config?.url?.includes('export')) {
      config.responseType = 'arraybuffer';
    }
    const loading = config?.loading ?? false
    if (loading) {
      closeLoading = message.loading(config?.loadingText ?? '加载中...', 0)
    }
    const token = storage.getCache<string>(LOCAL_KEYS.TOKEN) ?? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzY4ODc0NjY0LCJleHAiOjE3Njg4ODE4NjR9.GIwEplS1F7l9jCDD-3CHDj2t75aRJx4SkDTg8EXx9veQVtt5eNPDPD4v0kLGgAQMdUl3D1C9x9A-AKBVOz8FQQ"
    if (config.headers && 'set' in config.headers) {
      config.headers.set('Authorization', token)
    } else {
      ;(config.headers as any) = {
        ...(config.headers as any),
        Authorization: token
      }
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    // nprogress.done()
    return Promise.reject(error)

  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // nprogress.done()
    // 对响应数据做点什么
    if (closeLoading) closeLoading()
    closeLoading = null

    const { status, config, data, headers } = response;
    if (status === 200 && config?.url?.includes('export')) {
      return {
        headers: headers,
        excelData: data,
        contentType: headers['content-type'],
      }
    }

    const { code }: { code: number } = response.data;
    // debugger
    // 未登录
    if (code === 401) {
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true
        storage.deleteCache(LOCAL_KEYS.TOKEN)
        storage.deleteCache(LOCAL_KEYS.USER_INFO)
        message.error('登录失效，正在跳转…', 2)
        const loginUrl = new URL(`${import.meta.env.BASE_URL}login`, window.location.origin)
        window.location.assign(loginUrl.toString())
      }
      return Promise.reject(new Error('Unauthorized'))
    } else if (code !== 200) {
      message.error(response.data.message ?? '系统错误')
    }

    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    // nprogress.done()
    if (closeLoading) closeLoading()
    closeLoading = null

    const response = error?.response
    if (!response) {
      message.error('网络异常，请检查网络连接')
      return Promise.reject(error)
    }

    const status = response.status
    if (status >= 500) {
      message.error('服务异常，请稍后重试')
    }
    // const { code, data } = response;
    // if (code === 401) {
    //   storage.clearCache(true)
    //   message.error('跳转登陆中', 2, () => {
    //     if (!location.hash.includes('/login')){
    //       window.location.href =  '/login';
    //     }
    //   });
    // }
    // if(code === 500) {
    //   message.error(data?.msg)
    // }
    return Promise.reject(error)
  }
);

export default instance
