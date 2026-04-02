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
      {/* 与用户/角色列表共用 Tables 的白底容器与表格边框样式，避免页面背景透出不一致 */}
      <div className="tables-component">
        <div className="mgb10 menu-toolbar">
          <Button type="primary" onClick={openAdd}>新增菜单</Button>
        </div>
        <div className="tables-con">
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
        </div>
      </div>
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
