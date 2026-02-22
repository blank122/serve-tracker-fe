import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; // Import your custom instance

export const useAdminStats = () => {
    const [data, setData] = useState({
        stats: null,
        analytics: null,
        rankings: [],
        loading: true,
        error: null
    });

    const fetchAllData = useCallback(async () => {
        try {
            setData(prev => ({ ...prev, loading: true }));

            // No need for full URLs or manual headers!
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('admin/stats/overview'),
                api.get('admin/analytics/current-year'),
                // api.get('admin/analytics/top-students?limit=10')
            ]);

            setData({
                stats: statsRes.data,
                analytics: analyticsRes.data,
                loading: false,
                error: null
            });
        } catch (err) {
            setData(prev => ({
                ...prev,
                loading: false,
                error: err.response?.data?.message || "Connection Error"
            }));
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

 

    return { ...data, refresh: fetchAllData };
};