// hooks/useCourses.js
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, finished: 0, upcoming: 0, archived: 0 });

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            // Request all courses including archived ones
            const response = await api.get('/courses?include_archived=true'); 
            const data = response.data || [];
            
            // Normalize is_deleted to boolean for consistency
            const normalizedData = data.map(course => ({
                ...course,
                is_deleted: course.is_deleted === true || course.is_deleted === 1 || course.is_deleted === "1"
            }));
            
            setCourses(normalizedData);
            
            // Separate live courses from archived ones based ONLY on is_deleted
            const liveCourses = normalizedData.filter(c => !c.is_deleted);
            const archivedCourses = normalizedData.filter(c => c.is_deleted);

            setStats({
                total: liveCourses.length,
                active: liveCourses.filter(c => c.status === 'starting').length,
                finished: liveCourses.filter(c => c.status === 'completed').length,
                upcoming: liveCourses.filter(c => c.status === 'not yet started').length,
                archived: archivedCourses.length
            });
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCourse = useCallback(async (courseId) => {
        try {
            await api.delete(`/courses/${courseId}`);
            
            // Update locally - mark as deleted
            setCourses(prevCourses => 
                prevCourses.map(c => c.id === courseId ? { ...c, is_deleted: true } : c)
            );

            // Recalculate stats after deletion
            setStats(prevStats => {
                const archivedCourse = courses.find(c => c.id === courseId);
                if (!archivedCourse || archivedCourse.is_deleted) return prevStats;

                return {
                    total: prevStats.total - 1,
                    active: archivedCourse.status === 'starting' ? prevStats.active - 1 : prevStats.active,
                    finished: archivedCourse.status === 'completed' ? prevStats.finished - 1 : prevStats.finished,
                    upcoming: archivedCourse.status === 'not yet started' ? prevStats.upcoming - 1 : prevStats.upcoming,
                    archived: prevStats.archived + 1
                };
            });

            return { success: true };
        } catch (error) {
            console.error(`Failed to delete course with ID ${courseId}:`, error);
            throw error;
        }
    }, [courses]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    return { courses, stats, loading, deleteCourse, refresh: fetchCourses };
};