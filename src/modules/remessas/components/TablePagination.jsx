import React from 'react';
import { Button, Select, Label, ButtonGroup } from 'flowbite-react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const TablePagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelect = true,
    showItemsInfo = true,
    className = ''
}) => {
    // Calcular o número total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calcular o intervalo de itens sendo exibidos
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Determinar quais botões de página mostrar
    const getPageNumbers = () => {
        const delta = 1; // Número de páginas a mostrar antes e depois da atual
        const pages = [];
        
        // Sempre mostrar a primeira página
        if (currentPage > delta + 1) {
            pages.push(1);
            // Se não estiver adjacente à primeira página, mostrar ellipsis
            if (currentPage > delta + 2) {
                pages.push('...');
            }
        }
        
        // Adicionar páginas ao redor da página atual
        const range = Array.from(
            { length: 2 * delta + 1 },
            (_, i) => currentPage - delta + i
        ).filter(page => page > 0 && page <= totalPages);
        
        pages.push(...range);
        
        // Sempre mostrar a última página
        if (currentPage < totalPages - delta) {
            // Se não estiver adjacente à última página, mostrar ellipsis
            if (currentPage < totalPages - delta - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        
        return pages;
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        onItemsPerPageChange(newSize);
        // Ajustar a página atual para que os itens não saltem
        const newPage = Math.floor((startItem - 1) / newSize) + 1;
        onPageChange(newPage);
    };

    return (
        <div className={`flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 ${className}`}>
            {/* Informação sobre os itens sendo exibidos */}
            {showItemsInfo && (
                <div className="text-sm text-gray-700 dark:text-gray-400">
                    Mostrando <span className="font-medium">{totalItems > 0 ? startItem : 0}</span> a{" "}
                    <span className="font-medium">{endItem}</span> de{" "}
                    <span className="font-medium">{totalItems}</span> registros
                </div>
            )}

            <div className="flex items-center space-x-4">
                {/* Seletor para items por página */}
                {showPageSizeSelect && (
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="itemsPerPage" value="Itens por página:" />
                        <Select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handlePageSizeChange}
                            className="w-16"
                            sizing="sm"
                        >
                            {pageSizeOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}

                {/* Botões de navegação */}
                <div className="flex items-center">
                    <ButtonGroup>
                        {/* Botão para a primeira página */}
                        <Button
                            color="gray"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            title="Primeira página"
                        >
                            <FiChevronsLeft className="h-5 w-5" />
                        </Button>
                        
                        {/* Botão para a página anterior */}
                        <Button
                            color="gray"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            title="Página anterior"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </Button>
                        
                        {/* Botões para páginas específicas */}
                        {getPageNumbers().map((pageNum, index) => (
                            pageNum === '...' ? (
                                <Button
                                    key={`ellipsis-${index}`}
                                    color="gray"
                                    disabled
                                >
                                    ...
                                </Button>
                            ) : (
                                <Button
                                    key={pageNum}
                                    color={currentPage === pageNum ? "blue" : "gray"}
                                    onClick={() => onPageChange(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        ))}
                        
                        {/* Botão para a próxima página */}
                        <Button
                            color="gray"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            title="Próxima página"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </Button>
                        
                        {/* Botão para a última página */}
                        <Button
                            color="gray"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            title="Última página"
                        >
                            <FiChevronsRight className="h-5 w-5" />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export default TablePagination;