import { useState, useCallback } from 'react';
import { approveRemessa as approveRemessaApi, getRemessaUrl, getRetornoUrl, corrigirEspecie, getRemessaCorrigidaUrl } from '../services/remessaApi';

export const useRemessaActions = () => {
  const [approvingRemessa, setApprovingRemessa] = useState(false);
  const [downloadingRemessa, setDownloadingRemessa] = useState(false);
  const [downloadingRetorno, setDownloadingRetorno] = useState(false);
  const [downloadingCorrigida, setDownloadingCorrigida] = useState(false);
  const [gerandoCorrigida, setGerandoCorrigida] = useState(false);
  const [error, setError] = useState(null);
  const [remessaUrl, setRemessaUrl] = useState(null);
  const [retornoUrl, setRetornoUrl] = useState(null);
  const [remessaCorrigidaUrl, setRemessaCorrigidaUrl] = useState(null);

  const approveRemessa = useCallback(async (filename, timestamp, data) => {
    setApprovingRemessa(true);
    setError(null);
    try {
      await approveRemessaApi(filename, timestamp, data);
      return true;
    } catch (error) {
      console.error("Erro ao aprovar/reprovar a remessa: ", error);
      setError(`Erro ao processar: ${error.message || 'Tente novamente mais tarde'}`);
      return false;
    } finally {
      setApprovingRemessa(false);
    }
  }, []);

  const downloadRemessa = useCallback(async (filename) => {
    setDownloadingRemessa(true);
    setError(null);
    try {
      const response = await getRemessaUrl(filename);
      setRemessaUrl(response.data?.link);
    } catch (error) {
      console.error("Erro ao obter url da remessa: ", error);
      setError(`Erro ao obter url da remessa: ${error.message || 'Tente novamente mais tarde'}`);
    } finally {
      setDownloadingRemessa(false);
    }
  }, []);

  const downloadRetorno = useCallback(async (filename) => {
    setDownloadingRetorno(true);
    setError(null);
    try {
      const response = await getRetornoUrl(filename);
      setRetornoUrl(response.data?.link);
    } catch (error) {
      console.error("Erro ao obter url do retorno: ", error);
      setError(`Erro ao obter url do retorno: ${error.message || 'Tente novamente mais tarde'}`);
    } finally {
      setDownloadingRetorno(false);
    }
  }, []);

  const gerarCorrigida = useCallback(async (remessa) => {
    setGerandoCorrigida(true);
    setError(null);
    try {
      await corrigirEspecie(remessa.filename, remessa.timestamp);
      // Após gerar, podemos tentar baixar automaticamente
      const response = await getRemessaCorrigidaUrl(remessa.filename, remessa.timestamp);
      setRemessaCorrigidaUrl(response.data?.link);
    } catch (error) {
      console.error("Erro ao gerar CNAB corrigido: ", error);
      setError(`Erro ao gerar CNAB corrigido: ${error.message || 'Tente novamente mais tarde'}`);
    } finally {
      setGerandoCorrigida(false);
    }
  }, []);

  const downloadCorrigida = useCallback(async (filename, timestamp) => {
    setDownloadingCorrigida(true);
    setError(null);
    try {
      const response = await getRemessaCorrigidaUrl(filename, timestamp);
      setRemessaCorrigidaUrl(response.data?.link);
    } catch (error) {
      console.error("Erro ao obter url da remessa corrigida: ", error);
      setError(`Erro ao obter url da remessa corrigida: ${error.message || 'Tente novamente mais tarde'}`);
    } finally {
      setDownloadingCorrigida(false);
    }
  }, []);

  return {
    // Estados
    approvingRemessa,
    downloadingRemessa,
    downloadingRetorno,
    downloadingCorrigida,
    gerandoCorrigida,
    error,
    remessaUrl,
    retornoUrl,
    remessaCorrigidaUrl,
    
    // Ações
    approveRemessa,
    downloadRemessa,
    downloadRetorno,
    downloadCorrigida,
    gerarCorrigida
  };
}; 