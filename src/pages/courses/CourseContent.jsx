import React, { useState } from 'react';
import { 
    ChevronRight, 
    Search, 
    Plus, 
    Users, 
    Layers, 
    MoreVertical, 
    ArrowUpRight,
    Calendar
} from 'lucide-react';

const CourseContent = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Static Data for the "Course" we are currently viewing
    const courseDetails = {
        code: "CS101",
        name: "Introduction to Computer Science"
    };

    return (
        <div className="space-y-6">
            {/* --- Breadcrumbs --- */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">Courses</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-slate-800">{courseDetails.code}</span>
            </nav>

            {/* --- Header Section --- */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sections Management</h1>
                    <p className="text-slate-500 text-sm">Managing all class groups for <span className="text-slate-800 font-semibold">{courseDetails.name}</span></p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
                    <Plus size={18} />
                    <span className="font-semibold">Create Section</span>
                </button>
            </div>

            {/* --- Stat Chips --- */}
            <div className="flex gap-3">
                <StatChip 
                    label="Total Sections" 
                    count="8" 
                    color="bg-slate-100 text-slate-600" 
                    icon={<Layers size={14} />} 
                />
                <StatChip 
                    label="Total Students" 
                    count="324" 
                    color="bg-blue-50 text-blue-600" 
                    icon={<Users size={14} />} 
                />
            </div>

            {/* --- Search Bar --- */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search sections by name or room..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- Sections Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SectionCard 
                    name="Section A" 
                    studentCount={42} 
                    schedule="Mon/Wed 2:00 PM - 4:00 PM" 
                    room="Lab 302"
                />
                <SectionCard 
                    name="Section B" 
                    studentCount={38} 
                    schedule="Tue/Thu 10:00 AM - 12:00 PM" 
                    room="Room 105"
                />
                <SectionCard 
                    name="Section C" 
                    studentCount={45} 
                    schedule="Fri 1:00 PM - 5:00 PM" 
                    room="Lab 301"
                />
            </div>
        </div>
    );
};

// --- Sub-Components ---

const StatChip = ({ label, count, color, icon }) => (
    <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs ${color}`}>
        {icon}
        {label} <span className="ml-1 px-2 bg-white/50 rounded-full">{count}</span>
    </div>
);

const SectionCard = ({ name, studentCount, schedule, room }) => (
    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="text-blue-500" size={20} />
        </div>

        <div className="flex flex-col h-full">
            <div className="mb-4">
                <h4 className="font-black text-slate-800 text-xl uppercase tracking-tight">{name}</h4>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] mt-1 uppercase">
                    <Users size={12} />
                    {studentCount} Students Enrolled
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar size={14} className="text-slate-300" />
                    <span>{schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <div className="w-3.5 h-3.5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-bold">R</div>
                    <span>{room}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                    Manage Roster
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors">
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    </div>
);

export default CourseContent;