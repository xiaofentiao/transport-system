export interface MenuItem {
  id: string;
  parentId: number;
  menuName: string;
  path?: string;
  icon?: string;
  sort?: number;
  menuType: 1 | 2 | 3; // 1目录 2菜单 3按钮
  status: 0 | 1;
  children?: MenuItem[];
  createTime?: string;
  updateTime?: string;
}

export interface MenuSearchParams {
  keyword?: string;
  status?: 0 | 1;
}
