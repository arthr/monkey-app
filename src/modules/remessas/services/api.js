import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL, // Coloque a URL base do seu backend aqui
});

// Listar todas as remessas (opcional com filtro de data)
export const getAllRemessas = (start_time, end_time) => {
    const params = {};
    if (start_time) params.start_time = start_time;
    if (end_time) params.end_time = end_time;
    return api.get('/remessas', { params });
};

// Listar remessas de hoje
export const getTodayRemessas = () => {
    return api.get('/remessas/today');
};

// Obter detalhes de uma remessa específica
export const getRemessa = (filename) => {
    return api.get(`/remessas/${filename}`);
};

// Aprovar ou reprovar uma remessa
export const approveRemessa = (filename, timestamp, data) => {
    return api.post(`/remessas/${filename}/${timestamp}/approve`, data);
};

// Obter detalhes de uma remessa com timestamp
export const getRemessaDetails = (filename, timestamp) => {
    return api.get(`/remessas/${filename}/${timestamp}`);
};

export default api;
