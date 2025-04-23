import React from "react";
import useAuth from '../../auth/hooks/useAuth';
import useRemessas from '../hooks/useRemessas';
import RemessaTable from '../components/RemessaTable';
import Loader from '../components/Loader';
import DateFilter from '../components/DateFilter';
import { Alert } from 'flowbite-react';
import { FiInfo, FiAlertCircle } from 'react-icons/fi';

const Listar = () => {
    const auth = useAuth();
    const { user } = auth;
    const { profile } = user || {};
    
    const { 
        remessas, 
        loading, 
        error, 
        dateFilter, 
        setDateFilter, 
        filterMode, 
        setFilterMode, 
        refresh 
    } = useRemessas();

    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-start mb-6">
                <DateFilter
                    dateFilter={dateFilter} 
                    setDateFilter={setDateFilter}
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    onRefresh={refresh}
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
                    <RemessaTable 
                        remessas={remessas} 
                        loading={loading} 
                    />
                )}
            </div>
        </div>
    );
};

export default Listar;