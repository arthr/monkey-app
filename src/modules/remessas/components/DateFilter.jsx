import React, { useState } from 'react';
import { Button, Card, Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';

const DateFilter = ({ onFilterChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterMode, setFilterMode] = useState('today');

    const handleApplyFilter = () => {
        const dateFilter = {
            start: startDate || null,
            end: endDate || null
        };
        onFilterChange(dateFilter, 'custom');
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setFilterMode('today');
        onFilterChange({ start: null, end: null }, 'today');
    };

    const handleToggle = (checked) => {
        const newMode = checked ? 'custom' : 'today';
        setFilterMode(newMode);
        if (!checked) {
            setStartDate('');
            setEndDate('');
            onFilterChange({ start: null, end: null }, 'today');
        }
    };

    const handleRefresh = () => {
        const dateFilter = filterMode === 'custom' 
            ? { start: startDate || null, end: endDate || null }
            : { start: null, end: null };
        onFilterChange(dateFilter, filterMode);
    };

    return (
        <Card className="mb-4 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center">
                    <ToggleSwitch
                        checked={filterMode === 'custom'}
                        label="Habilitar filtro"
                        onChange={handleToggle}
                        sizing='sm'
                    />
                </div>

                <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto ${filterMode !== 'custom' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="w-full md:w-auto">
                        <div className="mb-2 block">
                            <Label htmlFor="startDate" value="Data Inicial" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiCalendar className="text-gray-500" />
                            </div>
                            <TextInput
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="pl-10"
                                disabled={filterMode !== 'custom'}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="mb-2 block">
                            <Label htmlFor="endDate" value="Data Final" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiCalendar className="text-gray-500" />
                            </div>
                            <TextInput
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="pl-10"
                                disabled={filterMode !== 'custom'}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 items-end">
                        <Button 
                            color="primary" 
                            onClick={handleApplyFilter}
                            disabled={filterMode !== 'custom'}
                        >
                            Aplicar Filtro
                        </Button>
                        <Button 
                            color="light"
                            onClick={handleReset}
                            disabled={filterMode !== 'custom'}
                        >
                            Limpar
                        </Button>
                    </div>
                </div>
                
                <Button 
                    color="gray"
                    onClick={handleRefresh}
                    className="md:self-end"
                >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    Atualizar
                </Button>
            </div>
        </Card>
    );
};

export default DateFilter;