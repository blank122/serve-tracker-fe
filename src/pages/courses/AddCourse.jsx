import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';

const AddCourseModal = ({ isOpen, onClose, onRefresh, courseToEdit = null }) => {
    const [formData, setFormData] = useState({
        course_code: '',
        name: '',
        status: 'not yet started',
        start_date: '',
        end_date: ''
    });

    // 1. Determine if we are adding or editing based on the prop
    const isEditMode = Boolean(courseToEdit);

    // 2. Populate the form when the modal opens or the courseToEdit changes
    useEffect(() => {
        if (isOpen && isEditMode) {
            setFormData({
                course_code: courseToEdit.code || '',
                name: courseToEdit.name || '',
                status: courseToEdit.status || 'not yet started',
                // Slicing just in case your API returns full ISO timestamps (YYYY-MM-DDTHH:mm:ss)
                start_date: courseToEdit.start_date ? courseToEdit.start_date.split('T')[0] : '',
                end_date: courseToEdit.end_date ? courseToEdit.end_date.split('T')[0] : ''
            });
        } else if (isOpen && !isEditMode) {
            // Reset to default if opening in Add Mode
            setFormData({
                course_code: '',
                name: '',
                status: 'not yet started',
                start_date: '',
                end_date: ''
            });
        }
    }, [isOpen, courseToEdit, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            code: formData.course_code,
            name: formData.name,
            status: formData.status,
            start_date: formData.start_date,
            end_date: formData.end_date
        };

        try {
            // 3. Conditionally call PUT or POST
            if (isEditMode) {
                await api.put(`/courses/${courseToEdit.id}`, payload);
                alert("Course updated successfully!");
            } else {
                await api.post('/courses/store/', payload);
                alert("Course created successfully!");
            }
            
            onRefresh(); 
            onClose();
        } catch (err) {
            alert(err.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} course`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    {/* Dynamic Title */}
                    <h2 className="text-xl font-black text-slate-800">
                        {isEditMode ? 'Edit Academic Program' : 'New Academic Program'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                        <X size={20} />
                    </button>
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
                                <option value="completed">Finished</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Program Name</label>
                        <input required type="text" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

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
                        {/* Dynamic Button Text */}
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-200">
                            {isEditMode ? 'Save Changes' : 'Create Program'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;