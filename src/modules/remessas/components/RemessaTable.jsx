import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, TextInput, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Pagination, Card, Select } from 'flowbite-react';
import { FiX, FiSearch } from 'react-icons/fi';
import NFeValidationBadge from './NFeValidationBadge';
import { useRemessaFilters } from '../hooks/useRemessaFilters';
import { useRemessaSort } from '../hooks/useRemessaSort';
import { useRemessaPagination } from '../hooks/useRemessaPagination';
import { useRemessaCalculations } from '../hooks/useRemessaCalculations';

const RemessaTableRow = memo(({ remessa }) => {
    const { valorTotal, situacaoStatus } = useRemessaCalculations(remessa);

    return (
        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="font-medium">{remessa.titulos?.[0]?.sacadorAvalista || 'N/D'}</TableCell>
            <TableCell>{remessa.filename}</TableCell>
            <TableCell className="text-center">{remessa.situacao?.usuario || 'N/D'}</TableCell>
            <TableCell>
                <div className="grid place-items-center">
                    {situacaoStatus === 'aprovada' ? (
                        <Badge color="success">Aprovada</Badge>
                    ) : situacaoStatus === 'reprovada' ? (
                        <Badge color="failure">Reprovada</Badge>
                    ) : (
                        <Badge color="warning">Pendente</Badge>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-center">{new Date(remessa.timestamp).toLocaleString()}</TableCell>
            <TableCell className="text-center">{remessa.titulos?.length || 0}</TableCell>
            <TableCell className="text-right font-medium">{valorTotal}</TableCell>
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
    );
});

const RemessaTable = memo(() => {
    const { filters, filteredRemessas, setFilter, resetFilters } = useRemessaFilters();
    const { sortedRemessas, sort, setSortColumn } = useRemessaSort(filteredRemessas);
    const { paginatedRemessas, pagination, setCurrentPage, setItemsPerPage } = useRemessaPagination(sortedRemessas);

    const hasActiveFilters = filters.search || 
        filters.document !== 'todos' || 
        filters.company !== 'todos' || 
        filters.status !== 'todos';

    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Campo de busca */}
                <div className="relative flex-1">
                    <TextInput
                        type="text"
                        placeholder="Buscar por Cedente ou Arquivo..."
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiSearch className="text-gray-500" />
                    </div>
                    {filters.search && (
                        <button
                            onClick={() => setFilter('search', '')}
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
                        value={filters.document}
                        onChange={(e) => setFilter('document', e.target.value)}
                        className="min-w-[180px]"
                    >
                        <option value="todos">Todos os Documentos</option>
                        <option value="identificados">Identificados</option>
                        <option value="nao-identificados">Não Identificados</option>
                        <option value="sem-documentos">Sem Documentos</option>
                    </Select>

                    {/* Filtro de Empresa */}
                    <Select
                        value={filters.company}
                        onChange={(e) => setFilter('company', e.target.value)}
                        className="min-w-[150px]"
                    >
                        <option value="todos">Todas as Empresas</option>
                        <option value="FID">FIDC</option>
                        <option value="SEC">Securitizadora</option>
                    </Select>

                    {/* Filtro de Situação */}
                    <Select
                        value={filters.status}
                        onChange={(e) => setFilter('status', e.target.value)}
                        className="min-w-[140px]"
                    >
                        <option value="todos">Todas as Situações</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="reprovada">Reprovada</option>
                        <option value="pendente">Pendente</option>
                    </Select>

                    {/* Botão para limpar filtros */}
                    {hasActiveFilters && (
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
                                onClick={() => setSortColumn('sacadorAvalista')}
                            >
                                Cedente {sort.column === 'sacadorAvalista' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer"
                                onClick={() => setSortColumn('filename')}
                            >
                                Arquivo {sort.column === 'filename' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell className="text-center">Usuário</TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => setSortColumn('situacao')}
                            >
                                Situação {sort.column === 'situacao' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => setSortColumn('timestamp')}
                            >
                                Dt. Importação {sort.column === 'timestamp' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-center"
                                onClick={() => setSortColumn('titulos')}
                            >
                                Títulos {sort.column === 'titulos' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell
                                className="cursor-pointer text-right"
                                onClick={() => setSortColumn('valorTotal')}
                            >
                                Valor Total {sort.column === 'valorTotal' && (sort.order === 'asc' ? '↑' : '↓')}
                            </TableHeadCell>
                            <TableHeadCell className="text-center">Documentos</TableHeadCell>
                            <TableHeadCell className="text-center">Ações</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {paginatedRemessas.map(remessa => (
                            <RemessaTableRow key={remessa.filename} remessa={remessa} />
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Paginação */}
            <div className="flex flex-col justify-center mt-4 text-center">
                {/* Table Data Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        Mostrando <span className="font-medium">{pagination.startItem}</span> a{" "}
                        <span className="font-medium">{pagination.endItem}</span> de{" "}
                        <span className="font-medium">{pagination.totalItems}</span> registros
                    </div>

                    <Pagination
                        currentPage={pagination.currentPage}
                        onPageChange={setCurrentPage}
                        showIcons={true}
                        totalPages={pagination.totalPages}
                        nextLabel=""
                        previousLabel=""
                    />
                    
                    {/* Seletor de itens por página */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                        <span>Registros por página:</span>
                        <Select
                            value={pagination.itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="w-20"
                            sizing="sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Select>
                    </div>
                </div>
                
                
            </div>
        </div>
    );
});

export default RemessaTable;