import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Space } from "antd";

import { useAppStore } from "@/store/app";

import Avatar from "./components/avatar";
import CustomBreadcrumb from "../breadcrumb";

import './index.less'

const { Header } = Layout;



export default function THeader() {

  const isColl = useAppStore((s) => s.collapsed)
  const setColl = useAppStore((s) => s.setCollapsed)

  const toggle = () => {
    setColl(!isColl);
  };

  const TriggerIcon = isColl ? MenuUnfoldOutlined : MenuFoldOutlined

  return (
    <Header className="site-layout-background t-header flex row-sp col-c">
      <div className="flex row-s col-c">
        <div className="mgr10 fw-b">模板管理</div>
        <TriggerIcon className="trigger" onClick={toggle} />
      </div>
      <div><CustomBreadcrumb /></div>
      <Space className="flex row-l col-c">
        <Avatar />
      </Space>
    </Header>
  );

}
