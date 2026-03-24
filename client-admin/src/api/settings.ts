/**
 * 权限管理模块 API
 * 用户管理、角色管理、菜单管理
 */
const settings = {
  // 用户管理
  userList: { method: 'get', url: '/settings/user/list' },
  userAdd: { method: 'post', url: '/settings/user/add' },
  userUpdate: { method: 'post', url: '/settings/user/update' },
  userDelete: { method: 'post', url: '/settings/user/delete' },
  userResetPassword: { method: 'post', url: '/settings/user/resetPassword' },

  // 角色管理
  roleList: { method: 'get', url: '/settings/role/list' },
  roleAdd: { method: 'post', url: '/settings/role/add' },
  roleUpdate: { method: 'post', url: '/settings/role/update' },
  roleDelete: { method: 'post', url: '/settings/role/delete' },
  roleAssignMenus: { method: 'post', url: '/settings/role/assignMenus' },
  roleMenuTree: { method: 'get', url: '/settings/role/menuTree' },
  roleMenuIds: { method: 'get', url: '/settings/role/menuIds' }, // ?roleId=xx 获取角色已选菜单ID列表

  // 菜单管理
  menuTree: { method: 'get', url: '/settings/menu/tree' },
  menuAdd: { method: 'post', url: '/settings/menu/add' },
  menuUpdate: { method: 'post', url: '/settings/menu/update' },
  menuDelete: { method: 'post', url: '/settings/menu/delete' },
};

export default settings;
