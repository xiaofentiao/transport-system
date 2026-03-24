export interface RoleItem {
  id: string;
  roleName: string;
  roleCode: string;
  description?: string;
  status: 0 | 1;
  menuIds?: (string | number)[];
  createTime?: string;
  updateTime?: string;
}

export interface RoleSearchParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: 0 | 1;
}
