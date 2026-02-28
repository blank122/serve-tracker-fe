import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; // Adjust path to your axios.js file

export const useModuleCatalog = (sectionId) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moduleStats, setModuleStats] = useState({ 
        totalModules: 0, 
        totalHours: 0,
        categoryCount: 0 
    });

    const fetchModules = useCallback(async () => {
        // Don't proceed if no sectionId
        if (!sectionId) {
            console.log('No sectionId provided');
            setLoading(false);
            return;
        }

        // Create an abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching modules for section:', sectionId);
            console.log('Request started at:', new Date().toISOString());
            
            // Add signal to the request for abort control
            const response = await api.get(`/sections/${sectionId}/modules`, {
                signal: controller.signal
            });
            
            // Clear timeout since request completed
            clearTimeout(timeoutId);
            
            console.log('Request completed at:', new Date().toISOString());
            console.log('API Response Status:', response.status);
            console.log('API Response Headers:', response.headers);
            
            const data = response.data || [];
            console.log('Modules data count:', data.length);
            console.log('First module (if any):', data[0]);

            setModules(data);

            // Calculate stats dynamically
            const uniqueCategories = new Set(data.map(m => m.module_type?.id || m.module_type_id));
            
            setModuleStats({
                totalModules: data.length,
                totalHours: data.reduce((acc, curr) => acc + (curr.hours || 0), 0),
                categoryCount: uniqueCategories.size
            });
        } catch (error) {
            // Clear timeout if there's an error
            clearTimeout(timeoutId);
            
            console.error("Failed to fetch module catalog:", error);
            
            // Handle different error types
            if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
                setError('Request timed out after 10 seconds. Please check your network connection.');
                console.error('Request timeout for section:', sectionId);
            } else if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
                console.error('Response headers:', error.response.headers);
                
                setError(`Server error: ${error.response.status} - ${error.response.data?.message || error.message}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received. Request details:', error.request);
                setError('No response from server. Please check if the backend is running.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request setup error:', error.message);
                setError(`Request failed: ${error.message}`);
            }
            
            // Log the full error object for debugging
            console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } finally {
            setLoading(false);
            // Ensure timeout is cleared
            clearTimeout(timeoutId);
        }
    }, [sectionId]);

    useEffect(() => {
        fetchModules();
        
        // Cleanup function to abort fetch if component unmounts
        return () => {
            // This will be handled by the abort controller in the fetch function
            console.log('Cleanup: Component unmounted or sectionId changed');
        };
    }, [fetchModules]);

    return { 
        modules, 
        moduleStats, 
        loading, 
        error,
        refreshModules: fetchModules 
    };
};