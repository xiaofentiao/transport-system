import { Form, Input, Modal, Select } from 'antd';
import type { RoleItem } from '../types';

export type EditModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  info: RoleItem | null;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function EditModal(props: EditModalProps) {
  const { visible, mode, info, onOk, onCancel } = props;
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
      title={mode === 'add' ? '新增角色' : '编辑角色'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open && info && mode === 'edit') {
          form.setFieldsValue({
            roleName: info.roleName,
            roleCode: info.roleCode,
            description: info.description,
            status: info.status,
          });
        } else if (open && mode === 'add') {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
        <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item name="roleCode" label="角色编码" rules={[{ required: true }]}>
          <Input placeholder="如 ADMIN" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
