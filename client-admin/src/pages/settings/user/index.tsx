import { Button } from 'antd';
import Tables from '@/components/tables';
import { EditModal } from './components/EditModal';
import { SearchForm } from './components/SearchForm';
import { useUserModule } from './hooks/useUserModule';
import './index.less';

export default function UserManage() {
  const {
    dataSource,
    loading,
    total,
    searchParams,
    columns,
    setColumns,
    visible,
    mode,
    info,
    statusOptions,
    roleOptions,
    formInitialValues,
    handleSearch,
    handleTableChange,
    openAdd,
    handleModalOk,
    handleModalCancel,
  } = useUserModule();

  const searchFootArea = () => (
    <div className="flex row-e col-c mgl10">
      <Button type="primary" onClick={openAdd}>新增</Button>
    </div>
  );

  return (
    <div className="table-area">
      <Tables
        searchCom={() => <SearchForm statusOptions={statusOptions} roleOptions={roleOptions} />}
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
        roleOptions={roleOptions}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
