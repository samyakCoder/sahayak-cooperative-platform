import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import WorkerLayout from './layouts/WorkerLayout';
import AdminLayout from './layouts/AdminLayout';

// Landing
import LandingPage from './pages/LandingPage';

// Customer Pages
import CustomerHome from './pages/customer/Home';
import BookingFlow from './pages/customer/BookingFlow';
import CustomerBookings from './pages/customer/Bookings';
import Tracking from './pages/customer/Tracking';
import Payment from './pages/customer/Payment';
import Rating from './pages/customer/Rating';
import WorkerProfile from './pages/customer/WorkerProfile';
import Emergency from './pages/customer/Emergency';
import Complaint from './pages/customer/Complaint';
import CustomerProfile from './pages/customer/Profile';
import CustomerSupport from './pages/customer/Support';

// Worker Pages
import WorkerHome from './pages/worker/Home';
import WorkerJobs from './pages/worker/Jobs';
import WorkerEarnings from './pages/worker/Earnings';
import WorkerWelfare from './pages/worker/Welfare';
import WorkerProfilePage from './pages/worker/Profile';
import WorkerRegister from './pages/worker/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminWorkers from './pages/admin/Workers';
import AdminBookings from './pages/admin/Bookings';
import AdminCooperatives from './pages/admin/Cooperatives';
import AdminPayments from './pages/admin/Payments';
import AdminWelfare from './pages/admin/Welfare';
import AIForecast from './pages/admin/AIForecast';
import AIAllocation from './pages/admin/AIAllocation';
import GeoMap from './pages/admin/GeoMap';
import AdminAnalytics from './pages/admin/Analytics';
import AdminComplaints from './pages/admin/Complaints';
import AdminSettings from './pages/admin/Settings';

// Interactive Role Switcher & Demo Helper
import DemoSwitcher from './components/DemoSwitcher';

export default function App() {
  return (
    <>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Customer App */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="home" element={<CustomerHome />} />
          <Route path="book/:serviceId" element={<BookingFlow />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="tracking/:bookingId" element={<Tracking />} />
          <Route path="payment/:bookingId" element={<Payment />} />
          <Route path="rating/:bookingId" element={<Rating />} />
          <Route path="worker/:workerId" element={<WorkerProfile />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="complaint" element={<Complaint />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="services" element={<CustomerHome />} />
        </Route>

        {/* Worker Registration Standalone Route */}
        <Route path="/worker/register" element={<WorkerRegister />} />
        <Route path="/register-worker" element={<WorkerRegister />} />

        {/* Worker App */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route index element={<WorkerHome />} />
          <Route path="home" element={<WorkerHome />} />
          <Route path="register" element={<WorkerRegister />} />
          <Route path="jobs" element={<WorkerJobs />} />
          <Route path="earnings" element={<WorkerEarnings />} />
          <Route path="welfare" element={<WorkerWelfare />} />
          <Route path="profile" element={<WorkerProfilePage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="cooperatives" element={<AdminCooperatives />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="welfare" element={<AdminWelfare />} />
          <Route path="ai-forecast" element={<AIForecast />} />
          <Route path="ai-allocation" element={<AIAllocation />} />
          <Route path="geo-map" element={<GeoMap />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Demo Role Switcher */}
      <DemoSwitcher />
    </>
  );
}
