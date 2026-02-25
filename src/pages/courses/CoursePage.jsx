import React, { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { Plus, Search, Download, Edit2, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link } from "react-router-dom";

const CoursePage = () => {
    const { courses, stats, loading } = useCourses();
    const [searchTerm, setSearchTerm] = useState('');
    // 1. Add state for the active tab
    const [currentTab, setCurrentTab] = useState('starting');

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Define tab configuration for easy mapping
    const tabs = [
        { id: 'starting', label: 'Active', count: filteredCourses.filter(c => c.status === 'starting').length },
        { id: 'completed', label: 'Finished', count: filteredCourses.filter(c => c.status === 'completed').length },
        { id: 'not yet started', label: 'Upcoming', count: filteredCourses.filter(c => c.status === 'not yet started').length },
    ];

    return (
        <div className="space-y-6">
            {/* --- Header Section --- */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
                    <p className="text-slate-500 text-sm">Manage programs, sections, and progression in one place.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
                    <Plus size={18} />
                    <span className="font-semibold">Add Course</span>
                </button>
            </div>

            {/* --- Stat Chips --- */}
            <div className="flex gap-3">
                <StatChip label="Total" count={stats.total} color="bg-slate-100 text-slate-600" />
                <StatChip label="Active" count={stats.active} color="bg-green-50 text-green-600" dot />
                <StatChip label="Finished" count={stats.finished} color="bg-blue-50 text-blue-600" />
            </div>

            {/* --- Search Bar --- */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search courses... (/)"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- 3. Tab Navigation --- */}
            <div className="flex gap-8 border-b border-slate-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${currentTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${currentTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {tab.count}
                        </span>
                        {/* Animated Underline */}
                        {currentTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* --- 4. Dynamic Content Section --- */}
            <section className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                        .filter(c => c.status === currentTab)
                        .map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    }
                </div>

                {/* Empty State */}
                {filteredCourses.filter(c => c.status === currentTab).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <Search size={32} />
                        </div>
                        <p className="font-medium text-sm">No {currentTab.replace('starting', 'active')} courses found.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

// --- Sub-Components ---

const StatChip = ({ label, count, color, dot }) => (
    <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 font-bold text-xs ${color}`}>
        {dot && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
        {label} <span className="opacity-80">{count}</span>
    </div>
);

const CourseCard = ({ course }) => (
    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{course.code}</h4>
                <p className="text-slate-400 text-xs font-medium line-clamp-1">{course.name || 'No description provided'}</p>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${course.status === 'starting' ? 'bg-green-50 text-green-600' :
                course.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                    'bg-slate-100 text-slate-500'
                }`}>
                {course.status === 'starting' ? 'Active' :
                    course.status === 'completed' ? 'Finished' :
                        'Upcoming'}
            </span>
        </div>

        {/* Section Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
            {course.sections?.map(sec => (
                <span key={sec.id} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
                    {sec.section_name}
                </span>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
            <div className="flex gap-2">
                <Link
                    to={`/admin/course-content/${course.id}`} // Using template literals to pass the ID
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                    <Edit2 size={16} />
                </Link>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><ArrowUpRight size={16} /></button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><Download size={16} /></button>
            </div>
            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <CheckCircle size={16} />
            </button>
        </div>
    </div>
);

export default CoursePage;