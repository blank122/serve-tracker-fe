import React, { useState, useMemo } from 'react';
import {
    BookOpen,
    Clock,
    ChevronRight,
} from 'lucide-react';
import GradingModal from './GradingModal';

const ModuleCatalog = ({ modules, sectionID }) => {

    const [selectedModule, setSelectedModule] = useState(null);
    // Group modules by their module_type.module_name
    const groupedModules = useMemo(() => {
        return modules.reduce((acc, curr) => {
            const groupName = curr.module_type.module_name;
            if (!acc[groupName]) {
                acc[groupName] = {
                    info: curr.module_type,
                    items: []
                };
            }
            acc[groupName].items.push(curr);
            return acc;
        }, {});
    }, [modules]);

    return (
        <div className="space-y-16 pb-20">
            {Object.entries(groupedModules).map(([category, data]) => (
                <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* --- Category Header --- */}
                    <div className="sticky top-0 z-10 py-4 bg-slate-50/80 backdrop-blur-md flex items-end justify-between border-b-2 border-slate-200 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <span className="text-lg font-black">{data.info.module_number}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                    {category}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Module Group</p>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 font-black text-sm">
                                <Clock size={14} />
                                {data.info.required_hours} Hours Required
                            </div>
                        </div>
                    </div>

                    {/* --- Module Cards Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Decorative Accent */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-500 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <BookOpen size={20} />
                                    </div>
                                    <span className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase bg-slate-50 px-2 py-1 rounded-md">
                                        <Clock size={12} /> {item.hours} hrs
                                    </span>
                                </div>

                                <h3 className="text-lg font-extrabold text-slate-800 leading-tight mb-6 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                                    {item.module_catalog_name}
                                </h3>

                                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white text-xs font-black ring-4 ring-blue-50">
                                            {item.instructor_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">Instructor</p>
                                            <p className="text-sm font-bold text-slate-700">{item.instructor_name}</p>
                                        </div>
                                    </div>
                                    <button 
                                    onClick={() => setSelectedModule(item)} // This triggers the modal
                                    className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <GradingModal
                isOpen={!!selectedModule}
                onClose={() => setSelectedModule(null)}
                moduleID={selectedModule.id}
                moduleName={selectedModule.module_catalog_name}
                sectionID={sectionID}
            />
        </div>
    );
};

export default ModuleCatalog;