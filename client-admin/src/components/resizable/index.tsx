import { Resizable } from 'react-resizable';
import { FC, useEffect } from 'react';
import { Table } from 'antd';
import './index.less';

interface PropsType {
  setColumns: Function,
  columns: any[],
  tableProps: any,
  immediately?: boolean,
}

const ResizeableTitle:FC = (props: any) => {
  const { onResize, width, ...restProps } = props;
  // console.log(width, props, 'width')
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ResizeTable:FC<PropsType> = (props: PropsType) => {
  const { columns, setColumns, tableProps, immediately = true } = props;
  // console.log(columns, 'columnscolumnscolumns');
  // 定义头部组件
  let components = {
    header: {
      cell: ResizeableTitle,
    },
  };
 
  // 处理拖拽
  const handleResize = (e: any, size: any, oldColumn: any[]) => {
    const newColumns = [...oldColumn];
    newColumns.forEach(item => {
      if (item.key === e.key) {
        item.width = size.width;
      }
    })
    setColumns(newColumns);
  };
 
  useEffect(() => {
    // console.log(immediately, columns, 'immediately')
    if (columns?.length) {
      const newColumn = [...columns]?.map(it => (
        {
          ...it,
          ellipsis: {
            showTitle: true,
          },
          onHeaderCell: (col: any) => {
            return {
              width: col.width,
              // !传入newColumn，而不传入column是因为需要拿到有onHeaderCell的值，外面collumn的变化内部监听不到
              onResize: (e: any, target: any) => handleResize(col, target.size, newColumn),
            }
          },
        }
      ));
      setColumns(newColumn);
    }
  }, [immediately]);
 
  return (
    <div className="components-table-resizable-column">
      <Table
        size='middle'
        {...tableProps}
        components={components}
        columns={columns}
      />
    </div>
  )
}
 
export default ResizeTable;
