module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended-legacy',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // 代码风格与可读性：强制使用严格等于，避免隐式类型转换带来的 Bug
    'eqeqeq': ['error', 'smart'],
    // 结构控制：多行语句必须使用花括号，减少逻辑歧义
    'curly': ['error', 'multi-line'],
    // 语义明确：parseInt 必须显式传入 radix，避免不同环境行为不一致
    'radix': 'error',
    // 现代语法：禁止使用 var，提示使用 let/const
    'no-var': 'error',
    // 变量声明：能用 const 就用 const，提升可读性与安全性
    'prefer-const': ['warn', { destructuring: 'all' }],
    // 调试语句：限制 debugger 的使用
    'no-debugger': 'warn',
    // 导入规范：禁止重复导入同一模块
    'import/no-duplicates': 'error',
    // React 规范：无子元素时使用自闭合标签，减少冗余
    'react/self-closing-comp': 'warn',
    // React 规范：数组渲染必须携带 key
    'react/jsx-key': 'error',
    // Hook 依赖：保持为警告，提示补齐依赖或显式忽略
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}
