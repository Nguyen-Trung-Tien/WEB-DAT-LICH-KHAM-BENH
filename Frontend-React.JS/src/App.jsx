import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import DoctorDetail from './pages/DoctorDetail.jsx';
import SpecialtyDetail from './pages/SpecialtyDetail.jsx';
import ClinicDetail from './pages/ClinicDetail.jsx';
import PackageDetail from './pages/PackageDetail.jsx';
import VerifyBooking from './pages/VerifyBooking.jsx';
import Login from './pages/Login.jsx';
import System from './pages/System.jsx';
import UserManage from './pages/UserManage.jsx';
import ManageDoctor from './pages/ManageDoctor.jsx';
import ManageSchedule from './pages/ManageSchedule.jsx';
import ManagePatient from './pages/ManagePatient.jsx';
import ManageClinic from './pages/ManageClinic.jsx';
import ManageSpecialty from './pages/ManageSpecialty.jsx';
import ManagePackage from './pages/ManagePackage.jsx';
import ManageDashboard from './pages/ManageDashboard.jsx';
import MockPayment from './pages/MockPayment.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import useThemeStore from './store/themeStore.js';

// Client face wrapper layout
const ClientLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const applyTheme = useThemeStore((state) => state.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <Routes>
      {/* Patient facing pages */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/detail-doctor/:id" element={<DoctorDetail />} />
        <Route path="/detail-specialty/:id" element={<SpecialtyDetail />} />
        <Route path="/detail-clinic/:id" element={<ClinicDetail />} />
        <Route path="/detail-package/:id" element={<PackageDetail />} />
        <Route path="/verify-booking" element={<VerifyBooking />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>

      {/* Auth page */}
      <Route path="/login" element={<Login />} />

      {/* Mock Payment Gateway (standalone checkout view) */}
      <Route path="/mock-payment" element={<MockPayment />} />

      {/* System management dashboard pages */}
      <Route path="/system" element={<System />}>
        {/* Default route redirect to statistics dashboard */}
        <Route index element={<Navigate to="/system/dashboard" replace />} />
        <Route path="dashboard" element={<ManageDashboard />} />
        <Route path="user-manage" element={<UserManage />} />
        <Route path="manage-doctor" element={<ManageDoctor />} />
        <Route path="manage-schedule" element={<ManageSchedule />} />
        <Route path="manage-patient" element={<ManagePatient />} />
        <Route path="manage-clinic" element={<ManageClinic />} />
        <Route path="manage-specialty" element={<ManageSpecialty />} />
        <Route path="manage-package" element={<ManagePackage />} />
      </Route>

      {/* Fallback redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
