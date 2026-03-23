import { useState, useCallback, useEffect } from 'react';
import { ResponseConfig } from '@/type/common';

/**
 * 通用表格 Hook 参数接口
 */
interface UseTableProps<T, P> {
  /** 获取列表的 API 方法 */
  apiReq: (params: P) => Promise<ResponseConfig>;
  /** 初始查询参数 */
  initialParams?: Partial<P>;
  /** 是否手动触发首次加载，默认为 false（自动加载） */
  manual?: boolean;
  /** 请求前的参数处理回调 */
  beforeQuery?: (params: P) => P;
  /** 自定义响应数据处理回调 */
  processData?: (res: ResponseConfig) => { dataSource: T[]; total: number } | undefined;
}

/**
 * 通用表格 Hook
 * 封装了分页、搜索、加载状态等通用逻辑
 */
export const useTable = <T, P extends { pageNum?: number; pageSize?: number }>(
  props: UseTableProps<T, P>
) => {
  const { apiReq, initialParams, manual = false, beforeQuery, processData } = props;

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState<P>({
    pageNum: 1,
    pageSize: 10,
    ...initialParams,
  } as P);

  // 表格数据
  const [dataSource, setDataSource] = useState<T[]>([]);
  // 总数据量
  const [total, setTotal] = useState(0);
  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 获取列表数据
   */
  const getListData = useCallback(
    async (params?: Partial<P>) => {
      setLoading(true);
      // 合并当前参数和新参数
      let finalParams = { ...searchParams, ...params };
      
      // 如果有预处理函数，则执行
      if (beforeQuery) {
        finalParams = beforeQuery(finalParams);
      }

      try {
        const res = await apiReq(finalParams);
        
        // 如果有自定义数据处理，则使用自定义处理逻辑
        if (processData) {
          const result = processData(res);
          if (result) {
            setDataSource(result.dataSource);
            setTotal(result.total);
          }
        } else {
          // 默认处理逻辑
          if (res.code === 200) {
            setDataSource(res?.result?.records ?? res?.result ?? []);
            setTotal(res.total ?? res?.result?.total ?? 0);
          }
        }
      } catch (error) {
        console.error('Fetch list failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [apiReq, searchParams, beforeQuery, processData]
  );

  // 初始化加载
  useEffect(() => {
    if (!manual) {
      getListData();
    }
  }, []); 

  /**
   * 搜索处理
   * 重置页码为 1
   */
  const handleSearch = useCallback((values: any) => {
    const queryObj = { ...searchParams, ...values, pageNum: 1 };
    setSearchParams(queryObj);
    getListData(queryObj);
  }, [searchParams, getListData]);

  /**
   * 表格分页/排序变化处理
   */
  const handleTableChange = useCallback(
    ({ current, pageSize }: any) => {
      const queryObj = { pageNum: current, pageSize: pageSize } as unknown as Partial<P>;
      setSearchParams((prev) => ({ ...prev, ...queryObj }));
      getListData(queryObj);
    },
    [getListData]
  );
  
  /**
   * 刷新当前页
   */
  const refresh = useCallback(() => {
    getListData();
  }, [getListData]);

  return {
    dataSource,
    total,
    loading,
    searchParams,
    setSearchParams,
    getListData,
    handleSearch,
    handleTableChange,
    refresh,
  };
};
