import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { useTable } from '@/hook/useTable';
import type { ResponseConfig } from '@/type/common';
import { formatDate } from '@/utils';
import type { TemplateListItem, TemplateListSearchParams } from '../types'

/**
 * 过滤仅由空白字符串构成的查询字段，避免误传 "" 给后端。
 */
function omitTrimmedEmptyStrings<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !(typeof v === 'string' && v.trim() === '')),
  ) as T
}

/**
 * 模板用假接口：用于本地演示列表页能力。
 * 业务接入时：替换为真实接口（例如 api.xxx.list），并同步调整 processData 的取值路径。
 */
async function fakeListApi(_params: TemplateListSearchParams): Promise<ResponseConfig> {
  void _params
  return {
    code: 200,
    message: 'ok',
    data: {
      records: [
        {
          id: '1',
          name: 'Demo Item',
          status: 'Enabled',
          amount: 99,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    },
    }
}

/**
 * 通用“搜索 + 表格 + 详情弹窗（可选）”列表页模板 Hook。
 * 职责：
 * - 管理查询参数与分页（基于 useTable）
 * - 处理搜索表单值到接口参数的转换/清洗
 * - 管理列配置与弹窗状态
 */
export const useListModule = () => {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<TemplateListItem | null>(null);

  /**
   * 枚举展示文案统一放在 map 里，便于 Select options / Table Tag 复用。
   */
  const statusLabelMap = useMemo(
    () => ({
      Enabled: '有效',
      Disabled: '无效',
    }),
    []
  );

  const statusOptions: DefaultOptionType[] = useMemo(
    () =>
      (Object.keys(statusLabelMap) as Array<TemplateListItem['status']>).map((k) => ({
        label: statusLabelMap[k],
        value: k,
      })),
    [statusLabelMap]
  );

  const initialParams = useMemo<TemplateListSearchParams>(
    () => ({
      pageNum: 1,
      pageSize: 10,
    }),
    []
  );

  /**
   * 搜索表单默认值：用于 Tables 的 formProps.initialValues。
   * 仅用于“展示默认值”；真正发起请求由 initialParams 决定。
   */
  const formInitialValues = useMemo(() => {
    return {
      status: 'Enabled',
    };
  }, []);

  /**
   * 统一接口响应适配：将后端结构映射为 useTable 需要的 dataSource/total。
   */
  const processData = useCallback((res: ResponseConfig) => {
    return {
      dataSource: res?.data?.records ?? [],
      total: res?.data?.total ?? 0,
    };
  }, []);

  const {
    dataSource,
    loading,
    total,
    searchParams,
    handleSearch: baseHandleSearch,
    handleTableChange,
    refresh,
  } = useTable<TemplateListItem, TemplateListSearchParams>({
    apiReq: fakeListApi,
    processData,
    initialParams,
    manual: false,
  });

  /**
   * 搜索提交：
   * - 统一重置 pageNum=1
   * - 将日期/范围等复杂表单字段转换为后端参数
   * - 过滤空字符串（避免把 "" 传给后端导致误筛选）
   */
  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      const merged = { ...searchParams, pageNum: 1, ...values } as Record<string, unknown>
      baseHandleSearch(omitTrimmedEmptyStrings(merged))
    },
    [baseHandleSearch, searchParams],
  )

  /**
   * 打开详情弹窗：将当前行缓存为 info，供弹窗展示。
   */
  const openDetail = useCallback((row: TemplateListItem) => {
    setInfo(row);
    setVisible(true);
  }, []);

  const columnsData = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 120,
        render: (text: any) => text ?? '-',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
        render: (text: any) => text ?? '-',
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        render: (text: any) => (text ? formatDate(text) : '-'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 140,
        render: (text: TemplateListItem['status']) => (text ? <Tag>{statusLabelMap[text]}</Tag> : '-'),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 140,
        render: (_: any, row: TemplateListItem) => {
          return (
            <Button type="primary" size="small" onClick={() => openDetail(row)}>
              查看
            </Button>
          );
        },
      },
    ],
    [openDetail, statusLabelMap]
  );

  const [columns, setColumns] = useState<any>(columnsData);
  useEffect(() => {
    setColumns(columnsData);
  }, [columnsData]);

  /**
   * 弹窗动作统一出口：
   * - cancel：仅关闭并清理 info
   * - success：关闭并刷新列表（例如保存成功后需要回显最新数据）
   */
  const handleModalAction = useCallback(
    (type: 'cancel' | 'success') => {
      setVisible(false);
      setInfo(null);
      if (type === 'success') {
        refresh();
      }
    },
    [refresh]
  );

  return {
    dataSource,
    loading,
    total,
    searchParams,
    columns,
    setColumns,
    visible,
    info,
    statusOptions,
    formInitialValues,
    handleSearch,
    handleTableChange,
    handleModalAction,
  };
};
