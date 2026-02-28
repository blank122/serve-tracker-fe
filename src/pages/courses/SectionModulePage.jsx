import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, ArrowLeft } from 'lucide-react';
import ModuleCatalog from './ModuleCatalog';
import api from '../../api/axios'; // Adjust path to your axios.js file

const SectionModulePage = ({sectionId}) => {
    const navigate = useNavigate();
    
    const [modules, setModules] = useState([]);
    const [moduleStats, setModuleStats] = useState({
        totalModules: 0,
        totalHours: 0,
        categoryCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchModules = async () => {
        if (!sectionId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching modules for section:', sectionId);
            
            // Adjust this URL to match your backend
            const response = await api.get(`/sections/${sectionId}/modules`, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = response.data || [];
            console.log('Modules fetched:', data.length);

            setModules(data);

            // Calculate stats
            const uniqueCategories = new Set(data.map(m => m.module_type?.id || m.module_type_id));
            
            setModuleStats({
                totalModules: data.length,
                totalHours: data.reduce((acc, curr) => acc + (curr.hours || 0), 0),
                categoryCount: uniqueCategories.size
            });
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching modules:', err);
            
            let errorMessage = 'Failed to load modules';
            
            if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (err.response) {
                errorMessage = `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = 'Cannot connect to server. Please check if backend is running.';
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Component mounted, sectionId:', sectionId);
        fetchModules();
    }, [sectionId]);

    const handleGoBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-600">Loading curriculum...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto p-6">
                 
                    
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <p className="text-red-600 font-bold mb-2">Error Loading Data</p>
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                        <button 
                            onClick={fetchModules}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!modules || modules.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto p-6">
                    <button
                        onClick={handleGoBack}
                        className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Modules Found</h3>
                        <p className="text-slate-500">
                            This section doesn't have any modules assigned yet.
                        </p>
                        <button 
                            onClick={fetchModules}
                            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6">
             
                
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Section Curriculum</h1>
                    <p className="text-slate-500 mt-2">
                        {moduleStats.totalModules} Subjects • {moduleStats.totalHours} Total Contact Hours
                    </p>
                </header>

                <ModuleCatalog modules={modules} />
            </div>
        </div>
    );
};

export default SectionModulePage;