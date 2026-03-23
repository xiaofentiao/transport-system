import { Descriptions, Modal } from 'antd';
import { useMemo } from 'react';
import type { TemplateListItem } from '../types/index';

type Props = {
  visible: boolean;
  info?: TemplateListItem | null;
  /**
   * 与列表页约定的弹窗动作回调：
   * - cancel：关闭
   * - success：关闭并触发列表刷新
   */
  action: (type: 'cancel' | 'success') => void;
};

/**
 * 详情弹窗（模板版）：
 * - 演示“行操作 -> 打开弹窗 -> 回调刷新”的链路
 * - 业务接入时可替换为编辑表单、详情卡片等更复杂结构
 */
export function DetailModal(props: Props) {
  const { visible, info, action } = props;

  const items = useMemo(() => {
    const row = info ?? ({} as TemplateListItem);
    return [
      { label: 'ID', value: row.id ?? '-' },
      { label: '名称', value: row.name ?? '-' },
      { label: '状态', value: row.status ?? '-' },
    ];
  }, [info]);

  return (
    <Modal
      width={720}
      open={visible}
      onCancel={() => action('cancel')}
      onOk={() => action('success')}
      title="查看"
    >
      <Descriptions bordered size="small" column={2}>
        {items.map((it) => (
          <Descriptions.Item key={String(it.label)} label={it.label}>
            {it.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  );
}
