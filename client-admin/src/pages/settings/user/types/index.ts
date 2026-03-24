export interface UserItem {
  id: string;
  username: string;
  realName?: string;
  phone?: string;
  email?: string;
  roleId?: number;
  roleName?: string;
  status: 0 | 1;
  createTime?: string;
  updateTime?: string;
}

export interface UserSearchParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  status?: 0 | 1;
  roleId?: number;
}
