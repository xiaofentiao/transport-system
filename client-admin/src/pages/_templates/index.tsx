import { Button } from 'antd'

import Tables from '@/components/tables'
import { DetailModal } from './components/Detail'
import { SearchForm } from './components/SearchForm'
import { useListModule } from './hooks/useListModule'

import './index.less'

/** 列表页模板：搜索区 + 表格 + 详情弹窗 */
export default function ListModuleTemplate() {
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
  } = useListModule()

  return (
    <div className="table-area">
      <Tables
        searchCom={() => <SearchForm statusOptions={statusOptions} />}
        searchFootArea={() => (
          <div className="flex row-e col-c mgl10">
            <Button type="primary" htmlType="submit" form="searchForm">
              新增
            </Button>
          </div>
        )}
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
          scroll: { x: 1000 },
        }}
      />
      {visible && <DetailModal visible={visible} action={handleModalAction} info={info} />}
    </div>
  )
}

