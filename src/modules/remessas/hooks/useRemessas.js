import { useState, useEffect } from 'react';
import { getAllRemessas, getTodayRemessas } from '../services/remessaApi';

const useRemessas = () => {
    const [remessas, setRemessas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        startDate: null,
        endDate: null
    });
    const [filterMode, setFilterMode] = useState('today'); // 'today' ou 'custom'

    // Função para carregar remessas de hoje
    const loadTodayRemessas = async () => {
        setLoading(true);
        try {
            const response = await getTodayRemessas();
            setRemessas(response.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar remessas: ' + err.message);
            console.error('Erro ao buscar as remessas do dia:', err);
        } finally {
            setLoading(false);
        }
    };

    // Função para carregar remessas com filtro de data
    const loadFilteredRemessas = async () => {
        if (!dateFilter.startDate && !dateFilter.endDate) {
            return loadTodayRemessas();
        }

        setLoading(true);
        try {
            const response = await getAllRemessas(
                dateFilter.startDate ? new Date(dateFilter.startDate).getTime() : null,
                dateFilter.endDate ? new Date(dateFilter.endDate).getTime() : null
            );
            setRemessas(response.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar remessas: ' + err.message);
            console.error('Erro ao buscar remessas filtradas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Carregar remessas baseadas no modo de filtro atual
    useEffect(() => {
        if (filterMode === 'today') {
            loadTodayRemessas();
        } else {
            loadFilteredRemessas();
        }
    }, [filterMode, dateFilter]);

    return {
        remessas,
        loading,
        error,
        dateFilter,
        setDateFilter,
        filterMode,
        setFilterMode,
        refresh: () => filterMode === 'today' ? loadTodayRemessas() : loadFilteredRemessas()
    };
};

export default useRemessas;