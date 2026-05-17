import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, GraduationCap, Award, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios'; // IMPORTANT: Adjust this path to match your project structure!

const StudentProfileModal = ({ isOpen, onClose, studentId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/academic-directory/students/${studentId}`);
                setProfile(response.data);
            } catch (err) {
                console.error("Error fetching student profile:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && studentId) {
            fetchProfile();
        } else {
            // Reset state when closed
            setProfile(null);
        }
    }, [isOpen, studentId]);

    if (!isOpen) return null;

    // Helper to colorize status based on the grading modal's aesthetic
    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'graduated') return 'text-emerald-600 bg-emerald-50';
        if (s === 'failed') return 'text-red-600 bg-red-50';
        if (s === 'dropped') return 'text-amber-600 bg-amber-50';
        return 'text-blue-600 bg-blue-50'; // Default Active
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Profile</h2>
                            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{studentId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-auto p-8">
                    {loading || !profile ? (
                        <div className="text-center py-20 font-bold text-slate-400">Loading Profile Details...</div>
                    ) : (
                        <div className="space-y-8">

                            {/* Profile Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Name */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                                        <User size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Full Name</span>
                                    </div>
                                    <p className="font-bold text-slate-700">{profile.first_name} {profile.last_name}</p>
                                </div>

                                {/* Status */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                                        <Award size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusStyle(profile.status)}`}>
                                        {profile.status || 'Active'}
                                    </span>
                                </div>

                                {/* Course & Section */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                                        <BookOpen size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Enrollment</span>
                                    </div>
                                    <p className="font-bold text-slate-700">{profile.course_code}</p>
                                    <p className="text-xs font-medium text-slate-500">{profile.section_name}</p>
                                </div>

                                {/* Rank & Batch */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                                        <GraduationCap size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Rank / Batch</span>
                                    </div>
                                    <p className="font-bold text-slate-700">{profile.rank || 'N/A'}</p>
                                    <p className="text-xs font-medium text-slate-500">{profile.batch_code || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Enrolled Subjects Table (Mimicking Grading Roster style) */}
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                    <BookOpen size={20} className="text-slate-400" />
                                    Enrolled Subjects
                                </h3>

                                {profile.enrolled_subjects?.length === 0 ? (
                                    <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 font-medium">
                                        No subjects currently assigned to this section.
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200">
                                                    <th className="py-4 pl-6">Subject Name</th>
                                                    <th className="py-4">Instructor</th>
                                                    <th className="py-4 text-center">PE (Raw)</th>
                                                    <th className="py-4 text-center">Modular (Raw)</th>
                                                    <th className="py-4 text-center">Status</th>
                                                    <th className="py-4 pr-6 text-right">Req. Hours</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {profile.enrolled_subjects.map((sub, idx) => (
                                                    <tr key={idx} className="group hover:bg-blue-50/50 transition-colors">
                                                        <td className="py-4 pl-6 font-bold text-slate-700">
                                                            {sub.subject_name}
                                                        </td>
                                                        <td className="py-4 text-slate-500 text-sm font-medium">
                                                            {sub.instructor_name}
                                                        </td>

                                                        {/* Grades */}
                                                        <td className="py-4 text-center font-mono font-bold text-slate-700">
                                                            {sub.pe_raw_score !== null ? sub.pe_raw_score : '-'}
                                                        </td>
                                                        <td className="py-4 text-center font-mono font-bold text-slate-700">
                                                            {sub.modular_raw_score !== null ? sub.modular_raw_score : '-'}
                                                        </td>

                                                        {/* Status */}
                                                        <td className="py-4 text-center">
                                                            {sub.is_graded ? (
                                                                <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase bg-emerald-50 px-2 py-1 rounded-md">
                                                                    <CheckCircle2 size={12} /> Graded
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase bg-amber-50 px-2 py-1 rounded-md">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="py-4 pr-6 text-right">
                                                            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-xs font-bold font-mono">
                                                                <Clock size={12} />
                                                                {sub.required_hours}h
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
                    >
                        Close Profile
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StudentProfileModal;