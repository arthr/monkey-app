import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, TextInput, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Pagination, Card, Select } from 'flowbite-react';
import { FiX, FiSearch } from 'react-icons/fi';
import NFeValidationBadge from './NFeValidationBadge';
import { validarChavesRemessa } from '../utils/nfeValidator';

const RemessaTable = ({ remessas }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Novos estados para os filtros rápidos
    const [documentFilter, setDocumentFilter] = useState('todos'); // todos, identificados, nao-identificados, sem-documentos
    const [companyFilter, setCompanyFilter] = useState('todos'); // todos, FID, SEC
    const [statusFilter, setStatusFilter] = useState('todos'); // todos, aprovada, reprovada, pendente

    // Função para calcular o valor total dos títulos
    const calcularValorTotal = (remessa, withLocale = true) => {
        if (!remessa?.titulos) return "R$ 0,00";
        const total = remessa.titulos.reduce(
            (sum, titulo) => sum + parseFloat(titulo.valorTitulo || 0),
            0
        );
        if (!withLocale) return total;
        // Formatar o valor total como moeda brasileira
        return total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    // Função para determinar o status de documentos de uma remessa
    const getDocumentStatus = (remessa) => {
        const validacao = validarChavesRemessa(remessa);
        
        if (validacao.totalTitulos === 0) return 'sem-titulos';
        if (validacao.titulosComChave === 0) return 'sem-documentos';
        if (validacao.chavesValidas === validacao.titulosComChave) return 'identificados';
        if (validacao.chavesInvalidas > 0) return 'nao-identificados';
        return 'parcial';
    };

    // Função para determinar o status da situação de uma remessa
    const getSituacaoStatus = (remessa) => {
        if (remessa.situacao?.aprovada && remessa.situacao?.timestamp) return 'aprovada';
        if (!remessa.situacao?.aprovada && remessa.situacao?.timestamp) return 'reprovada';
        return 'pendente';
    };

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
        } else if (sortColumn === 'valorTotal') {
            return sortOrder === 'asc'
                ? calcularValorTotal(a, false) - calcularValorTotal(b, false)
                : calcularValorTotal(b, false) - calcularValorTotal(a, false);
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

    // Função de busca e filtros para filtrar as remessas
    const filteredRemessas = sortedRemessas.filter(remessa => {
        // Filtro de busca por texto
        const matchesSearch = remessa.titulos?.[0]?.sacadorAvalista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            remessa.filename.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro de documentos
        let matchesDocumentFilter = true;
        if (documentFilter !== 'todos') {
            const docStatus = getDocumentStatus(remessa);
            matchesDocumentFilter = docStatus === documentFilter;
        }

        // Filtro de empresa (companyPrefix)
        let matchesCompanyFilter = true;
        if (companyFilter !== 'todos') {
            matchesCompanyFilter = remessa.companyPrefix === companyFilter;
        }

        // Filtro de situação
        let matchesStatusFilter = true;
        if (statusFilter !== 'todos') {
            const situacaoStatus = getSituacaoStatus(remessa);
            matchesStatusFilter = situacaoStatus === statusFilter;
        }

        return matchesSearch && matchesDocumentFilter && matchesCompanyFilter && matchesStatusFilter;
    });

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
    
    const resetFilters = () => {
        setSearchTerm('');
        setDocumentFilter('todos');
        setCompanyFilter('todos');
        setStatusFilter('todos');
        setCurrentPage(1);
    };

    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Campo de busca */}
                <div className="relative flex-1">
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

                {/* Filtros rápidos */}
                <div className="flex flex-col sm:flex-row gap-2">
                    {/* Filtro de Documentos */}
                    <Select
                        value={documentFilter}
                        onChange={(e) => setDocumentFilter(e.target.value)}
                        className="min-w-[180px]"
                    >
                        <option value="todos">Todos os Documentos</option>
                        <option value="identificados">Identificados</option>
                        <option value="nao-identificados">Não Identificados</option>
                        <option value="sem-documentos">Sem Documentos</option>
                    </Select>

                    {/* Filtro de Empresa */}
                    <Select
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        className="min-w-[150px]"
                    >
                        <option value="todos">Todas as Empresas</option>
                        <option value="FID">FIDC</option>
                        <option value="SEC">Securitizadora</option>
                    </Select>

                    {/* Filtro de Situação */}
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="min-w-[140px]"
                    >
                        <option value="todos">Todas as Situações</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="reprovada">Reprovada</option>
                        <option value="pendente">Pendente</option>
                    </Select>

                    {/* Botão para limpar filtros */}
                    {(searchTerm || documentFilter !== 'todos' || companyFilter !== 'todos' || statusFilter !== 'todos') && (
                        <button
                            onClick={resetFilters}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                        >
                            Limpar Filtros
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
                            <TableHeadCell
                                className="cursor-pointer text-right"
                                onClick={() => sortRemessas('valorTotal')}
                            >
                                Valor Total {sortColumn === 'valorTotal' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell className="text-center">Documentos</TableHeadCell>
                            <TableHeadCell className="text-center">Ações</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {currentItems.map(remessa => (
                            <TableRow key={remessa.filename} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="font-medium">{remessa.titulos?.[0]?.sacadorAvalista || 'N/D'}</TableCell>
                                <TableCell>{remessa.filename}</TableCell>
                                <TableCell className="text-center">{remessa.situacao?.usuario || 'N/D'}</TableCell>
                                <TableCell>
                                    <div className="grid place-items-center">
                                    {remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="success">Aprovada</Badge>
                                    ) : !remessa.situacao?.aprovada && remessa.situacao?.timestamp ? (
                                        <Badge color="failure">Reprovada</Badge>
                                    ) : (
                                        <Badge color="warning">Pendente</Badge>
                                    )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{new Date(remessa.timestamp).toLocaleString()}</TableCell>
                                <TableCell className="text-center">{remessa.titulos?.length || 0}</TableCell>
                                <TableCell className="text-right font-medium">{calcularValorTotal(remessa)}</TableCell>
                                <TableCell>
                                    <div className="grid place-items-center">
                                        <NFeValidationBadge remessa={remessa} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link to={`/detalhes/${remessa.filename}`} className="text-blue-700 hover:underline">
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