---
name: create-business-module
description: 自动化创建新的业务模块，包括生成API定义、复制页面模板、配置路由。
---

# Create Business Module

## Description
Assist in creating a new business module based on the project's standard template (`src/pages/_templates`). This includes generating API definitions, page components, and route configurations.

## Usage
Use this skill when the user wants to "add a new feature", "create a module", "add a page", or mentions "new business module".

## Implementation Steps

### 1. Gather Information
Ask the user for:
- **Module Name** (e.g., `orderList`). This will be used as the directory name and variable name.
- **Route Path** (e.g., `/order/list`).
- **Menu Title** (e.g., "Order Management").

### 2. Create API Definition
1. Create `src/api/[moduleName].ts` with the following content:
   ```typescript
   export default {
     list: {
       url: '/[moduleName]/list',
       method: 'get'
     },
     detail: {
       url: '/[moduleName]/detail',
       method: 'get'
     },
     save: {
       url: '/[moduleName]/save',
       method: 'post'
     },
     delete: {
       url: '/[moduleName]/delete',
       method: 'post'
     }
   }
   ```
   *(Note: The `src/api/index.ts` automatically registers all `.ts` files in the directory, so no manual registration is needed.)*

### 3. Scaffold Page Components
1. **Copy Template**: Copy the entire directory `src/pages/_templates` to `src/pages/[moduleName]`.
2. **Clean Up**: Delete `src/pages/[moduleName]/USAGE.md`.
3. **Rename Hook**: Rename `src/pages/[moduleName]/hooks/useListModule.tsx` to `src/pages/[moduleName]/hooks/use[CapitalizedModuleName].tsx`.
4. **Update Hook Content**:
   - In `src/pages/[moduleName]/hooks/use[CapitalizedModuleName].tsx`:
     - Import the API: `import api from '@/api';`
     - Replace `fakeListApi` usage with `api.[moduleName].list`.
     - Update `apiReq` in `useTable` hook to use the real API.
     - (Optional) Remove `fakeListApi` function definition.
5. **Update Index Component**:
   - In `src/pages/[moduleName]/index.tsx`:
     - Update import: `import { useListModule } from './hooks/useListModule';` -> `import { use[CapitalizedModuleName] } from './hooks/use[CapitalizedModuleName]';`
     - Update usage: `const { ... } = useListModule();` -> `const { ... } = use[CapitalizedModuleName]();`

### 4. Register Route
1. Read `src/router/config.tsx`.
2. Locate the `subRoutes` array definition.
3. Append the new route object to the `subRoutes` array:
   ```typescript
   {
     path: '[routePath]',
     name: '[moduleName]',
     meta: {
       title: '[menuTitle]',
     },
     element: lazyLoad(React.lazy(() => import('@/pages/[moduleName]/index')))
   },
   ```

### 5. Finalize
1. Inform the user that the module `[moduleName]` has been created successfully.
2. Provide a summary of changes:
   - Created API file: `src/api/[moduleName].ts`
   - Created Page directory: `src/pages/[moduleName]`
   - Registered Route: `[routePath]`
3. Remind the user to:
   - Update the API URLs in `src/api/[moduleName].ts` to match the backend.
   - Update `src/pages/[moduleName]/types/index.ts` to match the actual data structure.
   - Add translation keys for the menu title if needed.
