import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; 

export const useSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [subjectLoading, setSubjectsLoading] = useState(true);

    const fetchSubjects = useCallback(async (showLoading = true) => {

        try {
            if (showLoading) setSubjectsLoading(true);
            
            const response = await api.get(`/subject/module-catalog`);
            const data = response.data || [];

            setSubjects(data);

        } catch (error) {
            console.error("Failed to fetch sections:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    // Return fetchSections as refreshSections
    return { 
        subjects, 
        subjectLoading, 
        refreshSections: fetchSubjects 
    };
};