import { useState, useEffect } from 'react';
import { getRemessa } from '../services/remessaApi';

const useRemessaDetail = (filename) => {
    const [remessa, setRemessa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
        fetchRemessa();
    };

    useEffect(() => {
        fetchRemessa();
    }, [filename]);

    return {
        remessa,
        loading,
        error,
        refreshRemessa
    };
};

export default useRemessaDetail;