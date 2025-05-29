import React, { useState } from 'react';
import { Card, Alert } from 'flowbite-react';
import { FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import FileUpload from '../components/FileUpload';
import NfeVisualizacao from '../components/NfeVisualizacao';
import xmlParser from '../services/xmlParser';

const PreVisualizacaoPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nfeData, setNfeData] = useState(null);
    const [sucessoUpload, setSucessoUpload] = useState(false);

    const handleFileSelect = async (file) => {
        if (!file) {
            setNfeData(null);
            setError(null);
            setSucessoUpload(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSucessoUpload(false);

        try {
            const dadosNfe = await xmlParser.parseXmlFile(file);
            setNfeData(dadosNfe);
            setSucessoUpload(true);
        } catch (err) {
            setError(err.message || 'Erro ao processar o arquivo XML');
            setNfeData(null);
            setSucessoUpload(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Cabeçalho da página */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <FiFileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Pré-visualização de NFe
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Faça upload de um arquivo XML de Nota Fiscal Eletrônica para visualizar seus dados.
                </p>
            </div>

            {/* Componente de upload */}
            <FileUpload 
                onFileSelect={handleFileSelect}
                loading={loading}
                error={error}
            />

            {/* Mensagem de sucesso */}
            {sucessoUpload && !loading && (
                <Alert color="success" className="mb-6">
                    <div className="flex items-center space-x-2">
                        <FiCheckCircle className="w-5 h-5" />
                        <span>
                            <strong>Sucesso!</strong> O arquivo XML foi processado com sucesso. 
                            Visualize os dados da NFe abaixo.
                        </span>
                    </div>
                </Alert>
            )}

            {/* Mensagem de erro */}
            {error && !loading && (
                <Alert color="failure" className="mb-6">
                    <div className="flex items-center space-x-2">
                        <FiXCircle className="w-5 h-5" />
                        <span>
                            <strong>Erro:</strong> {error}
                        </span>
                    </div>
                </Alert>
            )}

            {/* Visualização da NFe */}
            {nfeData && !loading && (
                <NfeVisualizacao nfeData={nfeData} />
            )}

            {/* Estado vazio */}
            {!nfeData && !loading && !error && (
                <Card className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <FiFileText className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Nenhum arquivo selecionado
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Selecione um arquivo XML de NFe para começar a visualizar os dados.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Informações sobre o recurso */}
            <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Sobre a Pré-visualização de NFe
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800 dark:text-blue-200">
                        <div>
                            <h4 className="font-semibold mb-2">Recursos disponíveis:</h4>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Visualização completa dos dados da NFe</li>
                                <li>Informações de emitente e destinatário</li>
                                <li>Detalhamento de itens e valores</li>
                                <li>Dados de transporte e cobrança</li>
                                <li>Informações fiscais e complementares</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Características técnicas:</h4>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Processamento local no navegador</li>
                                <li>Suporte a arquivos XML padrão NFe</li>
                                <li>Interface responsiva e intuitiva</li>
                                <li>Formatação automática de valores</li>
                                <li>Organização por abas temáticas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PreVisualizacaoPage; 