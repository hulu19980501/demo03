import React, { useEffect, useState } from "react";
import {
  ContainerOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import "./home.css";
import type { MenuProps } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // 使用编程式路由
  const navigateTo = useNavigate();
  //获取当前路由地址
  const { pathname } = useLocation();
  const menuclick = (e: { key: string }) => {
    navigateTo(e.key);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  //菜单配置
  const items: MenuItem[] = [
    {
      label: "学习心得",
      key: "/home/experience",
      icon: <ContainerOutlined />,
    },
    {
      label: "账户管理",
      key: "/home/user",
      icon: <MailOutlined />,
      children: [
        {
          label: "账户列表",
          key: "/home/user/list",
        },
        {
          label: "角色列表",
          key: "/home/user/role",
        },
      ],
    },
  ];
  let initSelect: string = "";
  // 设置只能有一个展开项
  const [openKeys, setOpenKeys] = useState([initSelect]);
  // 刷新时被选中的menu二级菜单初始化的展开问题
  useEffect(() => {
    const refreshThePage = () => {
      let rank = pathname.split("/");
      //  pathname:  /home/user/list    rank: ['', 'home', 'user','list']
      // 判断是几级菜单，二级菜单rank.length为4
      if (rank.length === 4) {
        let newOpenkeys = rank.slice(0, 3).join("/"); // newOpenkeys: /home/user/list
        setOpenKeys([newOpenkeys]);
      }
    };
    refreshThePage();
  }, []);

  return (
    // 侧边栏
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">后台管理系统</div>
        {/* <Menu
          //控制表单样式的选中状态
          defaultSelectedKeys={[pathname]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          //菜单项的数据
          items={items}
          onClick={menuclick}
          openKeys={openKeys}//当前菜单展开项的key数组
        // onOpenChange={handleOpen} 
        /> */}
        <Menu
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={openKeys}
          mode="inline"
          theme="dark"
          items={items}
          onClick={menuclick}
        />
      </Sider>
      {/* 右侧区域 */}
      <Layout>
        {/* 右边头部 */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        {/* 右边内容 */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
