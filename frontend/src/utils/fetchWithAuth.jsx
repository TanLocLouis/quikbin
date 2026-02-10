const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
        });

        console.log(response)
        if (response.status === 200) return response;
        
        // Refresh access token
        // using refresh token
        if (options.retry !== false) {
            console.log('Access token expired, attempting to refresh token...');
            try {
                const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                });

                if (!refreshResponse.ok) {
                    throw new Error('Failed to refresh token');
                }

                const refreshData = await refreshResponse.json();
                localStorage.setItem('authToken', refreshData.accessToken);

                // Retry original request with new token
                return fetchWithAuth(url, { ...options, retry: false });
            } catch (err) {
                console.error('Token refresh error:', err);
                throw err;
            }
        }
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
}

export { fetchWithAuth };