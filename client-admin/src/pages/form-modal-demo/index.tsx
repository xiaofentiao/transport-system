import { useState } from 'react';
import { Button, Input, Select, DatePicker, InputNumber, Switch, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

import { FormModal } from '@/components/formModal';
import type { FormItemConfig } from '@/components/formModal';
import './index.less';

const { RangePicker } = DatePicker;

const FormModalDemo = () => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');

  // 定义表单配置
  const formConfig: FormItemConfig[][] = [
    // 一行两个表单项
    [
      {
        name: 'username',
        label: '用户名',
        component: <Input placeholder="请输入用户名" />,
        rules: [{ required: true, message: '请输入用户名' }],
        span: 2
      },
      {
        name: 'password',
        label: '密码',
        component: <Input.Password placeholder="请输入密码" />,
        rules: [{ required: true, message: '请输入密码' }],
        span: 2
      }
    ],
    // 一行三个表单项
    [
      {
        name: 'name',
        label: '姓名',
        component: <Input placeholder="请输入姓名" />,
        rules: [{ required: true, message: '请输入姓名' }],
        span: 3
      },
      {
        name: 'age',
        label: '年龄',
        component: <InputNumber placeholder="请输入年龄" min={1} max={120} />,
        span: 3
      },
      {
        name: 'gender',
        label: '性别',
        component: <Select 
          placeholder="请选择性别" 
          options={[
            { label: '男', value: 'male' }, 
            { label: '女', value: 'female' }
          ]} 
        />,
        span: 3
      }
    ],
    // 一行四个表单项
    [
      {
        name: 'email',
        label: '邮箱',
        component: <Input placeholder="请输入邮箱" />,
        rules: [{ type: 'email', message: '请输入正确的邮箱格式' }],
        span: 4
      },
      {
        name: 'phone',
        label: '手机',
        component: <Input placeholder="请输入手机" />,
        rules: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }],
        span: 4
      },
      {
        name: 'department',
        label: '部门',
        component: <Select 
          placeholder="请选择部门" 
          options={[
            { label: '技术部', value: 'tech' },
            { label: '市场部', value: 'market' },
            { label: '财务部', value: 'finance' },
            { label: '人力资源部', value: 'hr' }
          ]} 
        />,
        span: 4
      },
      {
        name: 'position',
        label: '职位',
        component: <Input placeholder="请输入职位" />,
        span: 4
      }
    ],
    // 单个表单项（默认一行）
    [
      {
        name: 'address',
        label: '地址',
        component: <Input.TextArea placeholder="请输入地址" rows={3} />,
        span: 1
      }
    ],
    // 混合配置
    [
      {
        name: 'startDate',
        label: '开始日期',
        component: <DatePicker style={{ width: '100%' }} />,
        span: 3
      },
      {
        name: 'endDate',
        label: '结束日期',
        component: <DatePicker style={{ width: '100%' }} />,
        span: 3
      },
      {
        name: 'status',
        label: '状态',
        component: <Switch checkedChildren="启用" unCheckedChildren="禁用" />,
        initialValue: true,
        span: 3
      }
    ],
    // 上传组件
    [
      {
        name: 'avatar',
        label: '头像',
        component: <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={true}
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>,
        span: 3
      },
      {
        name: 'files',
        label: '文件上传',
        component: <Upload
          name="files"
          action="#"
          listType="text"
          showUploadList={true}
          maxCount={3}
          // 移除icon属性，Upload组件不支持该属性，按钮中已包含图标
        >
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>,
        span: 3
      }
    ]
  ];

  // 处理表单提交
  const handleOk = async (values: any) => {
    console.log('表单提交值:', values);
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVisible(false);
    alert('表单提交成功！');
  };

  return (
    <div className="form-modal-demo">
      <div className="demo-header">
        <h1>表单弹窗组件演示</h1>
        <p>支持一行配置2-4个表单项，灵活的表单布局</p>
      </div>

      <div className="demo-buttons">
        <Button 
          type="primary" 
          size="large"
          onClick={() => {
            setMode('add');
            setVisible(true);
          }}
        >
          新增用户（演示）
        </Button>
        <Button 
          size="large"
          onClick={() => {
            setMode('edit');
            setVisible(true);
          }}
        >
          编辑用户（演示）
        </Button>
        <Button 
          type="default" 
          size="large"
          onClick={() => {
            setMode('view');
            setVisible(true);
          }}
        >
          查看详情（演示）
        </Button>
      </div>

      <div className="demo-info">
        <h3>配置说明</h3>
        <ul>
          <li>使用 <code>span</code> 属性控制一行显示的表单项数量（1-4）</li>
          <li>支持各种 Ant Design 表单组件：Input、Select、DatePicker、InputNumber、Switch 等</li>
          <li>支持图片上传（单张）和文件上传（多张）功能</li>
          <li>内置表单验证功能</li>
          <li>支持三种模式：新增（add）、编辑（edit）、详情（view）</li>
          <li>详情模式下，所有表单控件自动转换为文本展示</li>
          <li>详情模式下，只显示关闭按钮，隐藏确定按钮</li>
          <li>可自定义模态框和表单属性</li>
        </ul>
      </div>

      {/* 表单弹窗组件 */}
      <FormModal
        visible={visible}
        mode={mode}
        title={mode === 'add' ? '新增用户' : '编辑用户'}
        formConfig={formConfig}
        initialValues={mode === 'edit' ? {
          username: 'test_user',
          name: '测试用户',
          age: 25,
          gender: 'male',
          department: 'tech',
          position: '前端工程师',
          status: true,
          avatar: [{
            uid: '1',
            name: 'avatar.jpg',
            status: 'done',
            url: 'https://console.enterprise.trae.cn/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square_hd'
          }],
          files: [
            {
              uid: '2',
              name: 'resume.pdf',
              status: 'done',
              url: '#'
            },
            {
              uid: '3',
              name: 'certificate.jpg',
              status: 'done',
              url: '#'
            }
          ]
        } : {}}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        modalProps={{
          width: 900,
          okText: mode === 'add' ? '新增' : '保存',
          cancelText: '取消'
        }}
      />
    </div>
  );
};

export default FormModalDemo;
