import { Button, Table } from 'antd';
import { EditModal } from './components/EditModal';
import { useMenuModule } from './hooks/useMenuModule';
import './index.less';

export default function MenuManage() {
  const {
    treeData,
    loading,
    visible,
    mode,
    info,
    parentOptions,
    columns,
    openAdd,
    handleModalOk,
    handleModalCancel,
  } = useMenuModule();

  return (
    <div className="table-area menu-area">
      <div className="mgb10">
        <Button type="primary" onClick={openAdd}>新增菜单</Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={treeData}
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
          childrenColumnName: 'children',
        }}
      />
      <EditModal
        visible={visible}
        mode={mode}
        info={info}
        parentOptions={parentOptions}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
