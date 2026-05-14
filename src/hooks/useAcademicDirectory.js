import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; 

export const useAcademicDirectory = (activeTab, debouncedSearch) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDirectoryData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);

            // Determine the correct endpoint based on the active tab
            const endpoint = activeTab === 'students' 
                ? '/academic-directory/students' 
                : '/academic-directory/lessons';
            
            // Build the query parameter if a search term exists
            const queryParam = debouncedSearch 
                ? `?search=${encodeURIComponent(debouncedSearch)}` 
                : '';
            
            // Using your axios instance
            const response = await api.get(`${endpoint}${queryParam}`);
            
            // Axios automatically parses JSON to response.data
            setData(response.data || []);

        } catch (error) {
            console.error("Failed to fetch directory data:", error);
            setData([]); // Clear data to prevent showing stale results on error
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, debouncedSearch]); // React will recreate this function if tab or search changes

    useEffect(() => {
        fetchDirectoryData();
    }, [fetchDirectoryData]); // Triggers whenever the useCallback above updates

    return { 
        data, 
        isLoading, 
        refreshData: fetchDirectoryData 
    };
};