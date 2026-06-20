import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import DoctorDetail from './pages/DoctorDetail.jsx';
import SpecialtyDetail from './pages/SpecialtyDetail.jsx';
import ClinicDetail from './pages/ClinicDetail.jsx';
import VerifyBooking from './pages/VerifyBooking.jsx';
import Login from './pages/Login.jsx';
import System from './pages/System.jsx';
import UserManage from './pages/UserManage.jsx';
import ManageDoctor from './pages/ManageDoctor.jsx';
import ManageSchedule from './pages/ManageSchedule.jsx';
import ManagePatient from './pages/ManagePatient.jsx';
import ManageClinic from './pages/ManageClinic.jsx';
import ManageSpecialty from './pages/ManageSpecialty.jsx';

// Client face wrapper layout
const ClientLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Patient facing pages */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/detail-doctor/:id" element={<DoctorDetail />} />
        <Route path="/detail-specialty/:id" element={<SpecialtyDetail />} />
        <Route path="/detail-clinic/:id" element={<ClinicDetail />} />
        <Route path="/verify-booking" element={<VerifyBooking />} />
      </Route>

      {/* Auth page */}
      <Route path="/login" element={<Login />} />

      {/* System management dashboard pages */}
      <Route path="/system" element={<System />}>
        {/* Default route redirect to user manager or schedule manager */}
        <Route index element={<Navigate to="/system/user-manage" replace />} />
        <Route path="user-manage" element={<UserManage />} />
        <Route path="manage-doctor" element={<ManageDoctor />} />
        <Route path="manage-schedule" element={<ManageSchedule />} />
        <Route path="manage-patient" element={<ManagePatient />} />
        <Route path="manage-clinic" element={<ManageClinic />} />
        <Route path="manage-specialty" element={<ManageSpecialty />} />
      </Route>

      {/* Fallback redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
