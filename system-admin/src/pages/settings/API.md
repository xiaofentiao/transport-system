# 系统设置 - 接口与关系说明

## 接口列表

| 接口名 | Method | URL | 模块 |
|--------|--------|-----|------|
| userList | GET | /settings/user/list | 用户 |
| userAdd | POST | /settings/user/add | 用户 |
| userUpdate | POST | /settings/user/update | 用户 |
| userDelete | POST | /settings/user/delete | 用户 |
| userResetPassword | POST | /settings/user/resetPassword | 用户 |
| roleList | GET | /settings/role/list | 角色 |
| roleAdd | POST | /settings/role/add | 角色 |
| roleUpdate | POST | /settings/role/update | 角色 |
| roleDelete | POST | /settings/role/delete | 角色 |
| roleAssignMenus | POST | /settings/role/assignMenus | 角色 |
| roleMenuTree | GET | /settings/role/menuTree | 角色 |
| roleMenuIds | GET | /settings/role/menuIds | 角色 |
| menuTree | GET | /settings/menu/tree | 菜单 |
| menuAdd | POST | /settings/menu/add | 菜单 |
| menuUpdate | POST | /settings/menu/update | 菜单 |
| menuDelete | POST | /settings/menu/delete | 菜单 |

## 表/接口字段

### 用户 (User)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| username | string | 账号 |
| realName | string | 姓名 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| roleId | number | 角色ID |
| roleName | string | 角色名称（展示用） |
| status | 0\|1 | 0禁用 1启用 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |

**userList 查询参数**：pageNum, pageSize, keyword?, status?, roleId?  
**userAdd**：username, password, realName?, phone?, email?, roleId?, status  
**userUpdate**：id, realName?, phone?, email?, roleId?, status  

### 角色 (Role)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| roleName | string | 角色名称 |
| roleCode | string | 角色编码 |
| description | string | 描述 |
| status | 0\|1 | 0禁用 1启用 |
| menuIds | (string\|number)[] | 菜单ID列表 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |

**roleList 查询参数**：pageNum, pageSize, keyword?, status?  
**roleAdd/roleUpdate**：roleName, roleCode, description?, status；更新时需传 id  
**roleAssignMenus**：roleId, menuIds  
**roleMenuIds 查询参数**：roleId  

### 菜单 (Menu)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| parentId | number | 父菜单ID，0为根 |
| menuName | string | 菜单名称 |
| path | string | 路由路径 |
| icon | string | 图标 |
| sort | number | 排序 |
| menuType | 1\|2\|3 | 1目录 2菜单 3按钮 |
| status | 0\|1 | 0禁用 1启用 |
| children | MenuItem[] | 子节点（树形） |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |

**menuTree 查询参数**：keyword?, status?  
**menuAdd/menuUpdate**：parentId, menuName, path?, icon?, sort?, menuType, status；更新时需传 id  
**menuDelete**：id  

## 实体关系

```
Menu (菜单) ← 1:N → Role (角色) ← N:1 → User (用户)
```

- **User 关联 Role**：用户通过 `roleId` 绑定角色，编辑用户时需下拉选择角色（调用 `roleList`）
- **Role 关联 Menu**：角色通过 `roleAssignMenus` 分配菜单，分配前需 `roleMenuIds` 获取已选、`menuTree` 获取树
- **Menu**：树形结构，`parentId` 自关联，`menuType`：1 目录、2 菜单、3 按钮

## 页面调用关系

| 页面 | 主接口 | 依赖接口 |
|------|--------|----------|
| 用户管理 | userList, userAdd, userUpdate | roleList（角色下拉） |
| 角色管理 | roleList, roleAdd, roleUpdate, roleAssignMenus, roleMenuIds | menuTree（分配菜单） |
| 菜单管理 | menuTree, menuAdd, menuUpdate, menuDelete | 无 |
