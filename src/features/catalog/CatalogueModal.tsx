import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import type { Kit } from '../../types';
import { KitCard } from './KitCard';
import { useTranslation } from 'react-i18next';
import { ProductDetailInline } from './ProductDetailInline';
import { useCart } from '../../context/CartContext';

interface CatalogueModalProps {
    isOpen: boolean;
    onClose: () => void;
    kits: Kit[];
    onViewDetails: (kit: Kit) => void;
}

export function CatalogueModal({ isOpen, onClose, kits }: CatalogueModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'power_stats'>('power_stats');
    const { t } = useTranslation();

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Filter and Sort Logic
    const filteredKits = useMemo(() => {
        let result = [...kits];

        // 1. Text Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(k =>
                k.name.toLowerCase().includes(lower) ||
                k.description.toLowerCase().includes(lower)
            );
        }

        // 2. Type Filter
        if (selectedType !== 'all') {
            result = result.filter(k => k.type === selectedType);
        }

        // 3. Sorting
        result.sort((a, b) => {
            if (sortOrder === 'price_asc') return a.price - b.price;
            if (sortOrder === 'price_desc') return b.price - a.price;
            if (sortOrder === 'power_stats') return b.total_power - a.total_power;
            return 0;
        });

        return result;
    }, [kits, searchTerm, selectedType, sortOrder]);

    // Expansion Logic
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const { addItem } = useCart();

    useEffect(() => {
        if (!isOpen) {
            setExpandedProductId(null);
        }
    }, [isOpen]);

    // Adjust columns based on modal grid layout (1 sm, 2 lg, 3 xl, 4 2xl?? No the grid is: sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
    // We need a specific useColumns for the modal because the breakpoints might differ or relative width matters?
    // Actually the standard useColumns logic is simplistic (1, 2, 3). Let's use a local logic or just accept it might be slightly off if sticky.
    // However, the modal is simpler:
    // grid-cols-1 (mobile)
    // sm:grid-cols-2
    // lg:grid-cols-3
    // xl:grid-cols-4

    // We need to know the CURRENT number of columns in the grid to calculate the row injection.
    // Let's create a custom hook or logic here.
    const [modalColumns, setModalColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            if (window.matchMedia('(min-width: 1280px)').matches) {
                setModalColumns(4); // xl
            } else if (window.matchMedia('(min-width: 1024px)').matches) {
                setModalColumns(3); // lg
            } else if (window.matchMedia('(min-width: 640px)').matches) {
                setModalColumns(2); // sm
            } else {
                setModalColumns(1);
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Scroll to expanded item
    useEffect(() => {
        if (expandedProductId) {
            // Small delay to allow layout to shift
            setTimeout(() => {
                const element = document.getElementById(`item-container-${expandedProductId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
        }
    }, [expandedProductId]);

    const renderGridWithExpansion = () => {
        const items = [];
        const expandedIndex = filteredKits.findIndex(k => k.id === expandedProductId);

        let insertIndex = -1;
        let expandedRowNumber = -1;

        if (expandedIndex !== -1) {
            expandedRowNumber = Math.floor(expandedIndex / modalColumns);
            insertIndex = (expandedRowNumber + 1) * modalColumns - 1;
        }

        for (let i = 0; i < filteredKits.length; i++) {
            const kit = filteredKits[i];
            const currentRow = Math.floor(i / modalColumns);
            const isCompactRow = currentRow === expandedRowNumber;

            items.push(
                <motion.div
                    key={kit.id}
                    id={`item-container-${kit.id}`}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        // If it's the row of the expanded item, compact it to semi-height
                        height: isCompactRow ? 250 : 'auto'
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className={isCompactRow ? "h-[250px]" : "min-h-[500px]"}
                >
                    <KitCard
                        kit={kit}
                        compact={isCompactRow}
                        onViewDetails={() => setExpandedProductId(expandedProductId === kit.id ? null : kit.id)}
                    />
                </motion.div>
            );

            const isEndOfRow = i === insertIndex;
            const isLastItem = i === filteredKits.length - 1;

            if (expandedIndex !== -1 && (isEndOfRow || (isLastItem && i < insertIndex))) {
                const expandedKit = filteredKits[expandedIndex];
                items.push(
                    <div key={`details-${expandedKit.id}`} className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 w-full">
                        <ProductDetailInline
                            product={expandedKit}
                            onClose={() => setExpandedProductId(null)}
                            onAddToCart={(p) => {
                                addItem(p);
                                setExpandedProductId(null);
                            }}
                        />
                    </div>
                );
                insertIndex = -2;
            }
        }
        return items;
    };

    const tabs = [
        { id: 'all', label: t('catalog.tabs.all') },
        { id: 'grid', label: t('catalog.tabs.grid') },
        { id: 'hybrid', label: t('catalog.tabs.hybrid') },
        { id: 'isolated', label: t('catalog.tabs.isolated') }
    ];

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Wrapper */}
                    <div className="fixed inset-0 z-[10000] overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl flex flex-col gap-4 z-20 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{t('catalog.modal.title')}</h2>
                                            <p className="text-slate-400 text-sm">{t('catalog.modal.subtitle')}</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Controls Bar */}
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                        <div className="relative w-full md:w-96 group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                placeholder={t('catalog.modal.searchPlaceholder')}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-600"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                                                {tabs.map(tab => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setSelectedType(tab.id)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedType === tab.id
                                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative group/sort">
                                                <select
                                                    value={sortOrder}
                                                    onChange={(e) => setSortOrder(e.target.value as any)}
                                                    className="appearance-none bg-black/40 border border-white/10 text-slate-300 text-xs font-medium rounded-xl py-2 pl-4 pr-8 hover:border-white/20 focus:outline-none focus:border-primary/50 cursor-pointer h-[38px]"
                                                >
                                                    <option value="power_stats">{t('catalog.sort.powerStats')}</option>
                                                    <option value="price_asc">{t('catalog.sort.priceAsc')}</option>
                                                    <option value="price_desc">{t('catalog.sort.priceDesc')}</option>
                                                </select>
                                                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-zinc-950/50">
                                    {filteredKits.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 auto-rows-auto">
                                            <AnimatePresence mode="popLayout" initial={false}>
                                                {renderGridWithExpansion()}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 min-h-[400px]">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <Filter className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p>{t('catalog.modal.noResults')}</p>
                                            <button
                                                onClick={() => { setSearchTerm(''); setSelectedType('all'); }}
                                                className="text-primary hover:underline text-sm"
                                            >
                                                {t('catalog.modal.clearFilters')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
