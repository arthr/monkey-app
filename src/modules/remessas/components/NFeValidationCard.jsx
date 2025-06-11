import React, { useState } from 'react';
import { Card, Badge, Button, Modal, ModalHeader, ModalBody, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiEye, FiFileText, FiTruck } from 'react-icons/fi';
import { validarChavesRemessa, formatarChaveNFe } from '../utils/nfeValidator';

const NFeValidationCard = ({ remessa }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const validacao = validarChavesRemessa(remessa);

    const getStatusBadge = (detalhe) => {
        if (!detalhe.temChave) {0
            return <Badge className="rounded-sm text-xs px-2 py-0.5" color="warning" icon={FiAlertTriangle}>Sem Documento</Badge>;
        }
        
        if (detalhe.chaveValida) {
            const tipo = detalhe.validacao?.tipoDocumento;
            if (tipo?.tipo === 'NOTA_SERVICO') {
                return <Badge className="rounded-sm text-xs px-2 py-0.5" color="gray" icon={FiFileText}>Nota Serviço</Badge>;
            } else if (tipo?.subtipo === 'CTe') {
                return <Badge className="rounded-sm text-xs px-2 py-0.5" color="blue" icon={FiTruck}>CTe</Badge>;
            } else if (tipo?.subtipo === 'NFe') {
                return <Badge className="rounded-sm text-xs px-2 py-0.5" color="success" icon={FiCheck}>NFe</Badge>;
            } else if (tipo?.subtipo === 'NFCe') {
                return <Badge className="rounded-sm text-xs px-2 py-0.5" color="success" icon={FiCheck}>NFCe</Badge>;
            }
            return <Badge className="rounded-sm text-xs px-2 py-0.5" color="success" icon={FiCheck}>Identificado</Badge>;
        }
        
        return <Badge className="rounded-sm text-xs px-2 py-0.5" color="failure" icon={FiX}>Não Identificado</Badge>;
    };

    const getResumoStatus = () => {
        if (validacao.totalTitulos === 0) {
            return { color: 'gray', icon: FiInfo, text: 'Não há Títulos' };
        }
        if (validacao.titulosComChave === 0) {
            return { color: 'warning', icon: FiAlertTriangle, text: 'Não há Documentos Fiscais' };
        }
        if (validacao.chavesValidas === validacao.titulosComChave) {
            return { color: 'success', icon: FiCheck, text: 'Documentos Identificados' };
        }
        if (validacao.chavesInvalidas > 0) {
            return { color: 'failure', icon: FiX, text: 'Documentos Não Identificados' };
        }
        return { color: 'warning', icon: FiAlertTriangle, text: 'Identificação Parcial' };
    };

    const resumo = getResumoStatus();

    return (
        <>
            <Card>
                <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Identificação de Documentos
                    </h5>
                    <Badge color={resumo.color} icon={resumo.icon}>
                        {resumo.text}
                    </Badge>
                </div>
                
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {validacao.totalTitulos}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total de Títulos
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {validacao.titulosComChave}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Com Documentos
                            </div>
                        </div>
                        {validacao.titulosComChave > 0 && (
                            <>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {validacao.chavesValidas}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Documentos Identificados
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {validacao.chavesInvalidas}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Não Identificados
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    

                    {validacao.totalTitulos > 0 && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                size="sm"
                                outline
                                color="blue"
                                onClick={() => setModalOpen(true)}
                                className="w-full"
                            >
                                <FiEye className="mr-2" />
                                Ver Identificação dos Documentos
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)} size="6xl">
                <ModalHeader>
                    Documentos Identificados
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        {/* Tabela de detalhes */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell>Identificação</TableHeadCell>
                                        <TableHeadCell>Número do Título</TableHeadCell>
                                        <TableHeadCell className="text-center">Tipo</TableHeadCell>
                                        <TableHeadCell>Documento Fiscal</TableHeadCell>
                                        <TableHeadCell className="text-center">Erros</TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {validacao.detalhes.map((detalhe, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {detalhe.numeroDocumento}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {detalhe.identificacao}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="grid place-items-center">
                                                    {getStatusBadge(detalhe)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {detalhe.chave ? formatarChaveNFe(detalhe.chave) : '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {detalhe.validacao?.erros?.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {detalhe.validacao.erros.map((erro, erroIndex) => (
                                                            <div key={erroIndex} className="text-sm text-red-600 dark:text-red-400">
                                                                • {erro}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    detalhe.temChave ? (
                                                        <span className="text-green-600 dark:text-green-400">✓ OK</span>
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default NFeValidationCard; 