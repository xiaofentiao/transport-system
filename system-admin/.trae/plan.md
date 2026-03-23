# Geniex 功能配置页面 - 实施计划

## 目标
- 新增一个“Geniex 功能配置”管理页面，用于按“商户/设备”维度配置是否允许启用 Geniex。
- 配置优先级规则在页面文案/说明中体现：设备级（devicetag）配置优先于商户级配置。
- 支持筛选、列表展示、新增、编辑、删除，且字段/交互满足需求描述与示意图风格。

## 范围
- 前端：页面、路由、接口定义（API 配置层）、多语言文案。
- 后端：不在本次改动范围内；但会按约定预留接口定义与字段映射，便于后端对接。
- “设备信息同步及轮询时同步 Geniex 配置信息”：当前代码库未发现设备同步/轮询模块；本次仅在接口层提供可被未来设备模块调用的能力位与数据结构约定。

## 关键假设（可在实现阶段随时调整）
- 模块名：`geniexConfig`
- 路由：`/geniex/config`
- 菜单/页面标题：`Geniex功能配置`
- 接口字段：以“后端返回最终展示字段”为准；前端会做最小必要的格式化（例如时间格式）。

## 数据结构与接口约定（前端侧）
### 列表项（建议）
- `id`: number|string
- `merchantId`: string（内部标识）
- `merchantName`: string（展示）
- `deviceTag`: string | null
- `offlineDays`: number（未联网时长，天）
- `deviceStatus`: `'LOCKED' | 'ALL'`
- `geniexEnabled`: boolean
- `operator`: string（最后操作人；系统则 `system`）
- `updatedAt`: string（最后操作时间）

### API 模块（新增 `src/api/geniexConfig.ts`）
- `list`: 查询列表（支持分页/筛选：`deviceTag` 精准，`merchantId` 精准）
- `create`: 新增配置
- `update`: 编辑配置（商户与 devicetag 不可改，其他可改）
- `remove`: 删除配置（按 `id`）
- `merchantOptions`: 商户下拉列表（支持关键字搜索：可输可选）

> 实现时按现有 API 聚合器 [api/index.ts](file:///d:/AICoding/react-admin-template/src/api/index.ts) 的约定导出；具体 URL 需要与后端对齐后替换。

## 页面与交互设计
### 筛选区
- Devicetag：Input，支持精准查询（`allowClear`）。
- 商户：Select（`showSearch` + `filterOption=false`），输入触发远程搜索获取商户列表；可选可输。
- 操作按钮：`搜索`、`新增`（与截图一致的布局风格）。

### 列表区
列：
- Id
- 商户
- Devicetag
- 操作人（最后操作编辑的人；系统展示 `system`）
- 最后操作时间
- 操作：编辑、删除（使用现有 [OperationIcon](file:///d:/AICoding/react-admin-template/src/components/operationIcon/index.tsx) 统一风格）

### 新增/编辑弹窗
弹窗标题：`新增/更新`

字段：
- 商户：Select（可输可选，必填）
- Devicetag：Input（非必填；为空表示商户级配置）
- 未联网时长：InputNumber（必填，默认 30，单位“天”）
- 设备状态：Radio.Group（单选：锁定设备/全部设备；默认锁定设备）
- Geniex：Switch（默认关闭）

规则：
- 编辑时：商户与 devicetag 禁用不可编辑，其余可编辑。
- 保存：表单校验通过后提交；成功后关闭弹窗并刷新列表。

### 删除
- 点击删除弹出确认：文案“确认删除配置”；确认后调用删除接口并刷新列表。

## 路由与菜单
- 在 [router/config.tsx](file:///d:/AICoding/react-admin-template/src/router/config.tsx) 的合适位置新增子路由：
  - path: `/geniex/config`
  - meta.title: `Geniex功能配置`
  - element: 懒加载页面 `@/pages/geniexConfig/index`
- 如项目有侧边栏菜单基于路由 meta 生成，则无需额外改动；否则按现有约定补齐菜单项。

## 国际化（i18n）
- 在 `src/locales/zh/index.tsx`、`src/locales/en/index.tsx` 补齐本页面相关文案 key（页面标题、字段名、按钮、设备状态枚举、删除确认等）。
- 复用现有通用 key（如 `common.search/common.add/common.save/common.cancel`）优先，避免重复定义。

## 实施步骤（实现阶段会逐项落地）
1. 基于 `src/pages/_templates` 复制出 `src/pages/geniexConfig` 页面骨架，并改造为列表 + 筛选 + 弹窗 CRUD 结构。
2. 新增 `src/api/geniexConfig.ts` 并接入聚合 `api.geniexConfig.*` 调用方式。
3. 实现筛选表单与商户远程搜索（含输入防抖/并发取消策略，避免快速输入导致结果乱序）。
4. 实现新增/编辑弹窗表单与字段禁用规则。
5. 实现删除确认与列表刷新。
6. 注册路由并补齐多语言文案。
7. 本地验证：页面可进入；筛选/新增/编辑/删除的交互与表单校验正确；接口未联调时提供 mock/占位错误提示不崩溃。

## 验证清单（实现完成后）
- 列表展示字段与排序正常，空 devicetag 展示为 `-` 或空（保持一致）。
- 新增：商户必填；未联网时长默认 30 且必填；设备状态默认锁定设备；Geniex 默认关闭。
- 编辑：商户/devicetag 禁用；更新成功刷新列表。
- 删除：弹出确认；确认后删除成功刷新列表。
- i18n：页面所有可见文字均来自多语言 key 或已有通用 key。

