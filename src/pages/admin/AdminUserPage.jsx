// src/pages/Admin/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import {
    Users,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    // Filters and pagination
    const [filters, setFilters] = useState({
        status: 'pending',
        role: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0
    });

    // Selected users for bulk actions
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Action states
    const [actionLoading, setActionLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    // Fetch users on mount and when filters/pagination change
    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [filters, pagination.page]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            const queryParams = new URLSearchParams({
                page: pagination.page,
                per_page: pagination.per_page,
                ...(filters.status !== 'all' && { status_filter: filters.status }),
                ...(filters.role && { role_filter: filters.role }),
                ...(filters.search && { search: filters.search })
            });

            const response = await fetch(
                `http://localhost:8000/auth/admin/users?${queryParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 403) {
                    navigate('/login');
                    throw new Error('Admin access required');
                }
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users);
            setPagination({
                ...pagination,
                total: data.total,
                total_pages: data.total_pages
            });
        } catch (err) {
            toast.error('Failed to load users');
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/auth/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {

            console.error('Error fetching stats:', err);
        }
    };

    const updateUserStatus = async (userId, status) => {
        setActionLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(
                `http://localhost:8000/auth/admin/users/${userId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Show success toast
            if (status === 'approved') {
                toast.success(`${userName} has been approved!`, {
                    icon: '✅',
                    duration: 4000,
                });
            } else if (status === 'rejected') {
                toast.success(`${userName} has been rejected.`, {
                    icon: '❌',
                    duration: 4000,
                });
            }

            // Refresh user list
            await fetchUsers();
            await fetchStats();

            // Clear selected users
            setSelectedUsers([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setShowConfirmModal(false);
        }
    };

    const bulkUpdateStatus = async (status) => {
        if (selectedUsers.length === 0) return;

        setActionLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(
                'http://localhost:8000/auth/admin/users/bulk-status',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_ids: selectedUsers,
                        status: status
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update users');
            }

            // Show success toast
            toast.success(
                `${data.updated_count} user(s) have been ${status}!`,
                {
                    icon: status === 'approved' ? '✅' : '❌',
                    duration: 5000,
                }
            );

            // Refresh user list
            await fetchUsers();
            await fetchStats();

            // Clear selected users
            setSelectedUsers([]);
            setShowBulkActions(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setShowConfirmModal(false);
        }
    };

    const deleteUser = async (userId) => {
        setActionLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(
                `http://localhost:8000/auth/admin/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Show success toast
            toast.success(`${userName} has been deleted.`, {
                icon: '🗑️',
                duration: 4000,
            });

            // Refresh user list
            await fetchUsers();
            await fetchStats();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setShowConfirmModal(false);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            instructor: 'bg-blue-100 text-blue-800',
            registrar: 'bg-indigo-100 text-indigo-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    const ConfirmModal = () => {
        if (!confirmAction) return null;

        return (
            // Changed bg-black/30 to bg-black/20 for more transparency
            // Added 'inset-0' and 'fixed' to ensure it covers the screen properly
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                {/* Backdrop Layer */}
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setShowConfirmModal(false)}
                />

                {/* Modal Content */}
                <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 transform transition-all">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {confirmAction.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{confirmAction.message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmAction.onConfirm}
                            disabled={actionLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmAction.danger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {actionLoading ? 'Processing...' : confirmAction.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage and approve user accounts
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                fetchUsers();
                                toast.loading('Refreshing users...', { id: 'refresh' });
                                setTimeout(() => {
                                    toast.success('Users refreshed!', { id: 'refresh' });
                                }, 1000);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Users"
                            value={stats.total_users}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="Pending Approval"
                            value={stats.pending_users}
                            icon={Clock}
                            color="yellow"
                        />
                        <StatCard
                            title="Approved"
                            value={stats.approved_users}
                            icon={UserCheck}
                            color="green"
                        />
                        <StatCard
                            title="Rejected"
                            value={stats.rejected_users}
                            icon={UserX}
                            color="red"
                        />
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Role Filter */}
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Roles</option>
                            <option value="instructor">Instructor</option>
                            <option value="registrar">Registrar</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedUsers.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-blue-700">
                            {selectedUsers.length} user(s) selected
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setConfirmAction({
                                        title: 'Approve Selected Users',
                                        message: `Are you sure you want to approve ${selectedUsers.length} user(s)?`,
                                        confirmText: 'Approve',
                                        danger: false,
                                        onConfirm: () => bulkUpdateStatus('approved')
                                    });
                                    setShowConfirmModal(true);
                                }}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve All
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmAction({
                                        title: 'Reject Selected Users',
                                        message: `Are you sure you want to reject ${selectedUsers.length} user(s)?`,
                                        confirmText: 'Reject',
                                        danger: true,
                                        onConfirm: () => bulkUpdateStatus('rejected')
                                    });
                                    setShowConfirmModal(true);
                                }}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Reject All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchUsers}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === users.length && users.length > 0}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registered
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium">
                                                                {user.firstname[0]}{user.lastname[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstname} {user.lastname}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.gender}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(user.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {user.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setConfirmAction({
                                                                        title: 'Approve User',
                                                                        message: `Are you sure you want to approve ${user.firstname} ${user.lastname}?`,
                                                                        confirmText: 'Approve',
                                                                        danger: false,
                                                                        onConfirm: () => updateUserStatus(user.id, 'approved')
                                                                    });
                                                                    setShowConfirmModal(true);
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setConfirmAction({
                                                                        title: 'Reject User',
                                                                        message: `Are you sure you want to reject ${user.firstname} ${user.lastname}?`,
                                                                        confirmText: 'Reject',
                                                                        danger: true,
                                                                        onConfirm: () => updateUserStatus(user.id, 'rejected')
                                                                    });
                                                                    setShowConfirmModal(true);
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setConfirmAction({
                                                                title: 'Delete User',
                                                                message: `Are you sure you want to delete ${user.firstname} ${user.lastname}? This action cannot be undone.`,
                                                                confirmText: 'Delete',
                                                                danger: true,
                                                                onConfirm: () => deleteUser(user.id)
                                                            });
                                                            setShowConfirmModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {(pagination.page - 1) * pagination.per_page + 1} to{' '}
                                {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
                                {pagination.total} results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 text-sm">
                                    Page {pagination.page} of {pagination.total_pages}
                                </span>
                                <button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    disabled={pagination.page === pagination.total_pages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && <ConfirmModal />}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;