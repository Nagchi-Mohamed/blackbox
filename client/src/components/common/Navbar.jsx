import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.less';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="navbar">
      <div className="logo">
        <Link to="/">BrainyMath</Link>
      </div>
      <Menu theme="dark" mode="horizontal" className="nav-menu">
        <Menu.Item key="courses">
          <Link to="/courses">Courses</Link>
        </Menu.Item>
        <Menu.Item key="classroom">
          <Link to="/classroom">Classroom</Link>
        </Menu.Item>
        <Menu.Item key="forum">
          <Link to="/forum">Forum</Link>
        </Menu.Item>
      </Menu>
      <div className="nav-right">
        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span className="username">{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <div className="auth-buttons">
            <Button type="link" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};

export default Navbar; 