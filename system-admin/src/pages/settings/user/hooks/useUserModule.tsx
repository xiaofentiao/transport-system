import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { useTable } from '@/hook/useTable';
import type { ResponseConfig } from '@/type/common';
import { formatDate } from '@/utils';
import type { UserItem, UserSearchParams } from '../types';
import api from '@/api';

const processData = (res: ResponseConfig) => ({
  dataSource: res?.data?.records ?? res?.result?.records ?? [],
  total: res?.data?.total ?? res?.result?.total ?? 0,
});

export const useUserModule = () => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [info, setInfo] = useState<UserItem | null>(null);
  const [roleOptions, setRoleOptions] = useState<DefaultOptionType[]>([]);

  const statusLabelMap = { 1: '启用', 0: '禁用' };
  const statusOptions: DefaultOptionType[] = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  const initialParams = useMemo<UserSearchParams>(() => ({ pageNum: 1, pageSize: 10 }), []);

  const {
    dataSource,
    loading,
    total,
    searchParams,
    handleSearch: baseHandleSearch,
    handleTableChange,
    refresh,
  } = useTable<UserItem, UserSearchParams>({
    apiReq: api.settings.userList,
    processData,
    initialParams,
    manual: false,
  });

  const fetchRoleOptions = useCallback(async () => {
    try {
      const res = await api.settings.roleList({ pageNum: 1, pageSize: 999 });
      const list = res?.data?.records ?? res?.result?.records ?? [];
      setRoleOptions(list.map((r: any) => ({ label: r.roleName, value: r.id })));
    } catch {
      setRoleOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchRoleOptions();
  }, [fetchRoleOptions]);

  const handleSearch = useCallback(
    (values: any) => {
      const cur = { ...searchParams, pageNum: 1 } as any;
      const merged = { ...cur, ...values };
      const queryObj = Object.fromEntries(
        Object.entries(merged).filter(([_, v]) => v != null && v !== '')
      );
      baseHandleSearch(queryObj);
    },
    [baseHandleSearch, searchParams]
  );

  const openAdd = useCallback(() => {
    setMode('add');
    setInfo(null);
    setVisible(true);
  }, []);

  const openEdit = useCallback((row: UserItem) => {
    setMode('edit');
    setInfo(row);
    setVisible(true);
  }, []);

  const handleModalOk = useCallback(
    async (values: any) => {
      try {
        if (mode === 'add') {
          await api.settings.userAdd(values);
        } else if (info?.id) {
          await api.settings.userUpdate({ ...values, id: info.id });
        }
        setVisible(false);
        setInfo(null);
        refresh();
      } catch (e) {
        // message 由 api 拦截器处理
      }
    },
    [mode, info, refresh]
  );

  const columnsData = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
      { title: '账号', dataIndex: 'username', key: 'username', width: 120 },
      { title: '姓名', dataIndex: 'realName', key: 'realName', width: 100 },
      { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
      { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 100 },
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
        width: 100,
        render: (_: any, row: UserItem) => (
          <Button type="link" size="small" onClick={() => openEdit(row)}>
            编辑
          </Button>
        ),
      },
    ],
    [openEdit]
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
    mode,
    info,
    statusOptions,
    roleOptions,
    formInitialValues: {},
    handleSearch,
    handleTableChange,
    openAdd,
    handleModalOk: handleModalOk,
    handleModalCancel: () => {
      setVisible(false);
      setInfo(null);
    },
  };
};
