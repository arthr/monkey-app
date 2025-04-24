import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, TextInput, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Pagination, Card } from 'flowbite-react';
import { FiX, FiSearch } from 'react-icons/fi';

const RemessaTable = ({ remessas, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // Função para ordenar as remessas
    const sortRemessas = (column) => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(order);
        setSortColumn(column);
    };

    // Ordenar as remessas de acordo com o estado atual
    const sortedRemessas = [...remessas].sort((a, b) => {
        if (sortColumn === 'timestamp') {
            return sortOrder === 'asc'
                ? new Date(a.timestamp) - new Date(b.timestamp)
                : new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortColumn === 'titulos') {
            return sortOrder === 'asc'
                ? a.titulos?.length - b.titulos?.length
                : b.titulos?.length - a.titulos?.length;
        } else if (sortColumn === 'filename') {
            return sortOrder === 'asc'
                ? a.filename.localeCompare(b.filename)
                : b.filename.localeCompare(a.filename);
        } else if (sortColumn === 'sacadorAvalista') {
            return sortOrder === 'asc'
                ? a.titulos?.[0]?.sacadorAvalista.localeCompare(b.titulos?.[0]?.sacadorAvalista)
                : b.titulos?.[0]?.sacadorAvalista.localeCompare(a.titulos?.[0]?.sacadorAvalista);
        } else if (sortColumn === 'situacao') {
            return sortOrder === 'asc'
                ? (a.situacao?.aprovada ? 1 : 0) - (b.situacao?.aprovada ? 1 : 0)
                : (b.situacao?.aprovada ? 1 : 0) - (a.situacao?.aprovada ? 1 : 0);
        }

        return 0;
    });

    // Função de busca para filtrar as remessas
    const filteredRemessas = sortedRemessas.filter(remessa =>
        remessa.titulos?.[0]?.sacadorAvalista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remessa.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo dos itens da página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRemessas.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular o intervalo de itens sendo exibidos
    const totalItems = filteredRemessas.length;
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const resetSearch = () => setSearchTerm('');

    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="relative w-full md:w-1/3">
                    <TextInput
                        type="text"
                        placeholder="Buscar por Cedente ou Arquivo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiSearch className="text-gray-500" />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={resetSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            <FiX size={18} />
                        </button>
                    )}
                </div>
            </div>

            <Card className="mb-4 w-full overflow-x-auto [&>div:first-child]:p-0">
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell
                                className="cursor-pointer"
                                onClick={() => sortRemessas('sacadorAvalista')}
                            >
                                Cedente {sortColumn === 'sacadorAvalista' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer"
                                onClick={() => sortRemessas('filename')}
                            >
                                Arquivo {sortColumn === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell className="text-center">Usuário</TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => sortRemessas('situacao')}
                            >
                                Situação {sortColumn === 'situacao' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => sortRemessas('timestamp')}
                            >
                                Dt. Importação {sortColumn === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => sortRemessas('titulos')}
                            >
                                Títulos {sortColumn === 'titulos' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell className="text-center">Ações</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {currentItems.map(remessa => (
                            <TableRow key={remessa.filename} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>{remessa.titulos?.[0]?.sacadorAvalista || 'N/D'}</TableCell>
                                <TableCell>{remessa.filename}</TableCell>
                                <TableCell className="text-center">{remessa.situacao?.usuario || 'N/D'}</TableCell>
                                <TableCell className="flex justify-center">
                                    {remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="success">Aprovada</Badge>
                                    ) : !remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="failure">Reprovada</Badge>
                                    ) : (
                                        <Badge color="warning">Pendente</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">{new Date(remessa.timestamp).toLocaleString()}</TableCell>
                                <TableCell className="text-center">{remessa.titulos?.length || 0}</TableCell>
                                <TableCell className="text-center">
                                    <Link to={`/remessas/${remessa.filename}`} className="text-blue-700 hover:underline">
                                        Ver Detalhes
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Paginação */}
            <div className="flex flex-col justify-center mt-4 text-center">
                {/* Table Data Navigation */}
                <div className="text-sm text-gray-700 dark:text-gray-400">
                    Mostrando <span className="font-medium">{totalItems > 0 ? startItem : 0}</span> a{" "}
                    <span className="font-medium">{endItem}</span> de{" "}
                    <span className="font-medium">{totalItems}</span> registros
                </div>
                <Pagination
                    currentPage={currentPage}
                    onPageChange={paginate}
                    showIcons={true}
                    totalPages={Math.ceil(filteredRemessas.length / itemsPerPage)}
                    nextLabel=""
                    previousLabel=""
                />
            </div>
        </div>
    );
};

export default RemessaTable;