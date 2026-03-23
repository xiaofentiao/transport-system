---
name: react页面规范
description: "新增页面时 统一 React 模块开发流程，通过**关注点分离 (Separation of Concerns)** 原则，提升代码的可读性、可维护性及复用性。"
---

## 1. 核心设计理念

模块开发应遵循 **MVL (Model-View-Logic)** 分层模式：

*   **View (视图层)**：纯 UI 组件，只负责渲染，不包含业务逻辑。
*   **Logic (逻辑层)**：通过 Custom Hooks 承载业务逻辑、状态管理和副作用。
*   **Model (数据层)**：TypeScript 类型定义与 API 服务。

---

## 2. 标准目录结构

严禁将所有代码堆砌在单个文件中。建议采用 **"功能内聚"** 的目录结构：

```text
src/pages/ModuleName/
├── components/          # 模块私有组件（拆分 UI，纯展示组件）
│   ├── SubComponentA.tsx
│   └── SubComponentB.tsx
├── hooks/               # 模块私有 Hooks（拆分逻辑，状态与副作用）
│   └── useModuleLogic.ts
├── types/               # (可选) 模块私有类型定义
│   └── index.d.ts
├── index.tsx            # 模块入口（容器组件，负责组装 Hook 与 UI）
└── index.module.less    # 样式文件
```

---

## 3. 开发四步法

### 第一步：定义数据模型 (Model - Types)
在编写逻辑前，先明确数据的形状，避免“基本类型偏执”和后期字段混乱。

```typescript
// src/pages/UserList/types/index.d.ts
export interface User {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface SearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}
```

### 第二步：编写业务逻辑 (Logic - Custom Hooks)
**关键步骤**：将状态 (`useState`)、副作用 (`useEffect`) 和处理函数 (`Handlers`) 移入 Hook，解决“过长函数”问题。

```typescript
// src/pages/UserList/hooks/useUserList.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchUserList } from '../services/api';
import type { User, SearchParams } from '../types';

export const useUserList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [params, setParams] = useState<SearchParams>({
    keyword: '',
    page: 1,
    pageSize: 10,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUserList(params);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  return { loading, data, params, handlePageChange };
};
```

### 第三步：拆分 UI 组件 (View - Components)
识别 UI 中的独立部分，提取为纯展示组件 (Presentational Components)。

```tsx
// src/pages/UserList/components/UserTable.tsx
import React from 'react';
import type { User } from '../types';

interface UserTableProps {
  dataSource: User[];
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ dataSource, loading }) => {
  if (loading) return <div>加载中...</div>;
  return (
    <ul>
      {dataSource.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};
```

### 第四步：组装页面 (Integration)
在入口文件中，将 Hook（逻辑）和 Component（视图）组合。`index.tsx` 应保持简洁，作为“指挥官”角色。

```tsx
// src/pages/UserList/index.tsx
import React from 'react';
import { useUserList } from './hooks/useUserList';
import { UserTable } from './components/UserTable';
import styles from './index.module.less';

const UserListPage: React.FC = () => {
  // 1. 引入逻辑
  const { loading, data, handlePageChange } = useUserList();

  // 2. 渲染视图
  return (
    <div className={styles.container}>
      <h1>用户管理</h1>
      <UserTable loading={loading} dataSource={data} />
      <button onClick={() => handlePageChange(2)}>下一页</button>
    </div>
  );
};

export default UserListPage;
```

---

## 4. 质量自检清单 (Checklist)

在提交代码前，请对照以下清单进行自检：

### 命名与规范
- [ ] **命名清晰**：变量名是否自解释？(如 `list` -> `userList`)
- [ ] **Hook 规范**：自定义 Hook 是否以 `use` 开头？
- [ ] **Handler 规范**：事件处理函数是否以 `handle` 或 `on` 开头？

### 代码结构与坏味道
- [ ] **拒绝过长函数**：`index.tsx` 是否超过 150 行？(如是，请拆分组件或 Hook)
- [ ] **拒绝依恋情结**：组件内是否包含大量数据处理逻辑？(应移至 Hook 或 Utils)
- [ ] **拒绝数据泥团**：是否有 3 个以上参数总是结伴传递？(应封装为对象)
- [ ] **拒绝重复代码**：样式或逻辑是否可复用？

### 性能优化
- [ ] **渲染控制**：传递给子组件的对象/函数是否使用了 `useMemo` / `useCallback`？
- [ ] **列表渲染**：列表循环是否正确设置了唯一的 `key`？
- [ ] **副作用管理**：`useEffect` 依赖项是否准确？是否有多余的请求？

---

> **原则**：保持代码“随时可工作”，小步重构，频繁提交。