import { Form, Modal, Button, Row, Col } from 'antd';
import type { FormProps, FormInstance, Rule } from 'antd/es/form';
import type { ModalProps } from 'antd/es/modal';
import type { ReactNode } from 'react';

/**
 * 通用表单弹窗组件
 * 支持一行配置多个表单项（2-4个）
 * 
 * @example
 * ```tsx
 * import { Input, Select } from 'antd';
 * import { FormModal } from '@/components/formModal';
 * 
 * const App = () => {
 *   const [visible, setVisible] = useState(false);
 *   const [mode, setMode] = useState<'add' | 'edit'>('add');
 *   
 *   const formConfig = [
 *     // 一行两个表单项
 *     [
 *       {
 *         name: 'username',
 *         label: '用户名',
 *         component: <Input placeholder="请输入用户名" />,
 *         rules: [{ required: true, message: '请输入用户名' }],
 *         span: 2
 *       },
 *       {
 *         name: 'password',
 *         label: '密码',
 *         component: <Input.Password placeholder="请输入密码" />,
 *         rules: [{ required: true, message: '请输入密码' }],
 *         span: 2
 *       }
 *     ],
 *     // 一行三个表单项
 *     [
 *       {
 *         name: 'name',
 *         label: '姓名',
 *         component: <Input placeholder="请输入姓名" />,
 *         span: 3
 *       },
 *       {
 *         name: 'age',
 *         label: '年龄',
 *         component: <Input type="number" placeholder="请输入年龄" />,
 *         span: 3
 *       },
 *       {
 *         name: 'gender',
 *         label: '性别',
 *         component: <Select options={[{ label: '男', value: 'male' }, { label: '女', value: 'female' }]} />,
 *         span: 3
 *       }
 *     ],
 *     // 一行四个表单项
 *     [
 *       {
 *         name: 'email',
 *         label: '邮箱',
 *         component: <Input placeholder="请输入邮箱" />,
 *         span: 4
 *       },
 *       {
 *         name: 'phone',
 *         label: '手机',
 *         component: <Input placeholder="请输入手机" />,
 *         span: 4
 *       },
 *       {
 *         name: 'address',
 *         label: '地址',
 *         component: <Input placeholder="请输入地址" />,
 *         span: 4
 *       },
 *       {
 *         name: 'zip',
 *         label: '邮编',
 *         component: <Input placeholder="请输入邮编" />,
 *         span: 4
 *       }
 *     ]
 *   ];
 *   
 *   const handleOk = (values: any) => {
 *     console.log('表单值:', values);
 *     setVisible(false);
 *   };
 *   
 *   return (
 *     <div>
 *       <Button type="primary" onClick={() => {
 *         setMode('add');
 *         setVisible(true);
 *       }}>
 *         新增
 *       </Button>
 *       <Button onClick={() => {
 *         setMode('edit');
 *         setVisible(true);
 *       }}>
 *         编辑
 *       </Button>
 *       
 *       <FormModal
 *         visible={visible}
 *         mode={mode}
 *         title={mode === 'add' ? '新增用户' : '编辑用户'}
 *         formConfig={formConfig}
 *         initialValues={mode === 'edit' ? { username: 'test', name: '测试用户' } : {}}
 *         onOk={handleOk}
 *         onCancel={() => setVisible(false)}
 *         modalProps={{ width: 800 }}
 *       />
 *     </div>
 *   );
 * };
 * ```
 */

export type FormItemConfig = {
  name: string;
  label: string;
  component: ReactNode;
  rules?: Rule[];
  span?: 1 | 2 | 3 | 4;
  initialValue?: any;
};

export type FormRowConfig = FormItemConfig[];

export type FormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit' | 'view';
  title: string;
  formConfig: FormRowConfig[];
  initialValues?: Record<string, any>;
  onOk?: (values: any) => Promise<void> | void;
  onCancel: () => void;
  modalProps?: Omit<ModalProps, 'open' | 'onOk' | 'onCancel' | 'title'>;
  formProps?: Omit<FormProps, 'form' | 'onFinish'>;
};

export function FormModal(props: FormModalProps) {
  const { 
    visible, 
    mode, 
    title, 
    formConfig, 
    initialValues = {}, 
    onOk, 
    onCancel, 
    modalProps = {},
    formProps = {}
  } = props;

  // 详情模式下隐藏确定按钮
  const isViewMode = mode === 'view';
  const modalButtonsConfig = {
    footer: isViewMode ? [
      <Button key="close" onClick={onCancel}>
        关闭
      </Button>
    ] : undefined,
    ...modalProps
  };
  
  const [form] = Form.useForm<Record<string, any>>();

  const handleOk = async () => {
    const values = await form.validateFields();
    if (onOk) {
      await onOk(values);
    }
    form.resetFields();
  };

  // 渲染表单组件（详情模式下显示为文本）
  const renderFormComponent = (item: FormItemConfig, value: any) => {
    if (isViewMode) {
      return <div style={{ padding: '6px 0', color: 'rgba(0, 0, 0, 0.88)' }}>
        {value !== undefined && value !== null ? String(value) : '-'}
      </div>;
    }
    return item.component;
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderFormItems = () => {
    return formConfig.map((row, rowIndex) => (
      <Row key={rowIndex} gutter={[16, 16]}>
        {row.map((item, itemIndex) => {
          const span = item.span || 1;
          const colSpan = Math.floor(24 / span);
          // 获取当前字段值用于详情模式显示
          const fieldValue = form.getFieldValue(item.name);
          
          return (
            <Col key={item.name || itemIndex} span={colSpan}>
              <Form.Item
                name={item.name}
                label={item.label}
                rules={isViewMode ? [] : item.rules}
                initialValue={item.initialValue}
                // 详情模式下禁用表单控件
                getValueFromEvent={() => fieldValue}
              >
                {renderFormComponent(item, fieldValue)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    ));
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={isViewMode ? undefined : handleOk}
      onCancel={handleCancel}
      destroyOnHidden
      {...modalButtonsConfig}
      afterOpenChange={(open) => {
        if (open) {
          form.setFieldsValue(initialValues);
        }
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        {...formProps}
        disabled={isViewMode}
      >
        {renderFormItems()}
      </Form>
    </Modal>
  );
}
