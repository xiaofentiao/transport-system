import { Form, Input, Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

export type SearchFormProps = {
  statusOptions: DefaultOptionType[];
};

export function SearchForm(props: SearchFormProps) {
  const { statusOptions } = props;

  return (
    <>
      <Form.Item label="" name="keyword">
        <Input placeholder="角色名称/编码" style={{ width: 160 }} allowClear />
      </Form.Item>
      <Form.Item label="" name="status">
        <Select placeholder="状态" style={{ width: 100 }} allowClear options={statusOptions} />
      </Form.Item>
    </>
  );
}
