import { BookOpen, RefreshCw, ArrowLeft, Table as TableIcon, X, FileSpreadsheet } from 'lucide-react';
import React from 'react';

const MasterGradesModal = ({ data, loading, onClose }) => {
    if (!loading && !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[98vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
                
                {/* Header Actions */}
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Master Grading Sheet</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Excel View Mode</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto bg-slate-100 p-2">
                    {loading ? (
                        <div className="h-full flex flex-col justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-slate-500">Processing calculations...</p>
                        </div>
                    ) : (
                        <div className="inline-block min-w-full align-middle border border-slate-400">
                            <table className="border-collapse bg-white text-[10px] leading-tight font-sans">
                                <thead>
                                    {/* Category Header Row */}
                                    <tr className="bg-slate-50 border-b border-slate-400">
                                        <th className="border border-slate-400 p-2 sticky left-0 bg-slate-50 z-30" rowSpan={3}>NAME OF STUDENTS</th>
                                        {Object.entries(data.categorized_headers).map(([category, subjects]) => (
                                            <th 
                                                key={category} 
                                                colSpan={subjects.length * 6} 
                                                className="border border-slate-400 p-1 text-center font-bold text-blue-900 bg-blue-50/50"
                                            >
                                                {category.toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Subject Name Row */}
                                    <tr className="bg-white">
                                        {Object.values(data.categorized_headers).flatMap(subjects => 
                                            subjects.map(sub => (
                                                <th key={sub.id} colSpan={6} className="border border-slate-400 p-1 text-center bg-slate-50">
                                                    <div className="uppercase font-bold text-[9px] truncate max-w-[200px]">{sub.name}</div>
                                                    <div className="text-[8px] text-slate-500">{sub.hours} HOURS</div>
                                                </th>
                                            ))
                                        )}
                                    </tr>
                                    {/* Excel Column Headers Row */}
                                    <tr className="bg-slate-50 text-center uppercase font-semibold">
                                        {Object.values(data.categorized_headers).flatMap(subjects => 
                                            subjects.map((_, i) => (
                                                <React.Fragment key={i}>
                                                    <th className="border border-slate-400 p-1 w-14">P.E & Quizzes</th>
                                                    <th className="border border-slate-400 p-1 w-12 text-blue-600">50%</th>
                                                    <th className="border border-slate-400 p-1 w-14">Modular Exam</th>
                                                    <th className="border border-slate-400 p-1 w-12">Ave</th>
                                                    <th className="border border-slate-400 p-1 w-12 text-blue-600">50%</th>
                                                    <th className="border border-slate-400 p-1 w-12 bg-yellow-50">Grade</th>
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((student, idx) => (
                                        <tr key={student.student_id} className="hover:bg-blue-50/30">
                                            <td className="border border-slate-400 p-2 font-bold sticky left-0 bg-white z-20 whitespace-nowrap uppercase">
                                                {student.student_name}
                                            </td>
                                            {Object.entries(data.categorized_headers).flatMap(([category, subjects]) => 
                                                subjects.map(sub => {
                                                    const grade = student.categories[category]?.find(g => g.subject === sub.name);
                                                    
                                                    // Calculating based on your formula
                                                    // Master Grade = ( (PE + Exam)/2 ) * (Hours / 100)
                                                    const pe = grade?.pe || 0;
                                                    const exam = grade?.exam || 0;
                                                    const pe50 = pe * 0.5;
                                                    const ave = (pe + exam) / 2;
                                                    const ave50 = ave * 0.5;
                                                    const finalGrade = (ave * (sub.hours / 100));

                                                    return (
                                                        <React.Fragment key={`${student.student_id}-${sub.id}`}>
                                                            <td className="border border-slate-300 p-1 text-center">{pe.toFixed(2)}</td>
                                                            <td className="border border-slate-300 p-1 text-center font-semibold text-blue-600 bg-blue-50/30">{pe50.toFixed(2)}</td>
                                                            <td className="border border-slate-300 p-1 text-center">{exam.toFixed(2)}</td>
                                                            <td className="border border-slate-300 p-1 text-center bg-slate-50">{ave.toFixed(2)}</td>
                                                            <td className="border border-slate-300 p-1 text-center font-semibold text-blue-600">{ave50.toFixed(2)}</td>
                                                            <td className="border border-slate-400 p-1 text-center font-bold bg-yellow-50">{finalGrade.toFixed(3)}</td>
                                                        </React.Fragment>
                                                    );
                                                })
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterGradesModal;