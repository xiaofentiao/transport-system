import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;

export default function Main() {
  return (
    <Content
      style={{
        padding: '10px 14px 14px 14px',
        backgroundColor: '#f2f7ff'
      }}
    >
      <div className='card'>
        <Outlet />
      </div>
    </Content>
  );
}
