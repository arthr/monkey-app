import { useCallback } from 'react';
import { useRemessasContext } from '../contexts';
import { getAllRemessas, getTodayRemessas, getRemessa } from '../services/remessaApi';

export const useRemessaData = () => {
  const { remessas, loading, error, dispatch } = useRemessasContext();

  const fetchTodayRemessas = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getTodayRemessas();
      dispatch({ type: 'SET_REMESSAS', payload: response.data });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar remessas: ' + err.message });
      console.error('Erro ao buscar as remessas do dia:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const fetchFilteredRemessas = useCallback(async (startDate, endDate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getAllRemessas(
        startDate ? new Date(startDate).getTime() : null,
        endDate ? new Date(endDate).getTime() : null
      );
      dispatch({ type: 'SET_REMESSAS', payload: response.data });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar remessas: ' + err.message });
      console.error('Erro ao buscar remessas filtradas:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const fetchRemessaByFilename = useCallback(async (filename) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getRemessa(filename);
      // Para detalhes, definimos apenas uma remessa no array
      dispatch({ type: 'SET_REMESSAS', payload: [response.data] });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar remessa: ' + err.message });
      console.error('Erro ao buscar remessa por filename:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const refreshRemessas = useCallback((dateFilter) => {
    if (!dateFilter?.start && !dateFilter?.end) {
      return fetchTodayRemessas();
    }
    return fetchFilteredRemessas(dateFilter.start, dateFilter.end);
  }, [fetchTodayRemessas, fetchFilteredRemessas]);

  return {
    remessas,
    remessa: remessas[0], // Para páginas de detalhes
    loading,
    error,
    fetchTodayRemessas,
    fetchFilteredRemessas,
    fetchRemessaByFilename,
    refreshRemessas
  };
}; 