// components/RosterModal.js
import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, GraduationCap, Loader2, UserMinus, Edit2, Save, XCircle, Trash2, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import api from '../../api/axios';

const RosterModal = ({ isOpen, onClose, section, onStudentUpdate }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Form states
    const [enrollForm, setEnrollForm] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        batch_code: '',
        status: 'active',
        section_id: ''
    });
    
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        status: ''
    });

    // Fetch roster when modal opens
    useEffect(() => {
        if (isOpen && section && section.id) {
            fetchRoster();
        }
    }, [isOpen, section?.id]);

    const fetchRoster = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/sections/${section.id}/students`);
            setStudents(response.data || []);
        } catch (error) {
            console.error("Error fetching roster:", error);
            setError(error.response?.data?.detail || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    // Function to generate student ID based on batch code
    const generateStudentId = async (batchCode) => {
        if (!batchCode) return '';
        
        try {
            // Fetch all students to find the latest number for this batch
            const response = await api.get('/students/');
            const allStudents = response.data || [];
            
            // Filter students with the same batch code
            const batchStudents = allStudents.filter(s => s.batch_code === batchCode);
            
            // Get the highest number from existing student IDs
            let highestNumber = 0;
            const pattern = new RegExp(`^SN-${batchCode}-(\\d+)$`);
            
            batchStudents.forEach(student => {
                const match = student.student_id.match(pattern);
                if (match) {
                    const num = parseInt(match[1]);
                    if (num > highestNumber) highestNumber = num;
                }
            });
            
            // Increment the number for new student
            const nextNumber = highestNumber + 1;
            const paddedNumber = nextNumber.toString().padStart(3, '0');
            
            return `SN-${batchCode}-${paddedNumber}`;
        } catch (error) {
            console.error("Error generating student ID:", error);
            // Fallback: generate without checking existing
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `SN-${batchCode}-${randomNum}`;
        }
    };

    // Auto-generate student ID when batch code changes
    const handleBatchCodeChange = async (batchCode) => {
        setEnrollForm({...enrollForm, batch_code: batchCode});
        
        if (batchCode && batchCode.trim()) {
            const newStudentId = await generateStudentId(batchCode.trim());
            setEnrollForm(prev => ({...prev, student_id: newStudentId, batch_code: batchCode}));
        } else {
            setEnrollForm(prev => ({...prev, student_id: '', batch_code: batchCode}));
        }
    };

    // Manual refresh of student ID
    const handleRefreshStudentId = async () => {
        if (enrollForm.batch_code) {
            const newStudentId = await generateStudentId(enrollForm.batch_code);
            setEnrollForm({...enrollForm, student_id: newStudentId});
        } else {
            setError('Please enter a batch code first');
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        
        if (!enrollForm.student_id || !enrollForm.first_name || !enrollForm.last_name || !enrollForm.batch_code) {
            setError('Please fill in all required fields (Student ID, Name, Batch Code)');
            return;
        }
        
        setEnrollLoading(true);
        setError(null);
        
        try {
            const studentData = {
                student_id: enrollForm.student_id,
                first_name: enrollForm.first_name,
                last_name: enrollForm.last_name,
                batch_code: enrollForm.batch_code,
                status: 'active',
                section_id: section.id
            };
            
            await api.post('/students/', studentData);
            
            // Reset form and refresh list
            setEnrollForm({
                student_id: '',
                first_name: '',
                last_name: '',
                batch_code: '',
                status: 'active',
                section_id: ''
            });
            setShowEnrollForm(false);
            await fetchRoster();
            
            // Notify parent component
            if (onStudentUpdate) onStudentUpdate();
            
        } catch (error) {
            console.error("Error enrolling student:", error);
            setError(error.response?.data?.detail || 'Failed to enroll student');
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleUpdateStudent = async (studentId) => {
        setUpdateLoading(true);
        setError(null);
        
        try {
            // Only include editable fields (student_id and batch_code are NOT editable)
            const updateData = {};
            if (editForm.first_name && editForm.first_name !== editingStudent.first_name) {
                updateData.first_name = editForm.first_name;
            }
            if (editForm.last_name && editForm.last_name !== editingStudent.last_name) {
                updateData.last_name = editForm.last_name;
            }
            if (editForm.status && editForm.status !== editingStudent.status) {
                updateData.status = editForm.status;
            }
            
            if (Object.keys(updateData).length === 0) {
                setEditingStudent(null);
                setUpdateLoading(false);
                return;
            }
            
            await api.put(`/students/${studentId}`, updateData);
            
            // Refresh list
            await fetchRoster();
            setEditingStudent(null);
            
            // Notify parent component
            if (onStudentUpdate) onStudentUpdate();
            
        } catch (error) {
            console.error("Error updating student:", error);
            setError(error.response?.data?.detail || 'Failed to update student');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDropStudent = async (studentId, studentName) => {
        if (!window.confirm(`Are you sure you want to drop ${studentName}? This will mark them as dropped and remove them from this section.`)) {
            return;
        }
        
        setDeleteLoading(true);
        setError(null);
        
        try {
            await api.patch(`/students/${studentId}/drop`);
            await fetchRoster();
            if (onStudentUpdate) onStudentUpdate();
        } catch (error) {
            console.error("Error dropping student:", error);
            setError(error.response?.data?.detail || 'Failed to drop student');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleHardDelete = async (studentId, studentName) => {
        if (!window.confirm(`⚠️ WARNING: This will permanently delete ${studentName} from the system.\n\nThis action cannot be undone. Continue?`)) {
            return;
        }
        
        setDeleteLoading(true);
        setError(null);
        
        try {
            await api.delete(`/students/${studentId}`);
            await fetchRoster();
            if (onStudentUpdate) onStudentUpdate();
        } catch (error) {
            console.error("Error deleting student:", error);
            setError(error.response?.data?.detail || 'Failed to delete student');
        } finally {
            setDeleteLoading(false);
        }
    };

    const startEditing = (student) => {
        setEditingStudent(student);
        setEditForm({
            first_name: student.first_name,
            last_name: student.last_name,
            status: student.status
        });
    };

    const cancelEditing = () => {
        setEditingStudent(null);
        setEditForm({
            first_name: '',
            last_name: '',
            status: ''
        });
    };

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.batch_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'graduated': return 'bg-purple-100 text-purple-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'dropped': return 'bg-gray-100 text-gray-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <GraduationCap size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Section Roster</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {section?.section_name || 'Unknown Section'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto hover:bg-red-100 rounded p-1">
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Search and Enroll Button */}
                <div className="p-6 border-b border-slate-50">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, student ID, or batch code..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowEnrollForm(!showEnrollForm)}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors text-sm font-medium shadow-lg shadow-blue-200"
                        >
                            <UserPlus size={18} />
                            Enroll
                        </button>
                    </div>
                </div>

                {/* Enroll Form */}
                {showEnrollForm && (
                    <div className="p-6 bg-blue-50/30 border-b border-blue-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <UserPlus size={16} className="text-blue-600" />
                            Enroll New Student
                        </h3>
                        <form onSubmit={handleEnrollStudent} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Batch Code *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., PSBRC2026"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        value={enrollForm.batch_code}
                                        onChange={(e) => handleBatchCodeChange(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Student ID *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Auto-generated from batch code"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono text-xs"
                                            value={enrollForm.student_id}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRefreshStudentId}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
                                            title="Refresh student ID"
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        value={enrollForm.first_name}
                                        onChange={(e) => setEnrollForm({...enrollForm, first_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        value={enrollForm.last_name}
                                        onChange={(e) => setEnrollForm({...enrollForm, last_name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded-lg">
                                ℹ️ Student ID format: <strong className="font-mono">SN-{enrollForm.batch_code || 'BATCHCODE'}-XXX</strong>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowEnrollForm(false)}
                                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={enrollLoading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {enrollLoading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                                    Enroll Student
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Student List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="animate-spin mb-2" size={24} />
                            <span className="text-sm font-medium">Loading students...</span>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                                {editingStudent?.id === student.id ? (
                                    // Edit Mode - Only name and status are editable
                                    <div className="flex-1 space-y-3">
                                        {/* Read-only Student Info Section */}
                                        <div className="bg-slate-50 p-3 rounded-lg mb-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                <Lock size={12} />
                                               
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-xs text-slate-500">Student ID:</span>
                                                    <p className="font-mono text-slate-700 font-medium">{student.student_id}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500">Batch Code:</span>
                                                    <p className="font-mono text-slate-700 font-medium">{student.batch_code}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Editable Fields */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    value={editForm.first_name}
                                                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    value={editForm.last_name}
                                                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                    Status
                                                </label>
                                                <select
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="graduated">Graduated</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="dropped">Dropped</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end mt-3">
                                            <button
                                                onClick={cancelEditing}
                                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStudent(student.id)}
                                                disabled={updateLoading}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {updateLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {student.first_name?.[0]}{student.last_name?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {student.last_name}, {student.first_name}
                                                    </p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeColor(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                                                    <span className="font-mono">{student.student_id}</span> • Batch: <span className="font-mono">{student.batch_code}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(student)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                                title="Edit student (Name & Status only)"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDropStudent(student.id, `${student.first_name} ${student.last_name}`)}
                                                disabled={deleteLoading}
                                                className="p-1.5 hover:bg-yellow-50 rounded-lg text-yellow-600 transition-colors"
                                                title="Drop student"
                                            >
                                                <UserMinus size={14} />
                                            </button>
                                            
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-400 text-sm font-medium">
                            {searchTerm ? 'No matching students found.' : 'No students enrolled in this section.'}
                        </div>
                    )}
                </div>

                {/* Footer with Stats */}
                <div className="p-6 bg-slate-50/50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Enrolled: {filteredStudents.length}
                    </p>
                    <div className="flex gap-2 text-[10px] font-bold">
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded">Active: {students.filter(s => s.status === 'active').length}</span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">Graduated: {students.filter(s => s.status === 'graduated').length}</span>
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded">Failed: {students.filter(s => s.status === 'failed').length}</span>
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded">Dropped: {students.filter(s => s.status === 'dropped').length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RosterModal;