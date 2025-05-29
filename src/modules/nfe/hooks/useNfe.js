import { useState, useCallback } from 'react';
import xmlParser from '../services/xmlParser';

/**
 * Hook personalizado para gerenciar o estado e operações do módulo NFe
 */
export const useNfe = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nfeData, setNfeData] = useState(null);
    const [uploadHistory, setUploadHistory] = useState([]);

    /**
     * Processa um arquivo XML de NFe
     * @param {File} file - Arquivo XML a ser processado
     * @returns {Promise<Object>} - Dados da NFe processados
     */
    const processarArquivo = useCallback(async (file) => {
        if (!file) {
            setNfeData(null);
            setError(null);
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const dados = await xmlParser.parseXmlFile(file);
            setNfeData(dados);
            
            // Adicionar ao histórico de uploads
            const novoItem = {
                id: Date.now(),
                nomeArquivo: file.name,
                tamanho: file.size,
                dataUpload: new Date(),
                numeroNfe: dados.identificacao?.numero,
                chaveAcesso: dados.identificacao?.chaveAcesso,
                emitente: dados.emitente?.razaoSocial,
                valorTotal: dados.totais?.valorTotalNfe
            };
            
            setUploadHistory(prev => [novoItem, ...prev.slice(0, 9)]); // Manter apenas os últimos 10
            
            return dados;
        } catch (err) {
            const mensagemErro = err.message || 'Erro ao processar o arquivo XML';
            setError(mensagemErro);
            setNfeData(null);
            throw new Error(mensagemErro);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Limpa os dados atuais da NFe
     */
    const limparDados = useCallback(() => {
        setNfeData(null);
        setError(null);
    }, []);

    /**
     * Limpa o histórico de uploads
     */
    const limparHistorico = useCallback(() => {
        setUploadHistory([]);
    }, []);

    /**
     * Remove um item específico do histórico
     * @param {number} id - ID do item a ser removido
     */
    const removerDoHistorico = useCallback((id) => {
        setUploadHistory(prev => prev.filter(item => item.id !== id));
    }, []);

    /**
     * Valida se um arquivo é um XML válido de NFe
     * @param {File} file - Arquivo a ser validado
     * @returns {Object} - Resultado da validação
     */
    const validarArquivo = useCallback((file) => {
        const erros = [];
        
        if (!file) {
            erros.push('Nenhum arquivo selecionado');
            return { valido: false, erros };
        }

        if (!file.name.toLowerCase().endsWith('.xml')) {
            erros.push('O arquivo deve ter extensão .xml');
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB
            erros.push('O arquivo é muito grande (máximo 50MB)');
        }

        if (file.size === 0) {
            erros.push('O arquivo está vazio');
        }

        return {
            valido: erros.length === 0,
            erros
        };
    }, []);

    /**
     * Exporta os dados da NFe para formato JSON
     * @returns {string} - Dados em formato JSON
     */
    const exportarDados = useCallback(() => {
        if (!nfeData) {
            throw new Error('Nenhum dado de NFe disponível para exportar');
        }
        
        return JSON.stringify(nfeData, null, 2);
    }, [nfeData]);

    return {
        // Estado
        loading,
        error,
        nfeData,
        uploadHistory,
        
        // Ações
        processarArquivo,
        limparDados,
        limparHistorico,
        removerDoHistorico,
        validarArquivo,
        exportarDados,
        
        // Computadas
        temDados: !!nfeData,
        temHistorico: uploadHistory.length > 0
    };
};

export default useNfe; 