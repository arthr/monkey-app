import { useMemo, useCallback } from 'react';
import { useRemessasContext } from '../contexts';

export const useRemessaPagination = (remessas) => {
  const { pagination, dispatch } = useRemessasContext();

  const paginatedRemessas = useMemo(() => {
    if (!remessas || remessas.length === 0) return [];
    
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return remessas.slice(startIndex, endIndex);
  }, [remessas, pagination]);

  const totalPages = useMemo(() => {
    if (!remessas || remessas.length === 0) return 0;
    return Math.ceil(remessas.length / pagination.itemsPerPage);
  }, [remessas, pagination.itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const totalItems = remessas?.length || 0;
    const { currentPage, itemsPerPage } = pagination;
    
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return {
      totalItems,
      startItem,
      endItem,
      currentPage,
      itemsPerPage,
      totalPages
    };
  }, [remessas, pagination, totalPages]);

  const setCurrentPage = useCallback((page) => {
    dispatch({
      type: 'SET_PAGINATION',
      payload: { currentPage: page }
    });
  }, [dispatch]);

  const setItemsPerPage = useCallback((itemsPerPage) => {
    dispatch({
      type: 'SET_PAGINATION',
      payload: { 
        itemsPerPage,
        currentPage: 1 // Reset to first page when changing items per page
      }
    });
  }, [dispatch]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [setCurrentPage, totalPages]);

  const goToNextPage = useCallback(() => {
    if (pagination.currentPage < totalPages) {
      setCurrentPage(pagination.currentPage + 1);
    }
  }, [pagination.currentPage, totalPages, setCurrentPage]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      setCurrentPage(pagination.currentPage - 1);
    }
  }, [pagination.currentPage, setCurrentPage]);

  return {
    paginatedRemessas,
    pagination: paginationInfo,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage
  };
}; 