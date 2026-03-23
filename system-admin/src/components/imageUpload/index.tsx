import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useMemo, useState } from 'react';
import './index.less';

export interface ImageUploadProps {
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  request: (file: File) => Promise<{ url: string } | string>;
  multiple?: boolean;
  maxCount?: number;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

function toUploadFile(url: string, uid?: string): UploadFile {
  return { uid: uid ?? `${Date.now()}`, name: url.split('/').pop() ?? 'image', status: 'done', url } as UploadFile;
}

export default function ImageUpload(props: ImageUploadProps) {
  const { value, onChange, request, multiple = false, maxCount = multiple ? 9 : 1, accept = 'image/*', maxSizeMB = 5, disabled } = props;
  const realMaxCount = multiple ? maxCount : 1;
  const initialList: UploadFile[] = useMemo(() => {
    if (!value) return [];
    const arr = Array.isArray(value) ? value : [value];
    const useArr = multiple ? arr : arr.slice(0, 1);
    return useArr.map((u, idx) => toUploadFile(u, `${idx}`));
  }, [value, multiple]);
  const [fileList, setFileList] = useState<UploadFile[]>(initialList);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const triggerChange = (list: UploadFile[]) => {
    const urls = list.filter((f) => f.status === 'done' && (f.url || (f.response && (f.response as any).url))).map((f) => f.url ?? (f.response as any)?.url);
    onChange?.(multiple ? urls : urls[0] ?? '');
  };

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const isImg = file.type.startsWith('image/');
    if (!isImg) {
      message.error('仅支持上传图片');
      return Upload.LIST_IGNORE;
    }
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      message.error(`图片大小不能超过${maxSizeMB}MB`);
      return Upload.LIST_IGNORE;
    }
    try {
      setUploading(true);
      const res = await request(file as File);
      const url = typeof res === 'string' ? res : res?.url;
      if (!url) {
        message.error('上传失败：接口未返回URL');
        setUploading(false);
        return Upload.LIST_IGNORE;
      }
      const next = multiple ? [...fileList, toUploadFile(url)] : [toUploadFile(url)];
      setFileList(next);
      triggerChange(next);
    } catch (e) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
    return Upload.LIST_IGNORE;
  };

  const onPreview = async (file: UploadFile) => {
    setPreviewImage(file.url ?? (file.thumbUrl as string));
    setPreviewOpen(true);
  };

  const onRemove = (file: UploadFile) => {
    const next = fileList.filter((f) => f.uid !== file.uid);
    setFileList(next);
    triggerChange(next);
  };

  return (
    <div className="image-upload">
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
        onRemove={onRemove}
        multiple={multiple}
        accept={accept}
        showUploadList={{ showRemoveIcon: !disabled, showPreviewIcon: true }}
      >
        {fileList.length >= realMaxCount ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploading ? '上传中...' : '上传'}</div>
          </div>
        )}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
