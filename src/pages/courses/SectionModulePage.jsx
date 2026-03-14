import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, ArrowLeft, Table as TableIcon, X, Download, FileSpreadsheet, GraduationCap, Clock } from 'lucide-react';
import ModuleCatalog from './ModuleCatalog';
import api from '../../api/axios';
import MasterGradesModal from './MasterGradesModal';
import * as XLSX from 'xlsx';
import SectionAnalytics from '../../components/SectionAnalytics';

const SectionModulePage = ({ sectionId, courseName, activeSectionName }) => {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [moduleStats, setModuleStats] = useState({ totalModules: 0, totalHours: 0, categoryCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardStats, setDashboardStats] = useState([]);

    // --- Master Sheet States ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [masterData, setMasterData] = useState(null);
    const [masterLoading, setMasterLoading] = useState(false);
    const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);

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

    const fetchDashboardStats = async () => {
        try {
            setDashboardStatsLoading(true);
            const response = await api.get(`/sections/${sectionId}/dashboard`);
            setDashboardStats(response.data);
        } catch (err) {
            console.error("Error fetching dashboard", err);
        } finally {
            setDashboardStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
        fetchDashboardStats();
    }, [sectionId]);

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

            // 1. Ensure we have strings even if props are missing
            const safeCourseName = (courseName || 'Course').toString();
            const safeSectionName = (activeSectionName || 'Section').toString();

            // 2. Format the Date
            const dateToday = new Date().toISOString().split('T')[0];

            // 3. Use the safe variables for the replacement
            const cleanCourse = safeCourseName.replace(/[^a-z0-9]/gi, '_');
            const cleanSection = safeSectionName.replace(/[^a-z0-9]/gi, '_');

            const fileName = `${cleanCourse}_${cleanSection}_${dateToday}.xlsx`;

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
            XLSX.writeFile(workbook, fileName);

        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <header className="mb-10">
                    {/* Breadcrumb Navigation */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        {/* Left Side: Titles & Stats */}
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Section Curriculum
                            </h1>
                            <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
                                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                    <BookOpen size={14} />
                                    {moduleStats.totalModules} Subjects
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                                    <Clock size={14} />
                                    748 Contact Hours
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Search & Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Optional Search - High UX value for 44 subjects */}


                            {/* Action Buttons Group */}
                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm">
                                <button
                                    onClick={fetchMasterSheet}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all border border-transparent hover:border-slate-100"
                                >
                                    <FileSpreadsheet size={18} className="text-emerald-600" />
                                    View Grades
                                </button>

                                <div className="w-px h-6 bg-slate-200 mx-1" /> {/* Vertical Divider */}

                                <button
                                    onClick={handleExportClick}
                                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-95"
                                >
                                    <Download size={18} />
                                    Export Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {dashboardStats && <SectionAnalytics data={dashboardStats} />}

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