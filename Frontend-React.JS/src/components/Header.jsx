import React from 'react';
import { Navbar, Container, Nav, Dropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Globe, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleScrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Navbar expand="lg" className="main-header py-3 sticky-top shadow-sm">
      <Container>
        {/* Brand/Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-main-color">
          <HeartPulse size={28} className="text-danger" />
          <span className="fs-4" style={{ letterSpacing: '-0.5px' }}>BookingCare</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto gap-3 text-center">
            <Nav.Link onClick={() => handleScrollToSection('specialties-section')} className="fw-semibold text-dark cursor-pointer">
              {t('home-header.specialty')}
            </Nav.Link>
            <Nav.Link onClick={() => handleScrollToSection('clinics-section')} className="fw-semibold text-dark cursor-pointer">
              {t('home-header.health-facility')}
            </Nav.Link>
            <Nav.Link onClick={() => handleScrollToSection('doctors-section')} className="fw-semibold text-dark cursor-pointer">
              {t('home-header.doctor')}
            </Nav.Link>
            <Nav.Link onClick={() => handleScrollToSection('health-packages-section')} className="fw-semibold text-dark cursor-pointer">
              {t('home-header.fee')}
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3 justify-content-center">
            {/* Theme Toggle */}
            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center justify-content-center border p-2 bg-transparent"
              onClick={toggleTheme}
              title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-secondary" />}
            </Button>

            {/* Language Selector */}
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" className="d-flex align-items-center gap-1 border bg-transparent">
                <Globe size={16} />
                <span>{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => changeLanguage('vi')}>Tiếng Việt</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Auth Menu */}
            {isLoggedIn && userInfo ? (
              <Dropdown>
                <Dropdown.Toggle variant="premium-main" size="sm" className="btn-premium-main d-flex align-items-center gap-2">
                  <User size={16} />
                  <span>{userInfo.firstName || 'User'}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {(userInfo.roleId === 'R1' || userInfo.roleId === 'R2') && (
                    <Dropdown.Item as={Link} to="/system" className="d-flex align-items-center gap-2">
                      <LayoutDashboard size={16} />
                      <span>{t('menu.admin.manage-user')}</span>
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/login" variant="outline-primary" size="sm" className="fw-semibold px-3">
                Đăng nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
