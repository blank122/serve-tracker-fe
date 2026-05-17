import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen } from 'lucide-react';
import api from '../../api/axios'; // Adjust path if needed

const LessonRosterModal = ({ isOpen, onClose, lesson }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoster = async () => {
            try {
                setLoading(true);
                // Hit our new endpoint using the section_id tied to this lesson
                const response = await api.get(`/academic-directory/sections/${lesson.section_id}/roster`);
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching roster:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && lesson?.section_id) {
            fetchRoster();
        } else {
            setStudents([]);
        }
    }, [isOpen, lesson]);

    if (!isOpen || !lesson) return null;

    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'graduated') return 'text-emerald-600 bg-emerald-50';
        if (s === 'failed') return 'text-red-600 bg-red-50';
        if (s === 'dropped') return 'text-amber-600 bg-amber-50';
        return 'text-blue-600 bg-blue-50';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Class Roster</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{lesson.lesson_code}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 font-medium text-sm">{lesson.section_name}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                         <BookOpen className="text-slate-400" size={20} />
                         <div>
                             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Lesson Name</p>
                             <p className="font-bold text-slate-700">{lesson.lesson_name}</p>
                         </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 font-bold text-slate-400">Loading Student Roster...</div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 font-medium">
                            No students currently enrolled in this section.
                        </div>
                    ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200">
                                        <th className="py-4 pl-6">Student Name</th>
                                        <th className="py-4">ID Number</th>
                                        <th className="py-4 pr-6 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {students.map((student, idx) => (
                                        <tr key={idx} className="group hover:bg-indigo-50/50 transition-colors">
                                            <td className="py-4 pl-6 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {student.first_name[0]}
                                                </div>
                                                <span className="font-bold text-slate-700">
                                                    {student.first_name} {student.last_name}
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-500 text-sm font-medium font-mono">
                                                {student.student_id}
                                            </td>
                                            <td className="py-4 pr-6 text-right">
                                                <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(student.status)}`}>
                                                    {student.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all">
                        Close Roster
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonRosterModal;