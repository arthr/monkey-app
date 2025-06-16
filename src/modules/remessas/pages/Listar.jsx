import React, { useEffect } from "react";
// import useAuth from '../../auth/hooks/useAuth';
import { RemessasProvider } from '../contexts';
import { useRemessaData } from '../hooks/useRemessaData';
import RemessaTable from '../components/RemessaTable';
import Loader from '../components/Loader';
import DateFilter from '../components/DateFilter';
import { Alert } from 'flowbite-react';
import { FiInfo, FiAlertCircle, FiDatabase } from 'react-icons/fi';

const ListarContent = () => {
    const { remessas, loading, error, fetchTodayRemessas, refreshRemessas } = useRemessaData();

    useEffect(() => {
        fetchTodayRemessas();
    }, [fetchTodayRemessas]);

    const handleDateFilterChange = (dateFilter, filterMode) => {
        if (filterMode === 'today') {
            fetchTodayRemessas();
        } else {
            refreshRemessas(dateFilter);
        }
    };

    return (
        <div className="p-6 mx-auto">
            <div className="flex flex-col items-start mb-6">
                {/* Cabeçalho da página */}
                <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <FiDatabase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Remessas
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Lista de remessas recepcionadas.
                    </p>
                </div>

                <DateFilter
                    onFilterChange={handleDateFilterChange}
                />

                {error && (
                    <Alert color="failure" icon={FiAlertCircle} className="mb-4 w-full">
                        <span className="font-medium">Erro!</span> {error}
                    </Alert>
                )}

                {!loading && remessas.length === 0 && (
                    <Alert color="info" icon={FiInfo} className="mb-4 w-full">
                        <span className="font-medium">Informação:</span> Não existem remessas disponíveis para o período selecionado.
                    </Alert>
                )}

                {loading ? (
                    <Loader />
                ) : (
                    <RemessaTable />
                )}
            </div>
        </div>
    );
};

const Listar = () => {
    return (
        <RemessasProvider>
            <ListarContent />
        </RemessasProvider>
    );
};

export default Listar;