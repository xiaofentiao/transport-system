export type NumberRange = {
  /** 起始值（包含 0） */
  start?: number;
  /** 结束值（包含 0） */
  end?: number;
};

export interface TemplateListItem {
  /** 列表行主键，建议与后端保持一致 */
  id: string;
  /** 列表展示名称（示例字段） */
  name: string;
  /** 状态（示例枚举） */
  status: 'Enabled' | 'Disabled';
  amount?: number;
  createdAt?: string;
  [key: string]: any;
}

export interface TemplateListSearchParams {
  /** 当前页码（Tables 与 useTable 依赖该字段） */
  pageNum: number;
  /** 每页条数（Tables 与 useTable 依赖该字段） */
  pageSize: number;
  keyword?: string;
  status?: TemplateListItem['status'];
  /**
   * 表单使用的日期区间字段（提交时会转换为 createdAtStart/createdAtEnd）
   * 类型保持为 any[]，以兼容 dayjs/moment 的实例。
   */
  createdAt?: any[];
  createdAtStart?: string;
  createdAtEnd?: string;
  /** 表单使用的范围字段（提交时会转换为 amountStart/amountEnd） */
  amountRange?: NumberRange;
  amountStart?: number;
  amountEnd?: number;
  [key: string]: any;
}
