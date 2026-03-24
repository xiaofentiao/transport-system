# 权限管理模块设计

## 一、菜单结构

```
系统设置 (fa-cogs)
├── 用户管理 /settings/user
├── 角色管理 /settings/role
└── 菜单管理 /settings/menu
```

## 二、表结构设计

### 2.1 用户表 sys_user

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| username | varchar(50) | 账号，唯一 |
| password | varchar(255) | 密码（加密） |
| real_name | varchar(50) | 姓名 |
| phone | varchar(20) | 手机号 |
| email | varchar(100) | 邮箱 |
| role_id | bigint | 关联角色ID |
| status | tinyint | 状态 0禁用 1启用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 2.2 角色表 sys_role

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| role_name | varchar(50) | 角色名称 |
| role_code | varchar(50) | 角色编码，唯一 |
| description | varchar(255) | 描述 |
| status | tinyint | 状态 0禁用 1启用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 2.3 菜单表 sys_menu

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| parent_id | bigint | 父菜单ID，0为根 |
| menu_name | varchar(50) | 菜单名称 |
| path | varchar(200) | 路由路径 |
| icon | varchar(50) | 图标 |
| sort | int | 排序，升序 |
| menu_type | tinyint | 1目录 2菜单 3按钮 |
| status | tinyint | 状态 0禁用 1启用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 2.4 角色-菜单关联表 sys_role_menu

| 字段 | 类型 | 说明 |
|------|------|------|
| role_id | bigint | 角色ID |
| menu_id | bigint | 菜单ID |

## 三、接口设计

### 3.1 用户管理

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | /settings/user/list | pageNum, pageSize, keyword, status, roleId |
| 新增 | POST | /settings/user/add | { username, password, realName, phone, email, roleId, status } |
| 编辑 | POST | /settings/user/update | { id, realName, phone, email, roleId, status } |
| 删除 | POST | /settings/user/delete | { id } |
| 重置密码 | POST | /settings/user/resetPassword | { id, newPassword } |

### 3.2 角色管理

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分页列表 | GET | /settings/role/list | pageNum, pageSize, keyword, status |
| 新增 | POST | /settings/role/add | { roleName, roleCode, description, status } |
| 编辑 | POST | /settings/role/update | { id, roleName, roleCode, description, status } |
| 删除 | POST | /settings/role/delete | { id } |
| 分配菜单 | POST | /settings/role/assignMenus | { roleId, menuIds: number[] } |
| 菜单树 | GET | /settings/role/menuTree | 用于分配菜单的树形数据 |
| 角色菜单ID | GET | /settings/role/menuIds | ?roleId=xx 返回该角色已选菜单ID列表 |

### 3.3 菜单管理

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 树形列表 | GET | /settings/menu/tree | 返回树形结构 |
| 新增 | POST | /settings/menu/add | { parentId, menuName, path, icon, sort, menuType, status } |
| 编辑 | POST | /settings/menu/update | { id, parentId, menuName, path, icon, sort, menuType, status } |
| 删除 | POST | /settings/menu/delete | { id } |

## 四、响应格式

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "records": [...],
    "total": 100
  }
}
```

或树形：

```json
{
  "code": 200,
  "data": [
    { "id": 1, "menuName": "系统设置", "children": [...] }
  ]
}
```
