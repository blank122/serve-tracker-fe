import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Loader2, AlertCircle, Plus, Check, Clock, ChevronDown } from 'lucide-react';
import api from '../../api/axios';

const AddSubjectModal = ({ isOpen, onClose, sectionID, sectionName, onSubjectAdded }) => {
    const [instructors, setInstructors] = useState([]);
    const [moduleCatalogs, setModuleCatalogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        instructor_id: '',
        module_catalog_id: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            setFormData({ instructor_id: '', module_catalog_id: '' });
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [instRes, modRes] = await Promise.all([
                api.get('/academic/instructors/'),
                api.get('/subject/module-catalog/')
            ]);
            setInstructors(instRes.data || []);
            setModuleCatalogs(modRes.data || []);
        } catch (err) {
            setError('Failed to load dropdown data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.post('/academic/instructor-assignments/', {
                instructor_id: parseInt(formData.instructor_id),
                section_id: parseInt(sectionID),
                module_catalog_id: parseInt(formData.module_catalog_id)
            });

            setSuccess(true);
            if (onSubjectAdded) onSubjectAdded();
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add subject');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Subject</h2>
                            <p className="text-slate-500 text-sm font-medium">Assigning to <span className="text-blue-600">{sectionName}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 shadow-sm transition-all">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {success && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 font-bold text-sm border border-emerald-100 animate-bounce">
                            <Check size={18} /> Subject assigned successfully!
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-bold text-sm border border-red-100">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {/* Instructor Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={14} /> Assign Instructor
                        </label>
                        <div className="relative group">
                            <select
                                required
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all cursor-pointer"
                                value={formData.instructor_id}
                                onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                            >
                                <option value="" disabled>Select an instructor...</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>{inst.name} — {inst.email}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Subject Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <BookOpen size={14} /> Select Subject
                        </label>
                        <div className="relative group">
                            <select
                                required
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all cursor-pointer"
                                value={formData.module_catalog_id}
                                onChange={(e) => setFormData({ ...formData, module_catalog_id: e.target.value })}
                            >
                                <option value="" disabled>Select a subject...</option>
                                {moduleCatalogs.map(mod => (
                                    <option key={mod.id} value={mod.id}>
                                        {mod.module_catalog_name} ({mod.hours}h)
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={submitting || !formData.instructor_id || !formData.module_catalog_id}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                                <><Plus size={20} /> Add to Curriculum</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubjectModal;