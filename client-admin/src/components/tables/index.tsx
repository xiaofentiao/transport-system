import { Button, Form, FormInstance } from "antd";
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef } from "react";
import './index.less'
import ResizeTable from "../resizable";

function useUpdateEffect(effect: () => void | (() => void), deps: any[]) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, [effect, ...deps]);
}

export interface TablesRef {
  resetForm: () => void;
  form: FormInstance;
}

interface PropsType {
  searchCom: Function,
  tableParams: {
    rowKey?: any;
    dataSource: any[],
    loading: boolean,
    tableChange: Function,
    searchParams: any,
    total: number,
    columns: any[],
    setColumns: Function,
    scroll?: any

  },
  onSearch: Function,
  searchFootArea?: Function,
  operationArea?: Function,
  formProps?: {},
  showSearchArea?: boolean,
  onReset?: Function,
  formParams?: any,
}

function Tables(props: PropsType, ref: Ref<TablesRef>) {
  const [form] = Form.useForm();
  const {
    searchCom,
    tableParams,
    onSearch,
    searchFootArea,
    operationArea,
    formProps,
    showSearchArea = true,
    onReset,
    formParams,
  } = props;




  const onFinish = (values: any) => {
    console.log(values, 'value')
    onSearch(values);
  };

  useUpdateEffect(() => {
    form.setFieldsValue(formParams)
  }, [formParams])
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      form.resetFields();
    },
    form, // 暴露 form 实例给父组件
  }));
  //筛选
  return (
    <div className="tables-component">
      <div className="tables-search">
        {
          showSearchArea
            ? <div className="search-area mgb10">
              <Form
                {...formProps}
                name="basic"
                form={form}
                layout='inline'
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                onReset={(e) => onReset ? onReset(e) : null}
                onFinish={onFinish}
                autoComplete="off"
                className="form-area"
              >
                <div className="form-search-bar">
                  {
                    searchCom()
                  }
                  <Button htmlType="submit" className="mgr10" >
                    查询
                  </Button>
                  <Button htmlType="reset" >
                    重置
                  </Button>
                  {
                    searchFootArea && searchFootArea()
                  }
                </div>
              </Form>
            </div>
            : null
        }
        <div className="flex row-e col-c">
          <div className="flex row-1 col-c">
            {operationArea && operationArea()}
          </div>
        </div>
      </div>
      <div className="tables-con">
        <ResizeTable
          tableProps={{
            rowKey: tableParams?.rowKey ? tableParams?.rowKey : (record: any) => record?.id + Math.random(),
            dataSource: tableParams?.dataSource,
            bordered: true,
            className: 'mgt10',
            loading: tableParams?.loading,
            onChange: tableParams?.tableChange,
            expandIconColumnInde: 1,
            scroll: tableParams?.scroll ?? null,
            indentSize: 10,
            pagination: {
              current: tableParams?.searchParams.pageNum,
              pageSize: tableParams?.searchParams.pageSize,
              total: tableParams?.total,
              showQuickJumper: true,
              showTotal: (total: number) => `共 ${tableParams?.total ?? 0} 条`,
              pageSizeOptions: [10, 20, 50, 100],
              showSizeChanger: true,
              defaultPageSize: 10,
            },
          }}
          // immediately={immediately}
          columns={tableParams?.columns}
          setColumns={tableParams?.setColumns}
        />
      </div>
    </div>
  )
}

export default forwardRef(Tables)
