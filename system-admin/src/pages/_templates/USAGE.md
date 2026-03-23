
## 目录结构

将 `src/pages/_templates/listModule` 复制一份并重命名为你的业务模块（例如 `src/pages/userList`）：

```
userList/
  components/
    SearchForm.tsx
  hooks/
    useUserList.tsx
  types/
    index.ts
  detail.tsx
  index.less
  index.tsx
```

## 接入步骤（建议顺序）

### 1) 定义类型（types/index.ts）

- 列表行数据类型：`XXXItem`
- 查询参数类型：`XXXSearchParams`（必须包含 `pageNum/pageSize`，与 `useTable` 一致）
- 如果有范围筛选（数字/金额/天数等），建议使用 `{ start, end }`，并在查询时展开为 `xxxStart/xxxEnd`

### 2) 搜索表单（components/SearchForm.tsx）

- 仅输出 `Form.Item`，不需要包 `Form`（外层由 `Tables` 统一渲染）
- 所有 `name` 必须与 `XXXSearchParams` 字段对应
- 日期区间使用 `RangePicker`，在 `handleSearch` 里转换为后端需要的 `start/end` 字段

### 3) 列表逻辑 Hook（hooks/useUserList.tsx）

你需要替换模板中的两个关键点：

1. `apiReq`：换成真实接口，如 `api.user.list`
2. `processData`：根据接口返回结构映射出 `{ dataSource, total }`

模板中保留了与 `collectionList` 同类的能力：

- `initialParams`：首屏查询参数
- `formInitialValues`：表单默认值（用于 `Tables` 的 `formProps.initialValues`）
- `handleSearch`：
  - 将表单值转换成后端查询参数
  - 对“空字符串”做过滤（避免把 `""` 传给后端）
  - 统一重置 `pageNum=1`
- `columnsData`：表格列定义，行操作里可打开详情弹窗

### 4) 详情弹窗（detail.tsx，可选）

- 行操作触发 `setVisible(true)` + `setInfo(row)`
- 弹窗关闭统一走 `handleModalAction('cancel')`
- 保存/更新成功可走 `handleModalAction('success')`，内部会触发 `refresh()` 刷新列表

### 5) 页面入口（index.tsx）

- 使用 `Tables` 组件：
  - `searchCom` 返回搜索表单片段
  - `onSearch` 传入 `handleSearch`
  - `tableParams` 传入 `dataSource/loading/searchParams/total/columns/setColumns/tableChange`

### 6) 注册路由（src/router/config.tsx）

该项目使用显式路由配置（不会自动扫描 pages 目录）。在 `subRoutes` 中追加：

```tsx
{
  path: '/user/list',
  name: 'userList',
  meta: {
    title: '用户列表',
    icon: 'user'
  },
  element: lazyLoad(React.lazy(() => import('@/pages/userList/index')))
}
```


## 你通常需要改哪些地方

- `types/index.ts`：行数据字段、查询字段
- `components/SearchForm.tsx`：搜索项
- `hooks/useXXXList.tsx`：
  - `apiReq`、`processData`
  - `handleSearch` 的字段转换逻辑
  - `columnsData` 的列与行操作
- `detail.tsx`：业务详情展示与保存逻辑（如不需要可删除，并在 `index.tsx` 移除渲染）

