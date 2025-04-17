import { useContext } from 'react';
import LayoutContext from '../../../app/contexts/layout/LayoutContext';

export default function useLayout() {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout deve ser usado dentro de um <LayoutProvider>');
    }

    return context;
}
