import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Nav, Navbar, Button, Dropdown, Form, InputGroup, Badge } from 'react-bootstrap';
import {
  Users,
  Stethoscope,
  Building,
  Bookmark,
  CalendarRange,
  UsersRound,
  LogOut,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  User,
  Briefcase
} from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';
import { toast } from 'sonner';

const System = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userInfo, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Có ca khám mới được đăng ký lúc 09:15', time: '10 phút trước', read: false },
    { id: 2, text: 'Bệnh nhân Nguyễn Văn A đã xác nhận lịch hẹn', time: '1 giờ trước', read: false },
  ]);

  useEffect(() => {
    // Role guarding
    if (!isLoggedIn || !userInfo) {
      toast.error('Vui lòng đăng nhập để truy cập trang quản trị.');
      navigate('/login');
      return;
    }

    if (userInfo.roleId !== 'R1' && userInfo.roleId !== 'R2') {
      toast.error('Bạn không có quyền truy cập khu vực quản trị.');
      navigate('/');
    }
  }, [isLoggedIn, userInfo, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công.');
    navigate('/');
  };

  const handleMarkNotificationsRead = () => {
    setUnreadNotifications(0);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (!isLoggedIn || !userInfo) return null;

  const isAdmin = userInfo.roleId === 'R1';
  const isDoctor = userInfo.roleId === 'R2';

  const menuItems = [];

  // Add Dashboard link for both roles
  menuItems.push({ 
    path: '/system/dashboard', 
    label: 'Bảng điều khiển', 
    icon: <LayoutDashboard size={18} /> 
  });

  if (isAdmin) {
    menuItems.push(
      { path: '/system/user-manage', label: t('menu.admin.manage-user'), icon: <Users size={18} /> },
      { path: '/system/manage-doctor', label: t('menu.admin.manage-doctor'), icon: <Stethoscope size={18} /> },
      { path: '/system/manage-clinic', label: t('menu.admin.manage-clinic'), icon: <Building size={18} /> },
      { path: '/system/manage-specialty', label: t('menu.admin.manage-specialty'), icon: <Bookmark size={18} /> },
      { path: '/system/manage-package', label: t('menu.admin.manage-package'), icon: <Briefcase size={18} /> }
    );
  }

  if (isDoctor) {
    menuItems.push(
      { path: '/system/manage-schedule', label: t('menu.doctor.manage-schedule'), icon: <CalendarRange size={18} /> },
      { path: '/system/manage-patient', label: t('menu.doctor.manage-patient'), icon: <UsersRound size={18} /> }
    );
  }

  return (
    <div className="system-layout">
      {/* Sidebar (Collapsible) */}
      <div 
        className={`system-sidebar d-flex flex-column p-3 text-white border-end border-opacity-10 border-white transition-all ${
          isCollapsed ? 'collapsed' : ''
        }`}
      >
        <Link to="/" className="d-flex align-items-center gap-2 mb-4 text-white text-decoration-none fw-bold">
          <HeartPulse size={24} className="text-danger" />
          <span className="fs-5">BookingCare</span>
        </Link>
        <div className="small text-white text-opacity-50 mb-3 px-2">
          {isAdmin ? 'ADMIN PORTAL' : 'DOCTOR PORTAL'}
        </div>

        <Nav className="flex-column gap-1 flex-grow-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`text-white d-flex align-items-center gap-2 px-3 py-2 rounded transition-all ${
                  active ? 'bg-primary bg-opacity-75 fw-bold' : 'hover-glow'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>

        <hr className="border-secondary" />

        <div className="px-2 mb-2 d-flex flex-column small text-white text-opacity-70 gap-1">
          <span>Xin chào,</span>
          <strong className="text-white">{userInfo.lastName} {userInfo.firstName}</strong>
        </div>

        <Button
          variant="outline-light"
          size="sm"
          onClick={handleLogout}
          className="d-flex align-items-center justify-content-center gap-2 mt-2 w-100 py-2 border-opacity-25"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </Button>
      </div>

      {/* Content panel */}
      <div className="system-content p-4 d-flex flex-column">
        {/* Upper Header Control Bar */}
        <Navbar bg="white" className="rounded border shadow-sm p-2 mb-4 justify-content-between px-3">
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="light" 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="d-flex align-items-center justify-content-center p-2 border-0 bg-transparent"
            >
              <Menu size={20} className="text-dark" />
            </Button>
            
            {/* Quick Search */}
            <InputGroup size="sm" className="d-none d-md-flex max-width-300">
              <InputGroup.Text className="bg-light border-end-0">
                <Search size={14} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm nhanh..."
                className="border-start-0 bg-light"
              />
            </InputGroup>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle switch */}
            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center justify-content-center border-0 p-2 bg-transparent"
              onClick={toggleTheme}
              title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-secondary" />}
            </Button>

            {/* Notification Bell */}
            <Dropdown onToggle={(isOpen) => isOpen && handleMarkNotificationsRead()}>
              <Dropdown.Toggle variant="light" size="sm" className="d-flex align-items-center justify-content-center border-0 p-2 bg-transparent position-relative">
                <Bell size={18} className="text-dark" />
                {unreadNotifications > 0 && (
                  <span 
                    className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ top: '8px', right: '4px' }}
                  />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" style={{ width: '280px' }} className="shadow p-0">
                <div className="p-2 border-bottom fw-bold text-dark small bg-light d-flex justify-content-between align-items-center">
                  <span>Thông báo mới nhất</span>
                  {unreadNotifications > 0 && <Badge bg="danger">{unreadNotifications} mới</Badge>}
                </div>
                {notifications.map(n => (
                  <Dropdown.Item key={n.id} className={`p-2.5 border-bottom small ${!n.read ? 'bg-primary bg-opacity-5 fw-semibold' : ''}`}>
                    <div className="text-dark text-wrap">{n.text}</div>
                    <div className="text-muted small mt-1 text-end" style={{ fontSize: '10px' }}>{n.time}</div>
                  </Dropdown.Item>
                ))}
                <div className="p-2 text-center small"><Link to="/system/manage-patient" className="text-teal text-decoration-none fw-bold">Xem tất cả ca khám</Link></div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" className="d-flex align-items-center gap-2 border-0 p-2 bg-transparent">
                <div className="bg-teal text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '12px', fontWeight: 'bold' }}>
                  {userInfo.firstName ? userInfo.firstName.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-dark small fw-semibold d-none d-sm-inline">{userInfo.firstName}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/" className="d-flex align-items-center gap-2 small">
                  <HeartPulse size={14} />
                  <span>Về trang chủ</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger small">
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar>

        <div className="flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default System;
