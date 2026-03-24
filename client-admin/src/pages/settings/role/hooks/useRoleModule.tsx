import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { useTable } from '@/hook/useTable';
import type { ResponseConfig } from '@/type/common';
import { formatDate } from '@/utils';
import type { RoleItem, RoleSearchParams } from '../types';
import type { MenuItem } from '../../menu/types';
import api from '@/api';

const processData = (res: ResponseConfig) => ({
  dataSource: res?.data?.records ?? res?.result?.records ?? [],
  total: res?.data?.total ?? res?.result?.total ?? 0,
});

const isPresent = (value: unknown): boolean => value != null && value !== '';

const removeEmptyFields = <T extends Record<string, unknown>>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => isPresent(value))) as Partial<T>;

export const useRoleModule = () => {
  const [visible, setVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [info, setInfo] = useState<RoleItem | null>(null);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [roleMenuIds, setRoleMenuIds] = useState<(string | number)[]>([]);

  const statusLabelMap = { 1: '启用', 0: '禁用' };
  const statusOptions: DefaultOptionType[] = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  const initialParams = useMemo<RoleSearchParams>(() => ({ pageNum: 1, pageSize: 10 }), []);

  const {
    dataSource,
    loading,
    total,
    searchParams,
    handleSearch: baseHandleSearch,
    handleTableChange,
    refresh,
  } = useTable<RoleItem, RoleSearchParams>({
    apiReq: api.settings.roleList,
    processData,
    initialParams,
    manual: false,
  });

  const fetchMenuTree = useCallback(async () => {
    try {
      const res = await api.settings.menuTree({});
      const data = res?.data ?? res?.result ?? [];
      setMenuTree(Array.isArray(data) ? data : []);
    } catch {
      setMenuTree([]);
    }
  }, []);

  useEffect(() => {
    if (assignVisible) fetchMenuTree();
  }, [assignVisible, fetchMenuTree]);

  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      const merged = { ...searchParams, pageNum: 1, ...values } as Record<string, unknown>;
      baseHandleSearch(removeEmptyFields(merged));
    },
    [baseHandleSearch, searchParams]
  );

  const openAdd = useCallback(() => {
    setMode('add');
    setInfo(null);
    setVisible(true);
  }, []);

  const openEdit = useCallback((row: RoleItem) => {
    setMode('edit');
    setInfo(row);
    setVisible(true);
  }, []);

  const openAssign = useCallback(async (row: RoleItem) => {
    setInfo(row);
    setAssignVisible(true);
    try {
      const res = await api.settings.roleMenuIds({ roleId: row.id });
      const ids = res?.data ?? res?.result ?? [];
      setRoleMenuIds((Array.isArray(ids) ? ids : []).map(String));
    } catch {
      setRoleMenuIds([]);
    }
  }, []);

  const handleModalOk = useCallback(
    async (values: any) => {
      try {
        if (mode === 'add') {
          await api.settings.roleAdd(values);
        } else if (info?.id) {
          await api.settings.roleUpdate({ ...values, id: info.id });
        }
        setVisible(false);
        setInfo(null);
        refresh();
      } catch (e) {
        // handled by interceptor
      }
    },
    [mode, info, refresh]
  );

  const handleAssignOk = useCallback(
    async (roleId: string, menuIds: (string | number)[]) => {
      try {
        const ids = menuIds.map((m) => (typeof m === 'string' ? parseInt(m, 10) : m)).filter((n) => !isNaN(n));
        await api.settings.roleAssignMenus({ roleId, menuIds: ids });
        setAssignVisible(false);
        setInfo(null);
        refresh();
      } catch (e) {
        // handled by interceptor
      }
    },
    [refresh]
  );

  const columnsData = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
      { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 120 },
      { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode', width: 120 },
      { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (v: 0 | 1) => <Tag color={v === 1 ? 'green' : 'default'}>{statusLabelMap[v]}</Tag>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
        render: (t: string) => (t ? formatDate(t) : '-'),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 140,
        render: (_: any, row: RoleItem) => (
          <>
            <Button type="link" size="small" onClick={() => openAssign(row)}>
              分配菜单
            </Button>
            <Button type="link" size="small" onClick={() => openEdit(row)}>
              编辑
            </Button>
          </>
        ),
      },
    ],
    [openEdit, openAssign]
  );

  const [columns, setColumns] = useState<any>(columnsData);
  useEffect(() => {
    setColumns(columnsData);
  }, [columnsData]);

  return {
    dataSource,
    loading,
    total,
    searchParams,
    columns,
    setColumns,
    visible,
    assignVisible,
    mode,
    info,
    statusOptions,
    menuTree,
    roleMenuIds,
    formInitialValues: {},
    handleSearch,
    handleTableChange,
    openAdd,
    handleModalOk,
    handleModalCancel: () => {
      setVisible(false);
      setInfo(null);
    },
    openAssign,
    handleAssignOk,
    handleAssignCancel: () => {
      setAssignVisible(false);
      setInfo(null);
    },
  };
};
