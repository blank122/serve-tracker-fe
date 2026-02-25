import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; // Adjust path to your axios.js file

export const useSections = (courseId) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalSections: 0, totalStudents: 0 });

    const fetchSections = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            // Using your interceptor and the specific endpoint
            const response = await api.get(`/sections/course/${courseId}`);
            const data = response.data || [];

            setSections(data);

            // Calculate stats dynamically from the response
            setStats({
                totalSections: data.length,
                totalStudents: data.reduce((acc, curr) => acc + (curr.total_students || 0), 0)
            });
        } catch (error) {
            console.error("Failed to fetch sections:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    return { sections, stats, loading, refreshSections: fetchSections };
};