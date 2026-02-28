import React, { useMemo } from 'react';
import { 
    BookOpen, 
    Clock, 
    User, 
    ChevronRight, 
    LayoutGrid, 
    CheckCircle2,
    GraduationCap
} from 'lucide-react';

const ModuleCatalog = ({ modules }) => {
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
        <div className="space-y-10 pb-20">
            {Object.entries(groupedModules).map(([category, data]) => (
                <section key={category} className="space-y-4">
                    {/* --- Category Header --- */}
                    <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                                <LayoutGrid size={14} />
                                Module {data.info.module_number}
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                {category}
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Required Time</span>
                            <span className="text-lg font-black text-slate-700">{data.info.required_hours} Hours</span>
                        </div>
                    </div>

                    {/* --- Module Cards Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.items.map((item) => (
                            <div 
                                key={item.id} 
                                className="group bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                            <BookOpen size={18} className="text-slate-400 group-hover:text-blue-500" />
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 font-medium text-xs">
                                            <Clock size={12} />
                                            {item.hours} hrs
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                        {item.module_catalog_name}
                                    </h3>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                            {item.instructor_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase leading-none">Instructor</span>
                                            <span className="text-xs font-semibold text-slate-700">{item.instructor_name}</span>
                                        </div>
                                    </div>
                                    <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default ModuleCatalog;