import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts & Pages
import AdminLayout from '../layouts/AdminLayout';
import InstructorLayout from '../layouts/InstructorLayout';
// Make sure to import RegistrarLayout if it exists!
import RegistrarDashboard from '../pages/registrar/RegistrarDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import LoginPage from '../pages/authentication/LoginPage';
import RegisterPage from '../pages/authentication/RegisterPage';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast

const ProtectedRoute = ({ user, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;

    // 1. Check if the account is approved (Backend returns 'approved')
    if (user.status !== 'approved') {
        toast.error("Your account is pending approval.");
        return <Navigate to="/login" replace />;
    }

    // 2. Check Role (matches 'admin', 'instructor', etc. from your JSON)
    const userRole = user.role?.toLowerCase();
    const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

const AppRoutes = () => {
    // Auth State
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    return (
        <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<div>Access Denied</div>} />

                {/* 👮 ADMIN ROUTES */}
                <Route element={<ProtectedRoute user={user} allowedRoles={['admin']} />}>
                    <Route path="admin" element={<AdminLayout />}>
                        {/* Note: No leading slash for nested routes */}
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="manage-users" element={<div>User Management</div>} />
                    </Route>
                </Route>

                {/* 👨‍🏫 INSTRUCTOR ROUTES */}
                <Route element={<ProtectedRoute user={user} allowedRoles={['instructor', 'admin']} />}>
                    <Route path="instructor" element={<InstructorLayout />}>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<InstructorDashboard />} />
                    </Route>
                </Route>

                {/* 📑 REGISTRAR ROUTES */}
                <Route element={<ProtectedRoute user={user} allowedRoles={['registrar', 'admin']} />}>
                    <Route path="registrar" element={<div>Registrar Layout Placeholder</div>}>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<RegistrarDashboard />} />
                        <Route path="grades" element={<div>Grades Management</div>} />
                    </Route>
                </Route>

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;