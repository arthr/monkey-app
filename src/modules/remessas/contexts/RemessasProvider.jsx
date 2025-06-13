import React, { useReducer, useMemo } from 'react';
import RemessasContext from './RemessasContext';

const initialState = {
  remessas: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    document: 'todos',
    company: 'todos',
    status: 'todos',
    dateRange: { start: null, end: null }
  },
  sort: {
    column: 'timestamp',
    order: 'asc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10
  }
};

function remessasReducer(state, action) {
  switch (action.type) {
    case 'SET_REMESSAS':
      return { ...state, remessas: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    default:
      return state;
  }
}

export function RemessasProvider({ children }) {
  const [state, dispatch] = useReducer(remessasReducer, initialState);

  const contextValue = useMemo(() => ({
    ...state,
    dispatch
  }), [state]);

  return (
    <RemessasContext.Provider value={contextValue}>
      {children}
    </RemessasContext.Provider>
  );
} 