import { Form, Input, InputNumber, Modal, Select } from 'antd';
import type { MenuItem } from '../types';

const MENU_TYPE_OPTIONS = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
];

export type EditModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  info: MenuItem | null;
  parentOptions: { label: string; value: number }[];
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function EditModal(props: EditModalProps) {
  const { visible, mode, info, parentOptions, onOk, onCancel } = props;
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
      title={mode === 'add' ? '新增菜单' : '编辑菜单'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open && info && mode === 'edit') {
          form.setFieldsValue({
            parentId: info.parentId,
            menuName: info.menuName,
            path: info.path,
            icon: info.icon,
            sort: info.sort ?? 0,
            menuType: info.menuType,
            status: info.status,
          });
        } else if (open && mode === 'add') {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ parentId: 0, sort: 0, menuType: 2, status: 1 }}>
        <Form.Item name="parentId" label="父菜单">
          <Select placeholder="根菜单" allowClear options={[{ label: '根菜单', value: 0 }, ...parentOptions]} />
        </Form.Item>
        <Form.Item name="menuName" label="菜单名称" rules={[{ required: true }]}>
          <Input placeholder="请输入菜单名称" />
        </Form.Item>
        <Form.Item name="path" label="路由路径">
          <Input placeholder="如 /settings/user" />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Input placeholder="如 fa-cogs" />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="menuType" label="类型" rules={[{ required: true }]}>
          <Select options={MENU_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
