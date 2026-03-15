import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react'; // Added X and ChevronDown
import api from '../../api/axios';

const AddCourseModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        course_code: '',
        name: '',
        status: 'not yet started',
        start_date: '',
        end_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            code: formData.course_code, // Match the schema here
            name: formData.name,
            status: formData.status,
            start_date: formData.start_date,
            end_date: formData.end_date
        };
        try {
            // Replace with your actual api instance call
            await api.post('/courses/store/', payload);
            alert("Course created successfully!");
            onRefresh(); // Call this to reload the course list
            onClose();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create course");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800">New Academic Program</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Course Code</label>
                            <input required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                                value={formData.course_code} onChange={(e) => setFormData({ ...formData, course_code: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
                            <select className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold appearance-none"
                                value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="not yet started">Upcoming</option>
                                <option value="starting">Active</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Program Name</label>
                        <input required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    {/* --- Date Inputs --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Date</label>
                            <input required type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600"
                                value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">End Date</label>
                            <input required type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600"
                                value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-xs uppercase text-slate-400">Cancel</button>
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-200">Create Program</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddCourseModal;