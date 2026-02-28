import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, ArrowLeft, Table as TableIcon, X, FileSpreadsheet } from 'lucide-react';
import ModuleCatalog from './ModuleCatalog';
import api from '../../api/axios';
import MasterGradesModal from './MasterGradesModal';

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

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Section Curriculum</h1>
                        <p className="text-slate-500 mt-2">
                            {moduleStats.totalModules} Subjects • {moduleStats.totalHours} Total Contact Hours
                        </p>
                    </div>
                    
                    <button 
                        onClick={fetchMasterSheet}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                        <FileSpreadsheet size={18} />
                        View Master Grades
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