import { Layout } from 'antd';

import Theader from './components/header';
import Main from './components/main';
import SideBar from './components/sideBar';

import './index.less';

export default function LayOut() {
  return (
    <Layout className="contents">
      <Theader />
      <Layout className="site-layout">
        <SideBar />
        <Main />
      </Layout>
    </Layout>
  );
}
