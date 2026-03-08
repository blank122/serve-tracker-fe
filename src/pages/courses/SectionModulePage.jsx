import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, ArrowLeft, Table as TableIcon, X, FileSpreadsheet } from 'lucide-react';
import ModuleCatalog from './ModuleCatalog';
import api from '../../api/axios';
import MasterGradesModal from './MasterGradesModal';
import * as XLSX from 'xlsx';

const SectionModulePage = ({ sectionId }) => {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [moduleStats, setModuleStats] = useState({ totalModules: 0, totalHours: 0, categoryCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Master Sheet States ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [masterData, setMasterData] = useState(null);
    const [masterLoading, setMasterLoading] = useState(false);

    const fetchModules = async () => {
        if (!sectionId) return;
        try {
            setLoading(true);
            const response = await api.get(`/sections/${sectionId}/modules`);
            const data = response.data || [];
            setModules(data);
            const uniqueCategories = new Set(data.map(m => m.module_type?.id || m.module_type_id));
            setModuleStats({
                totalModules: data.length,
                totalHours: data.reduce((acc, curr) => acc + (curr.hours || 0), 0),
                categoryCount: uniqueCategories.size
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to load modules');
            setLoading(false);
        }
    };

    const fetchMasterSheet = async () => {
        try {
            setMasterLoading(true);
            setIsModalOpen(true);
            const response = await api.get(`/sections/${sectionId}/master-sheet-categorized`);
            setMasterData(response.data);
        } catch (err) {
            console.error("Error fetching master sheet", err);
        } finally {
            setMasterLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, [sectionId]);

    const exportToExcel = (data, fileName = 'MasterSheet_Export.xlsx') => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

        XLSX.writeFile(workbook, fileName);
    };

    const calculateStudentMetrics = (student, data) => {
        let totalAcadPoints = 0;
        let finalAssessmentPoints = 0;

        // 1. Calculate Academic Modules (usually 70% of total)
        // Adjust this logic based on how your curriculum weights individual modules
        Object.entries(student.categories || {}).forEach(([category, grades]) => {
            if (category !== "Final Assessments") {
                grades.forEach(g => {
                    const moduleInfo = data.categorized_headers[category]?.find(m => m.name === g.subject);
                    const avg = (g.pe || 0) + (g.exam || 0);
                    const weight = (moduleInfo?.hours || 0) / 100;
                    totalAcadPoints += avg * weight;
                });
            } else {
                // 2. Calculate Final Assessments (usually 30% of total)
                grades.forEach(g => {
                    const isComp = g.subject.toLowerCase().includes("comprehensive");
                    const weight = isComp ? (g.pe / 285) * 100 * 0.10 : (g.pe || 0) * 0.20;
                    finalAssessmentPoints += weight;
                });
            }
        });

        const acad70 = totalAcadPoints; // Assuming totalAcadPoints is already scaled to 70
        const finalGrade = acad70 + finalAssessmentPoints;

        return {
            acad70: acad70,
            finalGrade: finalGrade
        };
    };

    const handleExportClick = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/sections/${sectionId}/master-sheet-categorized`);
            const data = response.data;

            if (!data || !data.data) {
                alert("No data available");
                return;
            }

            const rows = data.data.map(student => {
                // Use the function we just defined above
                const metrics = calculateStudentMetrics(student, data);

                const row = {
                    "Student Name": student.student_name.toUpperCase(),
                };

                // Process Categories
                Object.entries(data.categorized_headers).forEach(([category, subjects]) => {
                    subjects.forEach(sub => {
                        const gd = student.categories[category]?.find(g => g.subject === sub.name);
                        const valPE = gd?.pe || 0;
                        const valExam = gd?.exam || 0;

                        if (category === "Final Assessments") {
                            const isComp = sub.name.toLowerCase().includes("comprehensive");
                            const weight = isComp ? (valPE / 285) * 100 * 0.10 : valPE * 0.20;
                            row[`${sub.name} (RAW)`] = valPE.toFixed(1);
                            row[`${sub.name} (WGT)`] = weight.toFixed(2);
                        } else {
                            const average = valPE + valExam;
                            const modGrade = average * ((sub.hours || 0) / 100);
                            row[`${sub.name} (AVE)`] = average.toFixed(1);
                            row[`${sub.name} (GRD)`] = modGrade.toFixed(2);
                        }
                    });
                });

                row["70% ACAD"] = metrics.acad70.toFixed(2);
                row["Final Grade"] = metrics.finalGrade.toFixed(2);
                row["Remarks"] = metrics.finalGrade >= 75 ? "PASSED" : "FAILED";
                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
            XLSX.writeFile(workbook, `Section_${sectionId}_Master_Grades.xlsx`);

        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Section Curriculum</h1>
                        <p className="text-slate-500 mt-2">
                            {moduleStats.totalModules} Subjects • 748 Total Contact Hours
                        </p>
                    </div>

                    <button
                        onClick={fetchMasterSheet}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                        <FileSpreadsheet size={18} />
                        View Master Grades
                    </button>
                    <button
                        onClick={handleExportClick}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                        Export to Excel
                    </button>
                </header>

                <ModuleCatalog modules={modules} />

                {/* Master Grades Modal */}
                {isModalOpen && (
                    <MasterGradesModal
                        data={masterData}
                        loading={masterLoading}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default SectionModulePage;