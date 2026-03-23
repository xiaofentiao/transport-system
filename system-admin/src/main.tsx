import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

//通用样式
import './index.less';
import './assets/styles/index.less';

import 'virtual:svg-icons-register';


import 'antd/dist/reset.css'

// //加载svg
// import '@/assets/icons/index';




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
