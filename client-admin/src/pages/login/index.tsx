import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.less';
import api from '@/api';
import { LOCAL_KEYS } from '@/type/local_keys_enum';
import storage from '@/utils/storage';

function arrayBufferToBase64(buffer: ArrayBuffer, mime = 'image/png') {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:${mime};base64,${window.btoa(binary)}`;
}

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaSrc, setCaptchaSrc] = useState<string>('');

  const fetchCaptcha = async () => {
    try {
      const res = await api.user.captcha({}, { responseType: 'arraybuffer' });
      const img = arrayBufferToBase64(res);
      setCaptchaSrc(img);
    } catch (e) {
      message.error('验证码加载失败');
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await api.user.loginIn(values, { loading: true, loadingText: '登录中...' });
      if (res?.code === 200) {
        const token = res?.result?.token ?? res?.data?.token;
        if (!token) {
          message.error('登录响应缺少令牌');
          return;
        }
        storage.setCache(LOCAL_KEYS.TOKEN, token);
        if (res?.result?.userInfo) {
          storage.setCache(LOCAL_KEYS.USER_INFO, res.result.userInfo);
        }
        navigate('/');
      } else {
        message.error(res?.message ?? '登录失败');
        fetchCaptcha();
      }
    } catch (e: any) {
      message.error('登录请求出错');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const onRefreshCaptcha = () => {
    fetchCaptcha();
  };

  const ShipIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.83 4-2 .98 1.17 2.4 2 4 2s3.02-.83 4-2c.98 1.17 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78-.12-.24-.32-.42-.57-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.25.08-.45.26-.57.5-.12.24-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
    </svg>
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">{ShipIcon}</div>
          <h1 className="login-title">船运管理系统</h1>
          <p className="login-subtitle">物料运输 · 系统登录</p>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}> 
            <Input placeholder="请输入账号" allowClear />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="请输入密码" allowClear />
          </Form.Item>
          <Form.Item name="captcha" label="验证码" rules={[{ required: true, message: '请输入验证码' }]}> 
            <Input placeholder="请输入验证码" allowClear suffix={
              <img alt="captcha" src={captchaSrc} className="captcha-img" onClick={onRefreshCaptcha} />
            } />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
          </Form.Item>
        </Form>
        <a className="login-forgot" onClick={() => navigate('/login/forgot')}>
          忘记密码？
        </a>
      </div>
    </div>
  );
}
