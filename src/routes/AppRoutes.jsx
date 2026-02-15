import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';

// Your ML Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import InstructorDashboard from './pages/instructor/Dashboard';
import RegistrarDashboard from './pages/registrar/Dashboard';
import PredictionModel from './pages/instructor/PredictionModel';
import DashboardLayout from '../components/DashboardLayout';

const App = () => {
  // Replace this with your actual Auth State (from Context or Redux)
  const user = { role: 'Instructor' }; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 👮 ADMIN ONLY ROUTES */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['Admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<div>User Management</div>} />
        </Route>

        {/* 👨‍🏫 INSTRUCTOR ROUTES (Prediction ML Features) */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['Instructor', 'Admin']} />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/predict" element={<PredictionModel />} />
        </Route>

        {/* 📑 REGISTRAR ROUTES */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['Registrar', 'Admin']} />}>
          <Route path="/registrar" element={<RegistrarLayout/>}>
          
          </Route>
          <Route path="/registrar/dashboard" element={<RegistrarDashboard />} />
          <Route path="/registrar/grades" element={<div>Grades Management</div>} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};