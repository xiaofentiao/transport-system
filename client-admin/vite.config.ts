import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

import legacy from '@vitejs/plugin-legacy';
console.log(process.env.ENV_NAME, 'process.env.ENV_NAME');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      // 指定存放svg的文件夹路径
      iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
      // 指定symbolId格式
      symbolId: '[name]',
    }),
    legacy({
      targets: ['chrome < 40', 'edge < 15'],
      renderLegacyChunks: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: "always", // 括号内才使用数学计算
        //全局引入less变量
        javascriptEnabled: true,
        additionalData:  `@import "${resolve(__dirname, 'src/assets/styles/variables.less')}";`
      },
    },
  },
  resolve:{
    //设置路径别名
    alias: {
      '@': '/src/',
    },
  },
  //定义全局静态常量
  define: {
    __ENV_NAME__ : { env: process.env.ENV_NAME} 
  },
  //开发环境配置
  server: {
    port: 3030,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
    proxy: {//代理配置
      '/sellmo-opt-backend': {
        //接口域名代理 
        target: 'https://sellmo-test.transsion-os.com',
        // target: 'http://10.206.68.114:8082',
        // target: 'http://10.158.70.98:8082', //旭林、
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/sellmo-opt-backend/, ''),
      },
      '/sellmo-partner': {
        target: 'https://sellmo-test.transsion-os.com',
        changeOrigin: true,
      }
    }

  },
  //输出配置
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: process.env.ENV_NAME === 'test' ? true : false,
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: process.env.ENV_NAME === 'test' ? false : true,
        drop_debugger:  process.env.ENV_NAME === 'test' ? false :  true,
      },
    },
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react'],
          'antd': ['antd'],
        },
      },
    },
  },
  //路径
  base: '/'
})
