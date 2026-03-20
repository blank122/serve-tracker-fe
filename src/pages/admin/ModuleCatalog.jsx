import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const ModuleCatalogPage = () => {
    const [modules, setModules] = useState([]);
    const [moduleTypes, setModuleTypes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [formData, setFormData] = useState({
        module_catalog_name: '',
        hours: '',
        module_type_id: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/subject/module-catalog`);
            const data = await response.json();
            setModules(data);
        } catch (error) {
            setError('Error fetching modules: ' + error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModuleTypes();
    }, []);

    const fetchModuleTypes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/subject/module-type`);
            const data = await response.json();
            setModuleTypes(data);
        } catch (error) {
            setError('Error fetching module types: ' + error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const searchModules = async () => {
        if (!searchTerm.trim()) {
            fetchModules();
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/subject/search/?name=${searchTerm}`);
            const data = await response.json();
            setModules(data);
        } catch (error) {
            setError('Error searching modules: ' + error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openCreateModal = () => {
        setEditingModule(null);
        setFormData({
            module_catalog_name: '',
            hours: '',
            module_type_id: ''
        });
        setShowModal(true);
    };

    const openEditModal = (module) => {
        setEditingModule(module);
        setFormData({
            module_catalog_name: module.module_catalog_name,
            hours: module.hours,
            module_type_id: module.module_type_id
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.module_catalog_name.trim()) {
            setError('Module name is required');
            setTimeout(() => setError(''), 3000);
            return;
        }
        if (!formData.hours || formData.hours <= 0) {
            setError('Hours must be a positive number');
            setTimeout(() => setError(''), 3000);
            return;
        }
        if (!formData.module_type_id || formData.module_type_id <= 0) {
            setError('Module type ID must be a positive number');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        try {
            const url = editingModule
                ? `${API_BASE_URL}/subject/module-catalog/${editingModule.id}`
                : `${API_BASE_URL}/subject/module-catalog/`;

            const method = editingModule ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    module_catalog_name: formData.module_catalog_name,
                    hours: parseInt(formData.hours),
                    module_type_id: parseInt(formData.module_type_id)
                })
            });

            if (response.ok) {
                setSuccess(editingModule ? 'Module updated successfully!' : 'Module created successfully!');
                setShowModal(false);
                fetchModules();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const errorData = await response.json();
                setError('Error: ' + errorData.detail);
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            setError('Error: ' + error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (module) => {
        if (window.confirm(`Are you sure you want to delete "${module.module_catalog_name}"?`)) {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/subject/module-catalog/${module.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setSuccess('Module deleted successfully!');
                    fetchModules();
                    setTimeout(() => setSuccess(''), 3000);
                } else {
                    const errorData = await response.json();
                    setError('Error: ' + errorData.detail);
                    setTimeout(() => setError(''), 5000);
                }
            } catch (error) {
                setError('Error: ' + error.message);
                setTimeout(() => setError(''), 5000);
            } finally {
                setLoading(false);
            }
        }
    };

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
                <div
                    key={module.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden card-hover animate-fade-in"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(module)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(module)}
                                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                            {module.module_catalog_name}
                        </h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">Duration: <strong>{module.hours} hours</strong></span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                                <span className="text-sm">Type ID: <strong>{module.module_type_id}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // List View Component
    const ListView = () => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map((module) => (
                        <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{module.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{module.module_catalog_name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {module.hours} hours
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Type {module.module_type_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => openEditModal(module)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(module)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Subjects Management</h1>
                    <button
                        onClick={openCreateModal}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Module
                    </button>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search modules by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchModules()}
                                    className="input-field pl-10"
                                />
                                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button onClick={searchModules} className="btn-secondary">
                            Search
                        </button>
                        <button onClick={fetchModules} className="btn-secondary">
                            Refresh
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                title="Grid View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                title="List View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                        {success}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <p className="mt-4 text-white text-lg">Loading...</p>
                    </div>
                )}

                {/* Content */}
                {!loading && modules.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fade-in">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules found</h3>
                        <p className="text-gray-600">Click "Add Module" to create your first module catalog entry</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {viewMode === 'grid' ? <GridView /> : <ListView />}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                            onClick={() => setShowModal(false)}
                        ></div>

                        {/* Modal Card */}
                        <div
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {editingModule ? 'Edit Module' : 'Create New Module'}
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    {/* Module Name Input */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Module Name *</label>
                                        <input
                                            type="text"
                                            name="module_catalog_name"
                                            value={formData.module_catalog_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Hours Input */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Hours *</label>
                                        <input
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* Dynamic Module Type Dropdown */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2">Module Type *</label>
                                        <select
                                            name="module_type_id"
                                            value={formData.module_type_id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                                            required
                                        >
                                            <option value="">Select a Type</option>
                                            {moduleTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {/* Adjust 'type.name' to match whatever property holds the name in your API response */}
                                                    {type.module_name || type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {moduleTypes.length === 0 && !loading && (
                                            <p className="text-xs text-red-500 mt-1">No module types found.</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                                        >
                                            {loading ? 'Processing...' : (editingModule ? 'Update' : 'Create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleCatalogPage;