import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';

// Your ML Dashboards

import InstructorLayout from '../layouts/InstructorLayout';
import RegistrarDashboard from '../pages/registrar/RegistrarDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLayout from '../layouts/AdminLayout';

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
                    <Route path="admin" element={<AdminLayout />}>
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/manage-users" element={<div>User Management</div>} />
                    </Route>

                </Route>

                {/* 👨‍🏫 INSTRUCTOR ROUTES (Prediction ML Features) */}
                <Route element={<ProtectedRoute user={user} allowedRoles={['Instructor', 'Admin']} />}>
                    <Route path="instructor" element={<InstructorLayout />}>
                        <Route path="/dashboard" element={<InstructorDashboard />} />
                    </Route>
                </Route>

                {/* 📑 REGISTRAR ROUTES */}
                <Route element={<ProtectedRoute user={user} allowedRoles={['Registrar', 'Admin']} />}>
                    <Route path="/registrar" element={<RegistrarLayout />}>
                        <Route path="/registrar/dashboard" element={<RegistrarDashboard />} />
                        <Route path="/registrar/grades" element={<div>Grades Management</div>} />
                    </Route>
                </Route>

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};