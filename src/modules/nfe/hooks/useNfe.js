import { useState, useCallback } from 'react';
import xmlParser from '../services/xmlParser';
import pdfGenerator from '../services/pdfGenerator';

/**
 * Hook personalizado para gerenciar o estado e operações do módulo NFe
 */
export const useNfe = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nfeData, setNfeData] = useState(null);
    const [uploadHistory, setUploadHistory] = useState([]);
    const [gerandoPdf, setGerandoPdf] = useState(false);

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
     * Gera PDF a partir dos dados da NFe atual
     * @returns {Promise<void>}
     */
    const gerarPdf = useCallback(async () => {
        if (!nfeData) {
            throw new Error('Nenhum dado de NFe disponível para gerar PDF');
        }

        setGerandoPdf(true);
        setError(null);

        try {
            await pdfGenerator.gerarPdf(nfeData);
        } catch (err) {
            const mensagemErro = err.message || 'Erro ao gerar PDF';
            setError(mensagemErro);
            throw new Error(mensagemErro);
        } finally {
            setGerandoPdf(false);
        }
    }, [nfeData]);

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

    /**
     * Baixa os dados da NFe em formato JSON
     */
    const baixarJson = useCallback(() => {
        try {
            const jsonData = exportarDados();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `nfe-${nfeData?.identificacao?.numero || 'dados'}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (error) {
            throw new Error('Erro ao baixar arquivo JSON: ' + error.message);
        }
    }, [nfeData, exportarDados]);

    return {
        // Estado
        loading,
        error,
        nfeData,
        uploadHistory,
        gerandoPdf,
        
        // Ações
        processarArquivo,
        gerarPdf,
        limparDados,
        limparHistorico,
        removerDoHistorico,
        validarArquivo,
        exportarDados,
        baixarJson,
        
        // Computadas
        temDados: !!nfeData,
        temHistorico: uploadHistory.length > 0,
        podeFiltrarPdf: !!nfeData && !gerandoPdf
    };
};

export default useNfe; 