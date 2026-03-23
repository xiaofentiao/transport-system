import { Modal, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useCallback, useEffect, useState } from 'react';
import type { MenuItem } from '../../menu/types';

export type AssignMenuModalProps = {
  visible: boolean;
  roleId: string | null;
  roleName: string;
  menuTree: MenuItem[];
  checkedKeys: (string | number)[];
  onOk: (roleId: string, menuIds: (string | number)[]) => void;
  onCancel: () => void;
};

function toTreeData(items: MenuItem[]): DataNode[] {
  return items.map((m) => ({
    key: String(m.id),
    title: m.menuName,
    children: m.children?.length ? toTreeData(m.children) : undefined,
  }));
}

export function AssignMenuModal(props: AssignMenuModalProps) {
  const { visible, roleId, roleName, menuTree, checkedKeys, onOk, onCancel } = props;
  const [checked, setChecked] = useState<React.Key[]>([]);

  useEffect(() => {
    if (visible) setChecked(checkedKeys.map(String));
  }, [visible, checkedKeys]);

  const onCheck = useCallback((keys: React.Key[] | { checked: React.Key[] }) => {
    const arr = Array.isArray(keys) ? keys : keys.checked;
    setChecked(arr);
  }, []);

  const handleOk = () => {
    if (roleId) onOk(roleId, checked.map(String));
    onCancel();
  };

  const treeData = toTreeData(menuTree);

  return (
    <Modal
      title={`分配菜单 - ${roleName}`}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={400}
    >
      <Tree
        checkable
        defaultExpandAll
        treeData={treeData}
        checkedKeys={checked}
        onCheck={onCheck}
      />
    </Modal>
  );
}
