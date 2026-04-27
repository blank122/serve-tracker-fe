// components/InstructorCoursesPage.jsx
import React, { useState } from 'react';
import { useInstructorAssignments } from '../../hooks/useInstructorAssignments';
import GradingModal from '../courses/GradingModal'; // Adjust path if needed
import { ChevronDown, ChevronUp } from 'lucide-react'; // Added icons for the collapse toggle

const InstructorAssignments = () => {
  const { data, isLoading, error } = useInstructorAssignments();

  // State to manage the Grading Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleData, setSelectedModuleData] = useState({
    moduleId: null,
    moduleName: '',
    sectionID: null
  });

  // State to manage collapsed courses (tracks course_id -> boolean)
  const [collapsedCourses, setCollapsedCourses] = useState({});

  // Handler to toggle a specific course's visibility
  const toggleCourse = (courseId) => {
    setCollapsedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId], // Toggle the specific course ID
    }));
  };

  // Handler to open modal and pass necessary IDs
  const handleOpenGrading = (moduleId, moduleName, sectionID) => {
    setSelectedModuleData({ moduleId, moduleName, sectionID });
    setIsModalOpen(true);
  };

  const handleCloseGrading = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.courses || data.courses.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        <p>No courses assigned to this instructor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Teaching Assignments</h1>
            <p className="text-gray-600 mt-1">Welcome back, Instructor</p>
          </div>
        </header>

        <div className="grid gap-8">
          {data.courses.map((course) => {
            const isCollapsed = collapsedCourses[course.course_id];

            return (
              <div key={course.course_id} className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all">

                {/* 1. Made the header clickable 
                  2. Adjusted border-radius depending on if it's collapsed or not 
                */}
                <div
                  onClick={() => toggleCourse(course.course_id)}
                  className={`bg-slate-50/50 p-6 cursor-pointer hover:bg-slate-100/50 transition-colors ${isCollapsed ? 'rounded-2xl' : 'border-b border-slate-100 rounded-t-2xl'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {course.course_code}
                      </span>
                      <h2 className="mt-4 text-xl font-semibold text-slate-800">
                        {course.course_name}
                      </h2>
                    </div>

                    {/* Visual indicator for collapse/expand */}
                    <div className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                      {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                    </div>
                  </div>
                </div>

                {/* Conditionally render the body based on the collapsed state */}
                {!isCollapsed && (
                  <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {course.sections.map((section) => (
                        <div
                          key={section.section_id}
                          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                        >
                          <h3 className="mb-4 flex items-center text-lg font-semibold text-slate-700">
                            <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                            Section {section.section_name}
                          </h3>

                          <div className="space-y-3">
                            {section.subjects.map((subject) => (
                              <div
                                key={subject.module_id}
                                onClick={() => handleOpenGrading(subject.module_id, subject.module_name, section.section_id)}
                                className="group relative rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md"
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-slate-800 transition-colors group-hover:text-blue-700">
                                    {subject.module_name}
                                  </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                                  <span className="truncate pr-2 font-medium">
                                    {subject.module_type}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="whitespace-nowrap font-bold text-slate-600">
                                      {subject.hours} hrs
                                    </span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-2 py-1 rounded-md font-bold shadow-sm">
                                      Grade
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Render the Modal here */}
      <GradingModal
        isOpen={isModalOpen}
        onClose={handleCloseGrading}
        moduleID={selectedModuleData.moduleId}
        moduleName={selectedModuleData.moduleName}
        sectionID={selectedModuleData.sectionID}
      />
    </div>
  );
};

export default InstructorAssignments;