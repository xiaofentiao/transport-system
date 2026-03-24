import { Modal, Form, Input, Button, message } from 'antd';
import React, { useMemo, useState } from 'react';

import api from '@/api';

export interface ChangePasswordModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  title?: string;
  width?: number;
  okText?: string;
  cancelText?: string;
}

function useControlledOpen(defaultOpen: boolean | undefined) {
  const [inner, setInner] = useState<boolean>(!!defaultOpen);
  const set = (v: boolean) => setInner(v);
  return { inner, set };
}

function passwordStrongEnough(pwd: string) {
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const types = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
  return pwd.length >= 8 && types >= 3;
}

export default function ChangePasswordModal(props: ChangePasswordModalProps) {
  const { open, onOpenChange, onSuccess, title = '修改密码', width = 520, okText = '确认', cancelText = '取消' } = props;
  const ctrl = useControlledOpen(open);
  const realOpen = open === undefined ? ctrl.inner : open;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    if (open === undefined) ctrl.set(v);
  };

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const res: any = await api.user.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      if (res?.code === 200) {
        message.success('密码修改成功');
        setOpen(false);
        form.resetFields();
        onSuccess && onSuccess();
      } else {
        message.error(res?.message || '密码修改失败');
      }
    } catch (e) {
      // 校验失败直接返回
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const extraTip = useMemo(() => (
    <div style={{ color: '#ff4d4f' }}>密码至少8位，且需包含以下任意三类字符：大写字母、小写字母、数字、特殊字符</div>
  ), []);

  return (
    <Modal title={title} open={realOpen} onCancel={handleCancel} footer={null} width={width} destroyOnClose>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}> 
          <Input.Password placeholder="请输入旧密码" allowClear />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                return passwordStrongEnough(value) ? Promise.resolve() : Promise.reject(new Error('密码不符合复杂度要求'));
              },
            },
          ]}
          extra={extraTip}
        >
          <Input.Password placeholder="请输入新密码" allowClear />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                const np = getFieldValue('newPassword');
                if (!value || value === np) return Promise.resolve();
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            })
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" allowClear />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button type="primary" onClick={handleOk} loading={submitting}>{okText}</Button>
        </div>
      </Form>
    </Modal>
  );
}

