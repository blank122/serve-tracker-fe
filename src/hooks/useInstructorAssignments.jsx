// hooks/useInstructorAssignment.js
import { useState, useEffect } from 'react';
import api from '../api/axios';
// Adjust this import path to point to your actual axios.js file

export function useInstructorAssignments() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let userId = null;

        // 1. Safely parse the local storage
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                // Look specifically for user_id based on the payload you showed me
                userId = user?.user_id;
            }
        } catch (parseError) {
            console.error("Error parsing user from local storage:", parseError);
        }

        // 2. Handle missing user ID gracefully
        if (!userId) {
            setError("User ID not found. Please log in again.");
            setIsLoading(false);
            return;
        }

        // 3. Fetch the data using your custom Axios instance
        const fetchAssignments = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/instructor/assignments/${userId}`);
                setData(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Something went wrong fetching the assignments.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    return { data, isLoading, error };
}