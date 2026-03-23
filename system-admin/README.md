# React Admin Template (Vite + Antd)

## 项目简介
- 基于 React 18、Ant Design 5 与 Vite 5 的管理后台模板
- 内置权限菜单、路由渲染与基础业务示例
- 使用 `zustand` 进行全局状态管理
- 集成 `vite-plugin-svg-icons`，统一 SVG 图标管理
- Axios 请求封装与拦截器位于 `src/services`

## 技术栈
- React：`react@^18.3.1`、`react-dom@^18.3.1`
- UI：`antd@^5.19.2`、`@ant-design/icons@^5.6.1`
- 构建：`vite@^5.4.8`、`@vitejs/plugin-react@^4.3.3`
- 语言：`typescript@^5.6.3`
- 状态：`zustand@^4.5.5`
- 路由：`react-router-dom@^6.26.2`

## 开发与构建
- 安装依赖：`npm i`
- 启动开发：`npm run dev`
- 生产构建：`npm run build`
- 预览构建：`npm run preview`

## 环境变量
本项目使用 `ENV_NAME` 控制构建基路径与接口配置：

示例：

```bash
# macOS / Linux
ENV_NAME=dev npm run dev

# Windows PowerShell
$env:ENV_NAME="dev"; npm run dev
```

## 本地代理
开发环境代理配置位于 `vite.config.ts`：


## 目录结构
- `src/api`：接口聚合与模块定义
- `src/assets`：静态资源与全局样式
- `src/components`：通用组件
- `src/hook`：通用 Hooks
- `src/layout`：布局模块
- `src/pages`：业务页面
- `src/router`：路由配置
- `src/services`：请求与拦截器
- `src/store`：`zustand` 状态
- `src/type`：类型定义
- `src/utils`：工具方法

## 说明
- 项目未配置 `npm run lint` 等脚本，如需校验请自行补充命令
