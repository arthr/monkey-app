import { useState, useEffect } from 'react';
import { getRemessa, getRemessaUrl, getRetornoUrl } from '../services/remessaApi';

const useRemessaDetail = (filename) => {
    const [remessa, setRemessa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [downloadingRemessa, setDownloadingRemessa] = useState(false);
    const [downloadingRetorno, setDownloadingRetorno] = useState(false);
    const [remessaUrl, setRemessaUrl] = useState(null);
    const [retornoUrl, setRetornoUrl] = useState(null);

    const fetchRemessa = async () => {
        if (!filename) return;

        setLoading(true);
        try {
            const response = await getRemessa(filename);
            setRemessa(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar a remessa: ", err);
            setError(`Erro ao carregar os detalhes da remessa: ${err.message || 'Tente novamente mais tarde'}`);
        } finally {
            setLoading(false);
        }
    };

    // Atualiza após aprovação/reprovação
    const refreshRemessa = () => {
        // Precisa de um pequeno delay para garantir que a lambda processou a remessa
        // e o DynamoDB atualizou o item
        setTimeout(() => {
            fetchRemessa();
        }, 2000);
    };

    useEffect(() => {
        fetchRemessa();
    }, [filename]);

    const fetchRemessaUrl = async (filename) => {
        if (!filename) return;

        setDownloadingRemessa(true);
        try {
            const response = await getRemessaUrl(filename);
            setRemessaUrl(response.data?.link);
            setError(null);
        } catch (err) {
            console.error("Erro ao obter url da remessa: ", err);
            setError(`Erro ao obter url da remessa: ${err.message || 'Tente novamente mais tarde'}`);
        } finally {
            setDownloadingRemessa(false);
        }
    }

    const fetchRetornoUrl = async (filename) => {
        if (!filename) return;

        setDownloadingRetorno(true);
        try {
            const response = await getRetornoUrl(filename);
            setRetornoUrl(response.data?.link);
            setError(null);
        } catch (err) {
            console.error("Erro ao obter url do retorno: ", err);
            setError(`Erro ao obter url do retorno: ${err.message || 'Tente novamente mais tarde'}`);
        } finally {
            setDownloadingRetorno(false);
        }
    }

    return {
        remessa,
        loading,
        error,
        downloadingRemessa,
        downloadingRetorno,
        remessaUrl,
        retornoUrl,
        refreshRemessa,
        fetchRemessaUrl,
        fetchRetornoUrl,
    };
};

export default useRemessaDetail;