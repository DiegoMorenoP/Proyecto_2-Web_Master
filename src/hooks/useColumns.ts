import { useState, useEffect } from 'react';

export function useColumns() {
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                setColumns(3); // lg
            } else if (window.matchMedia('(min-width: 768px)').matches) {
                setColumns(2); // md
            } else {
                setColumns(1); // mobile
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    return columns;
}
