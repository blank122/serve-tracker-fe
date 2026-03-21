import React, { useState } from 'react';
import { X, Loader2, LayoutGrid } from 'lucide-react';
import api from '../../api/axios';

const CreateSectionModal = ({ isOpen, onClose, courseId, onSectionCreated }) => {
    const [sectionName, setSectionName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Use the axios instance instead of fetch
            const response = await api.post('/sections/section', {
                section_name: sectionName,
                course_id: parseInt(courseId)
            });

            setSectionName('');
            // Trigger the refresh callback from useSections
            if (onSectionCreated) onSectionCreated(response.data);
            onClose();
        } catch (err) {
            // Axios stores the backend error detail in err.response.data
            setError(err.response?.data?.detail || 'Failed to create section');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <LayoutGrid size={24} />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Create New Section</h2>
                    <p className="text-slate-500 text-sm mb-8">Set up a new class group for this course.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Section Name
                            </label>
                            <input
                                autoFocus
                                required
                                type="text"
                                placeholder="e.g. Fall 2026 - Morning"
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700 font-medium"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !sectionName.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Section'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSectionModal;