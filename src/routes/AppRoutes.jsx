import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts & Pages
import AdminLayout from '../layouts/AdminLayout';
import InstructorLayout from '../layouts/InstructorLayout';
// Make sure to import RegistrarLayout if it exists!
import RegistrarDashboard from '../pages/registrar/RegistrarDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import LoginPage from '../pages/authentication/LoginPage';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast
import { useAuth, AuthProvider } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import RegistrarLayout from '../layouts/RegistrarLayout';
import CoursePage from '../pages/admin/CoursePage';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. If no user is logged in, send to login and save the attempted path
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Role-based check
    // Note: I'm using user.role based on your backend response earlier.
    // If your backend uses 'account_type', change user.role to user.account_type.
    const userRole = user.role?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (allowedRoles && !isAllowed) {
        // Optional: Show a toast before redirecting
        toast.error("You do not have permission to access this page.");
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. If all checks pass, render the child routes
    return <Outlet />;
};

const AppRoutes = () => {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-center" />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Admin Only */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="courses" element={<CoursePage />} />

                        </Route>
                    </Route>

                    {/* Instructor & Admin */}
                    <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
                        <Route path="instructor" element={<InstructorLayout />}>
                            <Route path="dashboard" element={<InstructorDashboard />} />
                        </Route>
                    </Route>
                    {/* Registrar */}
                    <Route element={<ProtectedRoute allowedRoles={['registrar', 'admin']} />}>
                        <Route path="registrar" element={<RegistrarLayout />}>
                            <Route path="dashboard" element={<RegistrarDashboard />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default AppRoutes;