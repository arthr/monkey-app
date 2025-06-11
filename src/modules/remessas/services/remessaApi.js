import axios from 'axios';

const remessaApi = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
});

// Listar todas as remessas (opcional com filtro de data)
export const getAllRemessas = (start_time, end_time) => {
    const params = {};
    if (start_time) params.start_time = start_time;
    if (end_time) params.end_time = end_time;
    return remessaApi.get('/remessas', { params });
};

// Listar remessas de hoje
export const getTodayRemessas = () => {
    return remessaApi.get('/remessas/today');
};

// Obter detalhes de uma remessa específica
export const getRemessa = (filename) => {
    return remessaApi.get(`/remessas/${filename}`);
};

// Aprovar ou reprovar uma remessa
export const approveRemessa = (filename, timestamp, data) => {
    return remessaApi.post(`/remessas/${filename}/${timestamp}/approve`, data);
};

// Obter detalhes de uma remessa com timestamp
export const getRemessaDetails = (filename, timestamp) => {
    return remessaApi.get(`/remessas/${filename}/${timestamp}`);
};

// Obter signed URL para download do arquivo remessa
export const getRemessaUrl = (filename) => {
    return remessaApi.get(`/remessas/${filename}/download`);
};

// Obter signed URL para download do arquivo retorno
export const getRetornoUrl = (filename) => {
    return remessaApi.get(`/retornos/${filename}/download`);
};

// Corrigir espécie de título baseada no tipo de documento fiscal
export const corrigirEspecie = (filename, timestamp) => {
    return remessaApi.post(`/remessas/${filename}/${timestamp}/corrigir-especie`);
};

// Obter signed URL para download do arquivo de remessa corrigido
export const getRemessaCorrigidaUrl = (filename, timestamp) => {
    return remessaApi.get(`/remessas/${filename}/${timestamp}/download-corrigida`);
};

export default remessaApi;
