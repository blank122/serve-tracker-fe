import React, { useState, useEffect } from 'react';
import { X, Save, User, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

const GradingModal = ({ isOpen, onClose, moduleID, moduleName, sectionID }) => {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch roster when modal opens
    useEffect(() => {
        const fetchRoster = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/sections/${sectionID}/modules-catalog/${moduleID}/grading-roster`);

                // Reverse weighting: Database (weighted) * 2 = Raw Score
                const rawData = response.data.map(student => ({
                    ...student,
                    pe_quizzes_score: Math.round(student.pe_quizzes_score * 2),
                    modular_exam_score: Math.round(student.modular_exam_score * 2)
                }));

                setRoster(rawData);
            } catch (err) {
                console.error("Error fetching grading roster:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && moduleID) {
            fetchRoster();
        }
    }, [isOpen, moduleID, sectionID]);

    // Inside handleInputChange
    const handleInputChange = (studentId, field, value) => {
        // Parse to int immediately to strip decimals
        const cleanValue = value === '' ? '' : parseInt(value, 10);
        setRoster(prev => prev.map(row =>
            row.student_id === studentId ? { ...row, [field]: cleanValue } : row
        ));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const payload = {
                module_id: moduleID,
                roster: roster.map(s => ({
                    student_id: s.student_id,
                    // Ensure these are absolute Numbers, not strings from the input
                    pe_quizzes_score: Number(s.pe_quizzes_score || 0) / 2,
                    modular_exam_score: Number(s.modular_exam_score || 0) / 2
                }))
            };

            const response = await api.post('sections/grades/upsert-bulk', payload);

            // Success path
            alert("Grades saved successfully!");
            onClose(); // Close the modal

        } catch (err) {
            // Error path: Extract the error message from FastAPI
            const errorDetail = err.response?.data?.detail;
            const errorMessage = Array.isArray(errorDetail)
                ? errorDetail.map(e => `${e.loc[1]}: ${e.msg}`).join("\n")
                : errorDetail || "Check your network connection.";

            console.error("Save failed:", err.response?.data);
            alert(` Error Saving Grades:\n${errorMessage}`);

            // We usually don't onClose() on error so the teacher doesn't lose their typing
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Grade Input</h2>
                        <p className="text-blue-600 font-bold text-sm uppercase">{moduleName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Excel-like Table */}
                <div className="flex-1 overflow-auto p-8">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-slate-400">Loading Student Roster...</div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200">
                                    <th className="pb-4 pl-4">Student Name</th>
                                    <th className="pb-4">PE Quizzes Raw Score</th>
                                    <th className="pb-4">Modular Exam Raw Score</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {roster.map((student) => (
                                    <tr key={student.student_id} className="group hover:bg-blue-50/50 transition-colors">
                                        <td className="py-4 pl-4 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {student.full_name[0]}
                                            </div>
                                            <span className="font-bold text-slate-700">{student.full_name}</span>
                                        </td>
                                        <td className="py-4">
                                            <input
                                                type="number"
                                                className="w-20 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                                value={student.pe_quizzes_score}
                                                onChange={(e) => handleInputChange(student.student_id, 'pe_quizzes_score', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-4">
                                            <input
                                                type="number"
                                                className="w-20 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                                value={student.modular_exam_score}
                                                onChange={(e) => handleInputChange(student.student_id, 'modular_exam_score', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-4">
                                            {student.is_graded ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                                                    <CheckCircle2 size={12} /> Graded
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-[10px] font-black uppercase">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Grades"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradingModal;