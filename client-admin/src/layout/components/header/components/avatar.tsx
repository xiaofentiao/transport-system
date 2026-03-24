import { CaretDownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from "antd"
import { useNavigate } from "react-router-dom"

import { LOCAL_KEYS } from "@/type/local_keys_enum"
import storage from '@/utils/storage'

import '../index.less'
import api from "@/api";

export default function Avatar() {
  const navigate = useNavigate();

  const loginOut = () => {
    storage.deleteCache(LOCAL_KEYS.TOKEN)
    storage.deleteCache(LOCAL_KEYS.USER_INFO)
    api.user.logout()
    navigate('/login')
  }

  const userInfo = storage.getCache<any>(LOCAL_KEYS.USER_INFO)
  const userName = userInfo?.userName ?? ''

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={loginOut}>
          退出登录
        </a> 
      )
    }
  ]


  return (
    <Dropdown arrow menu={{ items }} className="avatar-area">
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <UserOutlined />
          {userName}
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}  
