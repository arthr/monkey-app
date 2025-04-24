import React from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeadCell, Card } from 'flowbite-react';

const TitulosTable = ({ titulos = [] }) => {
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

    return (
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
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                                Nenhum título disponível.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TitulosTable;