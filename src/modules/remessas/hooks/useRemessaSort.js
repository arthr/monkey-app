import { useMemo, useCallback } from 'react';
import { useRemessasContext } from '../contexts';

export const useRemessaSort = (remessas) => {
  const { sort, dispatch } = useRemessasContext();

  const sortedRemessas = useMemo(() => {
    if (!remessas || remessas.length === 0) return [];

    return [...remessas].sort((a, b) => {
      const { column, order } = sort;
      
      if (column === 'timestamp') {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (column === 'titulos') {
        const lengthA = a.titulos?.length || 0;
        const lengthB = b.titulos?.length || 0;
        return order === 'asc' ? lengthA - lengthB : lengthB - lengthA;
      }
      
      if (column === 'valorTotal') {
        const valorA = a.titulos?.reduce((sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0), 0) || 0;
        const valorB = b.titulos?.reduce((sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0), 0) || 0;
        return order === 'asc' ? valorA - valorB : valorB - valorA;
      }
      
      if (column === 'filename') {
        return order === 'asc' 
          ? a.filename.localeCompare(b.filename)
          : b.filename.localeCompare(a.filename);
      }
      
      if (column === 'sacadorAvalista') {
        const sacadorA = a.titulos?.[0]?.sacadorAvalista || '';
        const sacadorB = b.titulos?.[0]?.sacadorAvalista || '';
        return order === 'asc' 
          ? sacadorA.localeCompare(sacadorB)
          : sacadorB.localeCompare(sacadorA);
      }
      
      if (column === 'situacao') {
        const statusA = a.situacao?.aprovada ? 1 : 0;
        const statusB = b.situacao?.aprovada ? 1 : 0;
        return order === 'asc' ? statusA - statusB : statusB - statusA;
      }

      return 0;
    });
  }, [remessas, sort]);

  const setSortColumn = useCallback((column) => {
    const newOrder = sort.column === column && sort.order === 'asc' ? 'desc' : 'asc';
    dispatch({
      type: 'SET_SORT',
      payload: { column, order: newOrder }
    });
  }, [sort, dispatch]);

  const setSortOrder = useCallback((column, order) => {
    dispatch({
      type: 'SET_SORT',
      payload: { column, order }
    });
  }, [dispatch]);

  return {
    sortedRemessas,
    sort,
    setSortColumn,
    setSortOrder
  };
}; 