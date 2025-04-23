import React from 'react';
import { Spinner } from 'flowbite-react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-64 w-full">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-500">Carregando dados...</p>
        </div>
    );
};

export default Loader;