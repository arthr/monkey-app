import React, { useState } from 'react';
import { Button, Dropdown, DropdownItem } from 'flowbite-react';
import { FiDownload, FiFileText, FiMoreVertical, FiShare2, FiCopy } from 'react-icons/fi';
import pdfGenerator from '../services/pdfGenerator';

const NfeAcoes = ({ nfeData, className = '' }) => {
    const [gerandoPdf, setGerandoPdf] = useState(false);
    const [baixandoJson, setBaixandoJson] = useState(false);

    // Desabilita botão de compartilhar (bloquear compartilhamento independente do navegador)
    const shareDisabled = true;

    const handleGerarPdf = async () => {
        if (!nfeData) return;
        
        try {
            setGerandoPdf(true);
            await pdfGenerator.gerarPdf(nfeData);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF: ' + error.message);
        } finally {
            setGerandoPdf(false);
        }
    };

    const handleBaixarJson = () => {
        if (!nfeData) return;

        try {
            setBaixandoJson(true);
            const jsonData = JSON.stringify(nfeData, null, 2);
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
            console.error('Erro ao baixar JSON:', error);
            alert('Erro ao baixar arquivo JSON: ' + error.message);
        } finally {
            setBaixandoJson(false);
        }
    };

    const handleCopiarChaveAcesso = () => {
        if (!nfeData?.identificacao?.chaveAcesso) return;
        
        navigator.clipboard.writeText(nfeData.identificacao.chaveAcesso)
            .then(() => {
                alert('Chave de acesso copiada para a área de transferência!');
            })
            .catch(() => {
                alert('Erro ao copiar chave de acesso');
            });
    };

    const handleCompartilhar = () => {
        if (!navigator.share) {
            alert('Compartilhamento não suportado neste navegador');
            return;
        }

        const dados = {
            title: `NFe ${nfeData?.identificacao?.numero || 'N/A'}`,
            text: `Nota Fiscal Eletrônica - Nº ${nfeData?.identificacao?.numero || 'N/A'} - ${nfeData?.emitente?.razaoSocial || 'N/A'}`,
            url: window.location.href
        };

        navigator.share(dados).catch((error) => {
            console.error('Erro ao compartilhar:', error);
        });
    };

    if (!nfeData) return null;

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {/* Botão principal - Gerar PDF */}
            <Button
                color="blue"
                size="sm"
                onClick={handleGerarPdf}
                disabled={gerandoPdf}
                className="flex items-center space-x-2"
            >
                {gerandoPdf ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Gerando PDF...</span>
                    </>
                ) : (
                    <>
                        <FiDownload className="w-4 h-4" />
                        <span>Gerar PDF</span>
                    </>
                )}
            </Button>

            {/* Menu dropdown com ações adicionais */}
            <Dropdown
                arrowIcon={false}
                inline
                label={
                    <Button
                        color="gray"
                        size="sm"
                        className="p-2"
                        title="Mais ações"
                    >
                        <FiMoreVertical className="w-4 h-4" />
                    </Button>
                }
            >
                <DropdownItem
                    onClick={handleBaixarJson}
                    disabled={baixandoJson}
                    className="flex items-center space-x-2"
                >
                    <FiFileText className="w-4 h-4" />
                    <span>{baixandoJson ? 'Baixando...' : 'Baixar JSON'}</span>
                </DropdownItem>

                <DropdownItem
                    onClick={handleCopiarChaveAcesso}
                    className="flex items-center space-x-2"
                >
                    <FiCopy className="w-4 h-4" />
                    <span>Copiar Chave de Acesso</span>
                </DropdownItem>

                {navigator.share && !shareDisabled && (
                    <DropdownItem
                        onClick={handleCompartilhar}
                        className="flex items-center space-x-2"
                    >
                        <FiShare2 className="w-4 h-4" />
                        <span>Compartilhar</span>
                    </DropdownItem>
                )}
            </Dropdown>
        </div>
    );
};

export default NfeAcoes; 