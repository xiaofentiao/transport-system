import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import './index.less';
import api from '@/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const onFinish = async (values: any) => {
    if (!token) {
      message.error('重置链接无效或已过期');
      return;
    }
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    try {
      // 携带token与新密码调用后端重置接口
      const res: any = await api.user.resetPassword({ token, password: values.password });
      if (res?.code === 200) {
        message.success('密码重置成功，请使用新密码登录');
        navigate('/login');
      } else {
        message.error(res?.message || '重置失败，请稍后重试');
      }
    } catch (e) {
      message.error('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">重置密码</div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="password" label="新密码" rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '至少6位字符' }]}>
            <Input.Password placeholder="请输入新密码" allowClear />
          </Form.Item>
          <Form.Item name="confirmPassword" label="重复新密码" rules={[{ required: true, message: '请再次输入新密码' }]}>
            <Input.Password placeholder="请再次输入新密码" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>重置密码</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login">返回登录</Link>
        </div>
      </div>
    </div>
  );
}

