import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiAlertCircle } from 'react-icons/fi';
import { Card } from 'flowbite-react';

const FileUpload = ({ onFileSelect, loading = false, error = null }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Manipuladores de drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file) => {
        // Validar se é um arquivo XML
        if (!file.name.toLowerCase().endsWith('.xml')) {
            alert('Por favor, selecione um arquivo XML válido.');
            return;
        }

        // Validar tamanho do arquivo (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('O arquivo é muito grande. Máximo permitido: 10MB.');
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="mb-6">
            <div className="space-y-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Upload de Arquivo XML da NFe
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selecione ou arraste um arquivo XML de Nota Fiscal Eletrônica
                    </p>
                </div>

                {/* Área de upload */}
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                        ${dragActive 
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }
                        ${loading ? 'pointer-events-none opacity-50' : ''}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xml"
                        onChange={handleChange}
                        className="hidden"
                        disabled={loading}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Processando arquivo...</p>
                        </div>
                    ) : selectedFile ? (
                        <div className="flex items-center justify-center space-x-3">
                            <FiFile className="w-6 h-6 text-blue-600" />
                            <span className="text-gray-900 dark:text-white font-medium">
                                {selectedFile.name}
                            </span>
                            <span className="text-gray-500 text-sm">
                                ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Remover arquivo"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                <span className="font-medium">Clique para selecionar</span> ou arraste o arquivo aqui
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Apenas arquivos XML (máximo 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <FiAlertCircle className="w-5 h-5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Informações adicionais */}
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    <p>• Formatos aceitos: XML de Nota Fiscal Eletrônica (NFe)</p>
                    <p>• Tamanho máximo: 10MB</p>
                    <p>• Os dados serão processados localmente no seu navegador</p>
                </div>
            </div>
        </Card>
    );
};

export default FileUpload; 