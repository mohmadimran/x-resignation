import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/auth/register';
import Login from './components/auth/login';
import HomePage from './pages/HeroPage'
import EmployeeDashboard from './pages/EmployeeDashbord';
import HrDashboard from './pages/HrDashboard';
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Employee */}

        <Route
          element={<ProtectedRoute allowedRoles={["employee"]} />}
        >
          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboard />}
          />
        </Route>

        {/* HR */}

        <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
          <Route path="/hr/dashboard" element={<HrDashboard />} />
        </Route>

        {/* 404 */}

        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default App;