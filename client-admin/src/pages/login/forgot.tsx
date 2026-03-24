import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './index.less';
import api from '@/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 调用后端忘记密码接口，后端负责发送重置邮件
      const res: any = await api.user.forgetPassword(values);
      if (res?.code === 200) {
        message.success('邮件已发送，请前往邮箱查看重置链接');
        navigate('/login');
      } else {
        message.error(res?.message || '发送失败，请稍后重试');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      message.error('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">忘记密码</div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}>
            <Input placeholder="请输入注册邮箱" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>发送重置邮件</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login">返回登录</Link>
        </div>
      </div>
    </div>
  );
}

