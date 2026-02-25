import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, GraduationCap, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const RosterModal = ({ isOpen, onClose, section }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🔄 useEffect triggered");
        console.log("isOpen:", isOpen);
        console.log("section:", section);
        console.log("section?.id:", section?.id);

        if (isOpen && section && section.id) {
            console.log("✅ Conditions met, will fetch data");
            const fetchRoster = async () => {
                try {
                    setLoading(true);
                    console.log("🚀 Making API call to:", `/sections/${section.id}/students`);
                    const response = await api.get(`/sections/${section.id}/students`);
                    console.log("✅ API call successful:", response);
                    setStudents(response.data || []);
                } catch (error) {
                    console.error("❌ API call failed:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRoster();
        } else {
            console.log("❌ Conditions not met, skipping fetch");
            console.log("isOpen:", isOpen);
            console.log("section exists:", !!section);
            console.log("section.id exists:", section?.id);
        }
    }, [isOpen, section?.id]);

    if (!isOpen) return null;

    const filteredStudents = students.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-slate-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find a student..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Student List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="animate-spin mb-2" />
                            <span className="text-sm font-medium">Loading students...</span>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {student.first_name?.[0]}{student.last_name?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {student.last_name}, {student.first_name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                                            {student.student_id}
                                        </p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 text-xs font-bold text-red-400 hover:text-red-600 transition-all px-3 py-1">
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-400 text-sm font-medium">
                            No students found in this section.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Enrolled: {filteredStudents.length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RosterModal;