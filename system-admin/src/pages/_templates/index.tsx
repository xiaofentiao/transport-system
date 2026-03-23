import Tables from '@/components/tables';
import './index.less';
import { SearchForm } from './components/SearchForm';
import { useListModule } from './hooks/useListModule';
import { Button } from 'antd';
import { DetailModal } from './components/Detail';

export default function ListModuleTemplate() {
  // - 组件组合（SearchForm / Tables / DetailModal）
  // - 将 Hook 暴露的数据与事件回调透传到 Tables
  const {
    dataSource,
    loading,
    total,
    searchParams,
    visible,
    info,
    columns,
    setColumns,
    statusOptions,
    formInitialValues,
    handleSearch,
    handleTableChange,
    handleModalAction,
  } = useListModule();

  // 额外的搜索区尾部插槽：用于放置“导出/新增”等非表单字段。
  // 注意：Tables 内部已内置 Search/Clear 按钮，这里通常放业务扩展按钮即可。
  const searchFootArea = () => {
    return (
      <div className="flex row-e col-c mgl10">
        <Button type="primary" htmlType="submit" form="searchForm">
          新增
        </Button>
      </div>
    );
  };

  return (
    <div className="table-area">
      <Tables
        searchCom={() => <SearchForm statusOptions={statusOptions} />}
        searchFootArea={searchFootArea}
        showSearchArea={true}
        onSearch={handleSearch}
        formProps={{ initialValues: formInitialValues }}
        operationArea={undefined}
        tableParams={{
          dataSource,
          loading,
          searchParams,
          total,
          columns,
          setColumns,
          tableChange: handleTableChange,
          scroll: { x: 1000 },
        }}
      />
      {visible && <DetailModal visible={visible} action={handleModalAction} info={info} />}
    </div>
  );
}

