import { Form, Input, Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

export type SearchFormProps = {
  statusOptions: DefaultOptionType[];
  roleOptions: DefaultOptionType[];
};

export function SearchForm(props: SearchFormProps) {
  const { statusOptions, roleOptions } = props;

  return (
    <>
      <Form.Item label="" name="keyword">
        <Input placeholder="账号/姓名" style={{ width: 160 }} allowClear />
      </Form.Item>
      <Form.Item label="" name="roleId">
        <Select placeholder="角色" style={{ width: 140 }} allowClear options={roleOptions} />
      </Form.Item>
      <Form.Item label="" name="status">
        <Select placeholder="状态" style={{ width: 100 }} allowClear options={statusOptions} />
      </Form.Item>
    </>
  );
}
