import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSections } from '../../hooks/useSections'; // Path to hook above
import { ChevronRight, Search, Plus, Users, Layers, MoreVertical, Calendar, Loader2, ArrowUpRight, ArrowLeft } from 'lucide-react';
import RosterModal from './RosterModal';
import SectionModulePage from './SectionModulePage';
const CourseContent = () => {
    const { courseId } = useParams();
    const { sections, stats, loading } = useSections(courseId);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRosterOpen, setIsRosterOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    const handleManageRoster = (section) => {
        console.log("📋 handleManageRoster called with section:", section);
        console.log("Section ID:", section.id);
        console.log("Section name:", section.section_name);
        console.log("Full section object:", JSON.stringify(section, null, 2));

        setSelectedSection(section);
        setIsRosterOpen(true);
    };

    const filteredSections = sections.filter(sec =>
        sec.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.room?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // NEW: State to track which view to show
    const [view, setView] = useState('list'); // 'list' or 'modules'
    const [activeSectionId, setActiveSectionId] = useState(null);

    const handleViewModules = (id) => {
        setActiveSectionId(id);
        setView('modules');
    };

    const handleGoBack = () => {
        setView('list');
        setActiveSectionId(null);
    };

    // 1. Show Module Catalog View
    if (view === 'modules') {
        return (
            <div className="space-y-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Sections
                </button>
                <SectionModulePage sectionId={activeSectionId} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* --- 1. Breadcrumbs (Always Visible) --- */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">Courses</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-slate-800">Course ID: {courseId}</span>
            </nav>

            {/* --- 2. Header (Always Visible) --- */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sections Management</h1>
                    <p className="text-slate-500 text-sm">Reviewing active class groups and enrollment stats.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
                    <Plus size={18} />
                    <span className="font-semibold">Create Section</span>
                </button>
            </div>

            {/* --- 3. Content Area (Conditional Loading) --- */}
            {loading ? (
                <div className="flex h-96 flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
                    <p className="font-medium">Loading sections...</p>
                </div>
            ) : (
                <>
                    {/* --- Stats --- */}
                    <div className="flex gap-3">
                        <StatChip label="Total Sections" count={stats.totalSections} color="bg-slate-100 text-slate-600" icon={<Layers size={14} />} />
                        <StatChip label="Total Students" count={stats.totalStudents} color="bg-blue-50 text-blue-600" icon={<Users size={14} />} />
                    </div>

                    {/* --- Search --- */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search sections..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* --- Section Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSections.length > 0 ? (
                            filteredSections.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    id={section.id}
                                    name={section.section_name}
                                    studentCount={section.total_students || 0}
                                    onManage={() => handleManageRoster(section)}
                                    onViewModules={() => handleViewModules(section.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-400">
                                No sections found matching your search.
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* --- 4. Modals (Always Mounted) --- */}
            <RosterModal
                isOpen={isRosterOpen}
                onClose={() => setIsRosterOpen(false)}
                section={selectedSection}
            />
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

const SectionCard = ({ id, name, studentCount, onManage, onViewModules }) => {
    
    return (
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* --- THE NAVIGATION TRIGGER (Top Right) --- */}
            <div className="absolute top-0 right-0 p-4">

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewModules(); // Triggers setView('modules') in parent
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-blue-500"
                >
                    <ArrowUpRight size={20} />
                </button>
            </div>

            <div className="flex flex-col h-full">
                <div className="mb-4 pr-12"> {/* Added padding-right so text doesn't hit the button */}
                    <h4 className="font-black text-slate-800 text-xl uppercase tracking-tight leading-tight">
                        {name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] mt-2 uppercase tracking-wider">
                        <Users size={12} />
                        {studentCount} Students Enrolled
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManage();
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        Manage Roster
                    </button>

                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseContent;