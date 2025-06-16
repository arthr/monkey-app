import { useMemo } from 'react';
import { getDocumentStatus, getSituacaoStatus, getTipoDocumentoPredominante } from '../utils/remessaFilters';

export const useRemessaCalculations = (remessa) => {
  const valorTotal = useMemo(() => {
    if (!remessa?.titulos) return "R$ 0,00";
    const total = remessa.titulos.reduce(
      (sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0),
      0
    );
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [remessa?.titulos]);

  const valorTotalNumerico = useMemo(() => {
    if (!remessa?.titulos) return 0;
    return remessa.titulos.reduce(
      (sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0),
      0
    );
  }, [remessa?.titulos]);

  const documentStatus = useMemo(() => {
    return getDocumentStatus(remessa);
  }, [remessa?.titulos]);

  const situacaoStatus = useMemo(() => {
    return getSituacaoStatus(remessa);
  }, [remessa?.situacao]);

  const quantidadeTitulos = useMemo(() => {
    return remessa?.titulos?.length || 0;
  }, [remessa?.titulos]);

  const tipoDocumentoPredominante = useMemo(() => {
    return getTipoDocumentoPredominante(remessa);
  }, [remessa]);

  return {
    valorTotal,
    valorTotalNumerico,
    documentStatus,
    situacaoStatus,
    quantidadeTitulos,
    tipoDocumentoPredominante
  };
}; 