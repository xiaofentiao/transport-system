import { Button } from 'antd';
import Tables from '@/components/tables';
import { AssignMenuModal } from './components/AssignMenuModal';
import { EditModal } from './components/EditModal';
import { SearchForm } from './components/SearchForm';
import { useRoleModule } from './hooks/useRoleModule';
import './index.less';

export default function RoleManage() {
  const {
    dataSource,
    loading,
    total,
    searchParams,
    columns,
    setColumns,
    visible,
    assignVisible,
    mode,
    info,
    statusOptions,
    menuTree,
    roleMenuIds,
    formInitialValues,
    handleSearch,
    handleTableChange,
    openAdd,
    handleModalOk,
    handleModalCancel,
    handleAssignOk,
    handleAssignCancel,
  } = useRoleModule();

  const searchFootArea = () => (
    <div className="flex row-e col-c mgl10">
      <Button type="primary" onClick={openAdd}>新增</Button>
    </div>
  );

  return (
    <div className="table-area">
      <Tables
        searchCom={() => <SearchForm statusOptions={statusOptions} />}
        searchFootArea={searchFootArea}
        showSearchArea
        onSearch={handleSearch}
        formProps={{ initialValues: formInitialValues }}
        tableParams={{
          dataSource,
          loading,
          searchParams,
          total,
          columns,
          setColumns,
          tableChange: handleTableChange,
          scroll: { x: 900 },
        }}
      />
      <EditModal
        visible={visible}
        mode={mode}
        info={info}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
      <AssignMenuModal
        visible={assignVisible}
        roleId={info?.id ?? null}
        roleName={info?.roleName ?? ''}
        menuTree={menuTree}
        checkedKeys={roleMenuIds}
        onOk={handleAssignOk}
        onCancel={handleAssignCancel}
      />
    </div>
  );
}
