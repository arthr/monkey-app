import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeadCell, Card, Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import { FiFileText, FiX } from 'react-icons/fi';

const TitulosTable = ({ titulos = [] }) => {
    const [modalAberto, setModalAberto] = useState(false);
    const [chaveNotaSelecionada, setChaveNotaSelecionada] = useState('');

    // Função para formatar valor como moeda
    const formatarMoeda = (valor) => {
        return parseFloat(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Função para formatar a data de vencimento
    const formatarData = (data) => {
        if (!data) return 'N/A';

        try {
            if (data.includes('/')) {
                const [day, month, year] = data.split('/');
                return new Date(`${year.length === 2 ? '20' + year : year}-${month}-${day}`).toLocaleDateString();
            }
            // Caso seja no formato DDMMYY
            if (data.length === 6) {
                const dia = data.substring(0, 2);
                const mes = data.substring(2, 4);
                const ano = '20' + data.substring(4, 6);
                return `${dia}/${mes}/${ano}`;
            }
            return data;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return data || 'N/A';
        }
    };

    // Função para abrir modal com a chave da nota fiscal
    const abrirModalChaveNota = (chaveNota) => {
        setChaveNotaSelecionada(chaveNota);
        setModalAberto(true);
    };

    return (
        <>
            <Card className="mb-4 w-full overflow-x-auto [&>div:first-child]:p-0">
                <Table striped hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Identificação do Título</TableHeadCell>
                            <TableHeadCell>Sacador Avalista (Cedente)</TableHeadCell>
                            <TableHeadCell className="text-right">Valor do Título</TableHeadCell>
                            <TableHeadCell className="text-center">Vencimento</TableHeadCell>
                            <TableHeadCell>Pagador (Sacado)</TableHeadCell>
                            <TableHeadCell>Endereço do Pagador</TableHeadCell>
                            <TableHeadCell className="text-center">Chave NF-e</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {titulos.length > 0 ? (
                            titulos.map((titulo, index) => (
                                <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {titulo.numeroDocumento || 'N/A'}
                                    </TableCell>
                                    <TableCell>{titulo.sacadorAvalista || 'N/A'}</TableCell>
                                    <TableCell className="text-right font-medium text-gray-900 dark:text-white">{formatarMoeda(titulo.valorTitulo)}</TableCell>
                                    <TableCell className="text-center">{formatarData(titulo.vencimento)}</TableCell>
                                    <TableCell className="flex gap-2">
                                        {titulo.nomePagador || 'N/A'}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {titulo.enderecoPagador ?
                                            `${titulo.enderecoPagador}, ${titulo.cidadePagador || ''} - ${titulo.estadoPagador || ''}` :
                                            'N/A'
                                        }
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {titulo.chaveNotaFiscal ? (
                                            <button
                                                onClick={() => abrirModalChaveNota(titulo.chaveNotaFiscal)}
                                                className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                title="Ver Chave da Nota Fiscal"
                                            >
                                                <FiFileText className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button className="p-2 text-gray-300 dark:text-gray-600 cursor-not-allowed" title="Chave da Nota Fiscal não disponível">
                                                <FiFileText className="w-4 h-4" />
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Nenhum título disponível.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Modal para exibir a chave da nota fiscal */}
            <Modal
                show={modalAberto}
                onClose={() => setModalAberto(false)}
                size="md"
                dismissible
            >
                <ModalHeader>
                    Chave da Nota Fiscal
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Chave de Acesso:</p>
                            <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
                                {chaveNotaSelecionada}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                color="gray"
                                onClick={() => setModalAberto(false)}
                            >
                                <FiX className="mr-2 w-4 h-4" />
                                Fechar
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default TitulosTable;