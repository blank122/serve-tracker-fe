// TestComponent.jsx
import React from 'react';
import api from '../../api/axios';

const TestComponent = () => {
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const testApi = async () => {
            try {
                console.log("Testing API call...");
                const response = await api.get('/instructor/assignments');
                console.log("API test successful:", response);
                setData(response.data);
            } catch (err) {
                console.error("API test failed:", err);
                setError(err.message);
            }
        };
        testApi();
    }, []);

    return (
        <div className="p-4">
            <h1>Test Component</h1>
            {error && <div className="text-red-600">Error: {error}</div>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default TestComponent;