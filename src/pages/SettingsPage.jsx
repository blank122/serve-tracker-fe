import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios'; // Adjust path if needed

const SettingsPage = () => {
    const navigate = useNavigate();

    const getDashboardPath = () => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        return `/${user?.role?.toLowerCase() || 'unauthorized'}/dashboard`;
    };

    // --- Profile State ---
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState(null);

    // --- Password State ---
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(null);

    // --- Password Visibility State ---
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
            });
        }
    }, []);

    // --- Handlers ---
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage(null);

        try {
            // 1. Get the user ID from local storage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = storedUser?.id || storedUser?.user_id; // Use whichever key your app uses

            if (!userId) throw new Error("User ID not found. Please log in again.");

            // 2. Pass the ID in the URL
            const response = await api.put(`/auth/profile/${userId}`, profileData);

            // Update local storage so the navbar avatar updates
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...response.data.user }));

            setProfileMessage({ type: 'success', text: 'Profile updated successfully! Redirecting...' });

            setTimeout(() => {
                navigate(getDashboardPath());
            }, 1500);

        } catch (err) {
            setProfileMessage({
                type: 'error',
                text: err.response?.data?.detail || 'Failed to update profile.'
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (passwordData.new_password.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
            return;
        }

        setIsSavingPassword(true);

        try {
            // 1. Get the user ID
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = storedUser?.id || storedUser?.user_id;

            if (!userId) throw new Error("User ID not found. Please log in again.");

            // 2. Pass the ID in the URL
            await api.put(`/auth/change-password/${userId}`, {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password
            });

            setPasswordMessage({ type: 'success', text: 'Password changed successfully! Redirecting...' });
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });

            // Reset visibility toggles
            setShowPasswords({ current: false, new: false, confirm: false });

            setTimeout(() => {
                navigate(getDashboardPath());
            }, 1500);

        } catch (err) {
            setPasswordMessage({
                type: 'error',
                text: err.response?.data?.detail || 'Failed to change password.'
            });
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="mx-auto max-w-4xl">

                <button
                    onClick={() => navigate(getDashboardPath())}
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Manage your personal information and security preferences.
                    </p>
                </header>

                <div className="space-y-8">

                    {/* --- PROFILE SETTINGS CARD --- */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.first_name}
                                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.last_name}
                                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-800"
                                    />
                                </div>

                            </div>

                            {profileMessage && (
                                <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-bold animate-in fade-in ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {profileMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {profileMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} />
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- SECURITY SETTINGS CARD --- */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                <Lock size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Security</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="p-6 md:p-8 space-y-6">

                            <div className="space-y-2 max-w-md">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        required
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            required
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            required
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {passwordMessage && (
                                <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-bold animate-in fade-in ${passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {passwordMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingPassword}
                                    className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-slate-200 hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <Lock size={18} />
                                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;