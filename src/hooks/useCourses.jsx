import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, finished: 0 });

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/courses'); // Adjust endpoint as needed
            const data = response.data || [];
            
            setCourses(data);
            
            // Calculate quick stats for the chips
            setStats({
                total: data.length,
                active: data.filter(c => c.status === 'active').length,
                finished: data.filter(c => c.status === 'finished').length
            });
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    return { courses, stats, loading, refresh: fetchCourses };
};