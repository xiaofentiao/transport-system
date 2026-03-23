import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import type { MenuItem } from '../types';
import api from '@/api';

const MENU_TYPE_MAP: Record<number, string> = {
  1: '目录',
  2: '菜单',
  3: '按钮',
};

function flattenMenu(items: MenuItem[], parentId = 0): { menu: MenuItem; parentId: number }[] {
  const result: { menu: MenuItem; parentId: number }[] = [];
  for (const m of items) {
    result.push({ menu: m, parentId });
    if (m.children?.length) {
      result.push(...flattenMenu(m.children, Number(m.id)));
    }
  }
  return result;
}

export const useMenuModule = () => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [info, setInfo] = useState<MenuItem | null>(null);
  const [treeData, setTreeData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.settings.menuTree({});
      const data = res?.data ?? res?.result ?? [];
      setTreeData(Array.isArray(data) ? data : []);
    } catch {
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const openAdd = useCallback((parentId?: number) => {
    setMode('add');
    setInfo(parentId ? { id: '', parentId, menuName: '', menuType: 2, status: 1 } as MenuItem : null);
    setVisible(true);
  }, []);

  const openEdit = useCallback((row: MenuItem) => {
    setMode('edit');
    setInfo(row);
    setVisible(true);
  }, []);

  const handleDelete = useCallback(
    async (row: MenuItem) => {
      try {
        await api.settings.menuDelete({ id: row.id });
        fetchTree();
      } catch (e) {
        // handled by interceptor
      }
    },
    [fetchTree]
  );

  const handleModalOk = useCallback(
    async (values: any) => {
      try {
        if (mode === 'add') {
          await api.settings.menuAdd(values);
        } else if (info?.id) {
          await api.settings.menuUpdate({ ...values, id: info.id });
        }
        setVisible(false);
        setInfo(null);
        fetchTree();
      } catch (e) {
        // handled by interceptor
      }
    },
    [mode, info, fetchTree]
  );

  const flatList = useMemo(() => flattenMenu(treeData), [treeData]);
  const parentOptions = useMemo(
    () =>
      flatList
        .filter(({ menu }) => menu.menuType === 1)
        .map(({ menu }) => ({ label: menu.menuName, value: Number(menu.id) })),
    [flatList]
  );

  const columns = useMemo(
    () => [
      { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 160 },
      { title: '路由', dataIndex: 'path', key: 'path', width: 160, render: (v: string) => v ?? '-' },
      { title: '图标', dataIndex: 'icon', key: 'icon', width: 100, render: (v: string) => v ?? '-' },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
      {
        title: '类型',
        dataIndex: 'menuType',
        key: 'menuType',
        width: 80,
        render: (v: number) => <Tag>{MENU_TYPE_MAP[v] ?? '-'}</Tag>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (v: 0 | 1) => <Tag color={v === 1 ? 'green' : 'default'}>{v === 1 ? '启用' : '禁用'}</Tag>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 180,
        render: (_: any, row: MenuItem) => (
          <Space>
            <Button type="link" size="small" onClick={() => openAdd(Number(row.id))}>
              新增子菜单
            </Button>
            <Button type="link" size="small" onClick={() => openEdit(row)}>
              编辑
            </Button>
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(row)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [openAdd, openEdit, handleDelete]
  );

  return {
    treeData,
    loading,
    visible,
    mode,
    info,
    parentOptions,
    columns,
    fetchTree,
    openAdd: () => openAdd(0),
    handleModalOk,
    handleModalCancel: () => {
      setVisible(false);
      setInfo(null);
    },
  };
};
