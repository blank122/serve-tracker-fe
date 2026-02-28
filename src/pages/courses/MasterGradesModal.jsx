import { X, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import React, { useState, useMemo } from 'react';

const MasterGradesModal = ({ data, loading, onClose }) => {
    // 1. ALL HOOKS MUST BE AT THE TOP LEVEL
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const TOTAL_CURRICULUM_HOURS = 748;
    const PASSING_GRADE = 75;

    // 2. MOVE CALCULATION HELPER OUTSIDE OR DEFINE IT BEFORE USEMEMO
    const calculateStudentMetrics = (student, currentData) => {
        if (!currentData) return { acad70: 0, finalGrade: 0 };
        
        let sumOfModuleGrades = 0;
        let compWeight = 0;
        let nonAcadWeight = 0;

        Object.entries(currentData.categorized_headers).forEach(([category, subjects]) => {
            subjects.forEach(sub => {
                const gradeData = student.categories[category]?.find(g => g.subject === sub.name);
                const valPE = gradeData?.pe || 0;
                const valExam = gradeData?.exam || 0;

                if (category === "Final Assessments") {
                    if (sub.name.toLowerCase().includes("comprehensive")) {
                        compWeight = (valPE / 285) * 100 * 0.10;
                    } else {
                        nonAcadWeight = valPE * 0.20;
                    }
                } else {
                    const average = valPE + valExam;
                    sumOfModuleGrades += (average * (sub.hours / 100));
                }
            });
        });

        const acad70 = (sumOfModuleGrades / TOTAL_CURRICULUM_HOURS) * 100 * 0.70;
        const finalGrade = acad70 + compWeight + nonAcadWeight;
        return { acad70, finalGrade };
    };

    // 3. USEMEMO MUST RUN EVERY TIME (WE HANDLE NULL INSIDE)
    const sortedStudents = useMemo(() => {
        if (!data || !data.data) return [];

        let items = [...data.data];
        items.sort((a, b) => {
            if (sortConfig.key === 'name') {
                return sortConfig.direction === 'asc' 
                    ? a.student_name.localeCompare(b.student_name)
                    : b.student_name.localeCompare(a.student_name);
            }
            
            const metricsA = calculateStudentMetrics(a, data);
            const metricsB = calculateStudentMetrics(b, data);
            
            if (sortConfig.key === 'final') {
                return sortConfig.direction === 'asc' 
                    ? metricsA.finalGrade - metricsB.finalGrade 
                    : metricsB.finalGrade - metricsA.finalGrade;
            }
            return 0;
        });
        return items;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />;
    };

    // 4. NOW IT IS SAFE TO DO CONDITIONAL RETURNS FOR THE UI
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-500 font-medium">Processing grades...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[98vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
                
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Master Grading Sheet</h2>
                        <div className="flex gap-4 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-slate-500"><div className="w-2 h-2 bg-green-500 rounded-full"></div> PASSED (75+)</span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-500"><div className="w-2 h-2 bg-red-500 rounded-full"></div> FAILED (Below 75)</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto bg-slate-100 p-2">
                    <div className="inline-block min-w-full align-middle border border-slate-400 bg-white">
                        <table className="border-collapse text-[10px] leading-tight">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="border border-slate-400 p-2 sticky left-0 bg-slate-50 z-30 cursor-pointer hover:bg-slate-100" rowSpan={3} onClick={() => requestSort('name')}>
                                        <div className="flex items-center justify-center uppercase">NAME OF STUDENTS <SortIcon column="name" /></div>
                                    </th>
                                    {Object.entries(data.categorized_headers).map(([category, subjects]) => (
                                        <th key={category} colSpan={category === "Final Assessments" ? subjects.length * 2 : subjects.length * 4} className={`border border-slate-400 p-1 font-bold ${category === "Final Assessments" ? 'bg-orange-100 text-orange-900' : 'bg-blue-50/50 text-blue-900'}`}>
                                            {category.toUpperCase()}
                                        </th>
                                    ))}
                                    <th className="border border-slate-400 p-1 bg-green-100 text-green-900 font-bold" colSpan={2} rowSpan={2}>SUMMARY</th>
                                </tr>
                                <tr className="bg-white">
                                    {Object.entries(data.categorized_headers).flatMap(([category, subjects]) => 
                                        subjects.map(sub => (
                                            <th key={sub.id} colSpan={category === "Final Assessments" ? 2 : 4} className="border border-slate-400 p-1 bg-slate-50 font-bold uppercase">
                                                <div className="truncate max-w-[120px]">{sub.name}</div>
                                            </th>
                                        ))
                                    )}
                                </tr>
                                <tr className="bg-slate-50 font-semibold text-center">
                                    {Object.entries(data.categorized_headers).flatMap(([category, subjects]) => 
                                        subjects.map((sub) => (
                                            category === "Final Assessments" ? (
                                                <React.Fragment key={sub.id}><th className="border border-slate-400 p-1 w-12">RAW</th><th className="border border-slate-400 p-1 w-12">WGT</th></React.Fragment>
                                            ) : (
                                                <React.Fragment key={sub.id}>
                                                    <th className="border border-slate-400 p-1 w-10">P.E</th><th className="border border-slate-400 p-1 w-10">EXAM</th>
                                                    <th className="border border-slate-400 p-1 w-10">AVE</th><th className="border border-slate-400 p-1 w-12">GRD</th>
                                                </React.Fragment>
                                            )
                                        ))
                                    )}
                                    <th className="border border-slate-400 p-1 w-16 bg-green-50 text-green-700 font-bold">70% ACAD</th>
                                    <th className="border border-slate-400 p-1 w-20 bg-green-600 text-white font-bold cursor-pointer" onClick={() => requestSort('final')}>
                                        <div className="flex items-center justify-center">FINAL <SortIcon column="final" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStudents.map((student) => {
                                    const metrics = calculateStudentMetrics(student, data);
                                    const isPassed = metrics.finalGrade >= PASSING_GRADE;

                                    return (
                                        <tr key={student.student_id} className="hover:bg-blue-50/40">
                                            <td className="border border-slate-400 p-2 font-bold sticky left-0 bg-white z-20 whitespace-nowrap uppercase">
                                                {student.student_name}
                                            </td>
                                            {Object.entries(data.categorized_headers).flatMap(([category, subjects]) => 
                                                subjects.map(sub => {
                                                    const gd = student.categories[category]?.find(g => g.subject === sub.name);
                                                    const valPE = gd?.pe || 0;
                                                    const valExam = gd?.exam || 0;

                                                    if (category === "Final Assessments") {
                                                        const weight = sub.name.toLowerCase().includes("comprehensive") ? (valPE / 285) * 100 * 0.10 : valPE * 0.20;
                                                        return (
                                                            <React.Fragment key={sub.id}>
                                                                <td className="border border-slate-300 p-1 text-center bg-white">{valPE.toFixed(1)}</td>
                                                                <td className="border border-slate-400 p-1 text-center font-bold bg-orange-50">{weight.toFixed(2)}</td>
                                                            </React.Fragment>
                                                        );
                                                    }

                                                    const average = valPE + valExam;
                                                    const modGrade = average * (sub.hours / 100);

                                                    return (
                                                        <React.Fragment key={sub.id}>
                                                            <td className="border border-slate-300 p-1 text-center">{valPE.toFixed(1)}</td>
                                                            <td className="border border-slate-300 p-1 text-center">{valExam.toFixed(1)}</td>
                                                            <td className={`border border-slate-300 p-1 text-center font-bold ${average >= PASSING_GRADE ? 'text-green-600' : 'text-red-600'}`}>
                                                                {average.toFixed(1)}
                                                            </td>
                                                            <td className="border border-slate-400 p-1 text-center font-bold bg-yellow-50">{modGrade.toFixed(2)}</td>
                                                        </React.Fragment>
                                                    );
                                                })
                                            )}
                                            <td className="border border-slate-400 p-1 text-center font-bold bg-green-50 text-green-700">
                                                {metrics.acad70.toFixed(2)}
                                            </td>
                                            <td className={`border border-slate-400 p-1 text-center font-black text-white ${isPassed ? 'bg-green-600' : 'bg-red-600'}`}>
                                                {metrics.finalGrade.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterGradesModal;