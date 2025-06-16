import { useMemo, useCallback } from 'react';
import { useRemessasContext } from '../contexts';
import { applyFilters } from '../utils/remessaFilters';

export const useRemessaFilters = () => {
  const { remessas, filters, dispatch } = useRemessasContext();

  const filteredRemessas = useMemo(() => {
    return applyFilters(remessas, filters);
  }, [remessas, filters]);

  const setFilter = useCallback((filterName, value) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { [filterName]: value }
    });
    // Reset pagination when filters change
    dispatch({
      type: 'SET_PAGINATION',
      payload: { currentPage: 1 }
    });
  }, [dispatch]);

  const setFilters = useCallback((newFilters) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: newFilters
    });
    // Reset pagination when filters change
    dispatch({
      type: 'SET_PAGINATION',
      payload: { currentPage: 1 }
    });
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
    dispatch({
      type: 'SET_PAGINATION',
      payload: { currentPage: 1 }
    });
  }, [dispatch]);

  return {
    filters,
    filteredRemessas,
    setFilter,
    setFilters,
    resetFilters
  };
}; 