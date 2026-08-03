export const getApiBaseUrl = () => {
    let url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        url = url.replace('http://', 'https://');
    }
    return url;
};
