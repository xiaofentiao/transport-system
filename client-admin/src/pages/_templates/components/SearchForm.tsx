import { DatePicker, Form, Input, Select } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'

const { RangePicker } = DatePicker

export type SearchFormProps = {
  /**
   * 下拉选项由外层 Hook 统一提供：
   * - 避免组件内部写死文案
   * - 便于做多语言与权限控制
   */
  statusOptions: DefaultOptionType[];
};

/**
 * 搜索表单片段：
 * - 只负责渲染 Form.Item，不需要自己包 Form
 * - 提交/重置由外层 Tables 统一处理
 */
export function SearchForm(props: SearchFormProps) {
  const { statusOptions } = props

  return (
    <>
      <Form.Item label="" name="keyword">
        <Input placeholder="名称" style={{ width: 200 }} allowClear />
      </Form.Item>
      <Form.Item label="" name="status">
        <Select
          placeholder="状态"
          style={{ width: 160, textAlign: 'left' }}
          allowClear
          options={statusOptions}
        />
      </Form.Item>
      <Form.Item label="" name="createdAt">
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={['开始时间', '结束时间']}
          style={{ width: 340 }}
        />
      </Form.Item>
    </>
  )
}
