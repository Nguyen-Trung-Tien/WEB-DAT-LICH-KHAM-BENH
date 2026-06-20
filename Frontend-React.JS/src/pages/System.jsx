import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Nav, Navbar } from 'react-bootstrap';
import {
  Users,
  Stethoscope,
  Building,
  Bookmark,
  CalendarRange,
  UsersRound,
  LogOut,
  HeartPulse,
  LayoutDashboard
} from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import { toast } from 'sonner';

const System = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userInfo, logout } = useAuthStore();

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

  if (!isLoggedIn || !userInfo) return null;

  const isAdmin = userInfo.roleId === 'R1';
  const isDoctor = userInfo.roleId === 'R2';

  const menuItems = [];

  if (isAdmin) {
    menuItems.push(
      { path: '/system/user-manage', label: t('menu.admin.manage-user'), icon: <Users size={18} /> },
      { path: '/system/manage-doctor', label: t('menu.admin.manage-doctor'), icon: <Stethoscope size={18} /> },
      { path: '/system/manage-clinic', label: t('menu.admin.manage-clinic'), icon: <Building size={18} /> },
      { path: '/system/manage-specialty', label: t('menu.admin.manage-specialty'), icon: <Bookmark size={18} /> }
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
      {/* Sidebar */}
      <div className="system-sidebar d-flex flex-column p-3 text-white border-end border-opacity-10 border-white">
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
      <div className="system-content p-4">
        <Navbar bg="white" className="rounded border shadow-sm p-3 mb-4 d-lg-none">
          <Navbar.Brand className="fw-bold text-main-color">BookingCare Admin</Navbar.Brand>
        </Navbar>

        <Outlet />
      </div>
    </div>
  );
};

export default System;
