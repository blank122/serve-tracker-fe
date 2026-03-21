import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; 

export const useSections = (courseId) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalSections: 0, totalStudents: 0 });

    const fetchSections = useCallback(async (showLoading = true) => {
        if (!courseId) return;

        try {
            if (showLoading) setLoading(true);
            
            const response = await api.get(`/sections/course/${courseId}`);
            const data = response.data || [];

            setSections(data);

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

    // Return fetchSections as refreshSections
    return { 
        sections, 
        stats, 
        loading, 
        refreshSections: fetchSections 
    };
};