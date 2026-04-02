import { Form, Input, Modal, Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import type { UserItem } from '../types';

export type EditModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  info: UserItem | null;
  roleOptions: DefaultOptionType[];
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function EditModal(props: EditModalProps) {
  const { visible, mode, info, roleOptions, onOk, onCancel } = props;
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'add' ? '新增用户' : '编辑用户'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open && info && mode === 'edit') {
          form.setFieldsValue({
            realName: info.realName,
            phone: info.phone,
            email: info.email,
            roleId: info.roleId,
            status: info.status,
          });
        } else if (open && mode === 'add') {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
        {mode === 'add' && (
          <Form.Item name="username" label="账号" rules={[{ required: true }]}>
            <Input placeholder="请输入账号" />
          </Form.Item>
        )}
        {mode === 'add' && (
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item name="realName" label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="roleId" label="角色">
          <Select placeholder="请选择角色" allowClear options={roleOptions} />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
