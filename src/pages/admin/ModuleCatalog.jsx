import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const ModuleCatalogPage = () => {
    // --- State Management ---
    const [modules, setModules] = useState([]);
    const [moduleTypes, setModuleTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState({ error: '', success: '' });
    const [formData, setFormData] = useState({
        module_catalog_name: '',
        hours: '',
        module_type_id: ''
    });

    // --- Notifications Helper ---
    const notify = (type, msg) => {
        setStatus({ ...status, [type]: msg });
        setTimeout(() => setStatus({ error: '', success: '' }), 4000);
    };

    // --- API Logic ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [modRes, typeRes] = await Promise.all([
                fetch(`${API_BASE_URL}/subject/module-catalog`),
                fetch(`${API_BASE_URL}/subject/module-type`)
            ]);
            const mods = await modRes.json();
            const types = await typeRes.json();
            setModules(Array.isArray(mods) ? mods : []);
            setModuleTypes(Array.isArray(types) ? types : []);
        } catch (err) {
            notify('error', 'Failed to sync with server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return fetchData();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/subject/search/?name=${searchTerm}`);
            const data = await res.json();
            setModules(data);
        } catch (err) {
            notify('error', 'Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const isEdit = !!editingModule;
            const url = isEdit 
                ? `${API_BASE_URL}/subject/module-catalog/${editingModule.id}`
                : `${API_BASE_URL}/subject/module-catalog/`;
            
            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    hours: parseInt(formData.hours),
                    module_type_id: parseInt(formData.module_type_id)
                })
            });

            if (res.ok) {
                notify('success', `Module ${isEdit ? 'updated' : 'created'}!`);
                setShowModal(false);
                fetchData();
            } else {
                const err = await res.json();
                notify('error', err.detail || 'Action failed');
            }
        } catch (err) {
            notify('error', 'Server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async (module) => {
        if (!window.confirm(`Delete "${module.module_catalog_name}"?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/subject/module-catalog/${module.id}`, { method: 'DELETE' });
            if (res.ok) {
                notify('success', 'Deleted successfully');
                fetchData();
            }
        } catch (err) {
            notify('error', 'Delete failed');
        } finally {
            setLoading(false);
        }
    };

    // --- UI Helpers ---
    const getTypeName = (id) => {
        const type = moduleTypes.find(t => t.id === parseInt(id));
        return type ? (type.module_name || type.name) : `Type ${id}`;
    };

    const ActionButtons = ({ item }) => (
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    setEditingModule(item);
                    setFormData({
                        module_catalog_name: item.module_catalog_name,
                        hours: item.hours,
                        module_type_id: item.module_type_id
                    });
                    setShowModal(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
                onClick={() => confirmDelete(item)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Module Catalog</h1>
                        <p className="text-slate-500 mt-1">Manage curriculum modules and credit hours.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingModule(null);
                            setFormData({ module_catalog_name: '', hours: '', module_type_id: '' });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-blue-200 shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        New Module
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[280px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by module name..."
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >Grid</button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >List</button>
                    </div>
                </div>

                {/* Alerts */}
                {status.error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl animate-fade-in">{status.error}</div>}
                {status.success && <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl animate-fade-in">{status.success}</div>}

                {/* Main Content Area */}
                {loading && !showModal ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-medium">Fetching modules...</p>
                    </div>
                ) : modules.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Empty Catalog</h3>
                        <p className="text-slate-500">No modules match your criteria.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {modules.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl font-bold">#{item.id}</div>
                                    <ActionButtons item={item} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{item.module_catalog_name}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{item.hours} hrs</span>
                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold">{getTypeName(item.module_type_id)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Module</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {modules.map(item => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-800">{item.module_catalog_name}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.hours}h</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">{getTypeName(item.module_type_id)}</span></td>
                                        <td className="px-6 py-4 flex justify-end"><ActionButtons item={item} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal Container */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)} />
                        
                        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 animate-slide-up">
                            <div className="p-8">
                                <h2 className="text-2xl font-black text-slate-900 mb-6">{editingModule ? 'Update Module' : 'Add New Module'}</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Name</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.module_catalog_name}
                                            onChange={e => setFormData({...formData, module_catalog_name: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Hours</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={formData.hours}
                                                onChange={e => setFormData({...formData, hours: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={formData.module_type_id}
                                                onChange={e => setFormData({...formData, module_type_id: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                {moduleTypes.map(t => <option key={t.id} value={t.id}>{t.module_name || t.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 disabled:opacity-50 transition-all">
                                            {loading ? 'Saving...' : (editingModule ? 'Save Changes' : 'Create Module')}
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