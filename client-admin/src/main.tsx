import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import './index.less'
import './assets/styles/index.less'
import 'virtual:svg-icons-register'
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
