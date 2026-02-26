import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ArrowUpDown, Maximize2, Minimize2 } from 'lucide-react';
import type { Kit } from '../../types';
import { KitCard } from './KitCard';
import { useTranslation } from 'react-i18next';
import { ProductDetailInline } from './ProductDetailInline';
import { useCart } from '../../context/CartContext';
import { b2bCategories } from '../../config/navigation';

interface CatalogueModalProps {
    isOpen: boolean;
    onClose: () => void;
    kits: Kit[];
    onViewDetails: (kit: Kit) => void;
    initialExpandedId?: string | null;
}

export function CatalogueModal({ isOpen, onClose, kits, initialExpandedId }: CatalogueModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMaximized, setIsMaximized] = useState(false);
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get initial category from URL or default to 'all'
    const urlCategory = searchParams.get('category') || 'all';
    const [selectedType, setSelectedType] = useState<string>(urlCategory);
    const urlSubcategory = searchParams.get('sub') || 'all';
    const [selectedSubtype, setSelectedSubtype] = useState<string>(urlSubcategory);
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'power_stats'>('power_stats');

    // Sync with URL when opened
    useEffect(() => {
        if (isOpen) {
            setSelectedType(searchParams.get('category') || 'all');
            setSelectedSubtype(searchParams.get('sub') || 'all');
        }
    }, [isOpen, searchParams]);

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
    // Filter and Sort Logic
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);

    const filteredKits = useMemo(() => {
        let result = [...kits];

        // 1. Text Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(k =>
                k.name.toLowerCase().includes(lower) ||
                (k.description || '').toLowerCase().includes(lower)
            );
        }

        // 2. Type/Category Filter
        if (selectedType !== 'all') {
            result = result.filter(k => k.category_slug === selectedType || k.type === selectedType);
        }

        // 2.5 Subcategory Filter
        if (selectedSubtype !== 'all') {
            result = result.filter(k => k.subcategory_slug === selectedSubtype);
        }

        // 3. Stock Filter
        if (showOnlyInStock) {
            result = result.filter(k => k.stock_status !== 'out_of_stock');
        }

        // 4. Sorting
        result.sort((a, b) => {
            if (sortOrder === 'price_asc') return a.price - b.price;
            if (sortOrder === 'price_desc') return b.price - a.price;
            if (sortOrder === 'power_stats') return (b.total_power || 0) - (a.total_power || 0);
            return 0;
        });

        return result;
    }, [kits, searchTerm, selectedType, selectedSubtype, sortOrder, showOnlyInStock]);

    // Expansion Logic
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const { addItem } = useCart();

    useEffect(() => {
        if (!isOpen) {
            setExpandedProductId(null);
        } else if (initialExpandedId) {
            setExpandedProductId(initialExpandedId);
        }
    }, [isOpen, initialExpandedId]);

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
            if (isMaximized) {
                // When maximized, we want a wider layout (up to 5 columns on large screens)
                if (window.matchMedia('(min-width: 1280px)').matches) {
                    setModalColumns(5); // xl forces 5
                } else if (window.matchMedia('(min-width: 1024px)').matches) {
                    setModalColumns(4); // lg forces 4
                } else if (window.matchMedia('(min-width: 640px)').matches) {
                    setModalColumns(2); // sm forces 2
                } else {
                    setModalColumns(1);
                }
            } else {
                // Normal modal width (max-w-6xl)
                if (window.matchMedia('(min-width: 1280px)').matches) {
                    setModalColumns(4); // xl
                } else if (window.matchMedia('(min-width: 1024px)').matches) {
                    setModalColumns(3); // lg
                } else if (window.matchMedia('(min-width: 640px)').matches) {
                    setModalColumns(2); // sm
                } else {
                    setModalColumns(1);
                }
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, [isMaximized]);

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

            // Logic for visual height and 'compact' property passed to KitCard
            // 1. If in maximized mode AND it's the expanded row -> Very Compact (110px), compact style
            // 2. If in maximized mode (but not expanded row) -> Medium height (250px), NORMAL style (hover effects)
            // 3. If in normal modal AND it's the expanded row -> Compact (250px), compact style
            // 4. Default normal modal -> Normal (500px), normal style

            let cardHeightClass = "min-h-[500px]";
            let cardHeightValue: number | 'auto' = 'auto';
            let isKitCardCompact = false;

            if (isMaximized) {
                isKitCardCompact = true; // Compact visual style in maximized mode
                if (isCompactRow) {
                    cardHeightClass = "h-[110px]";
                    cardHeightValue = 110;
                } else {
                    cardHeightClass = "h-[250px]";
                    cardHeightValue = 250;
                }
            } else {
                if (isCompactRow) {
                    isKitCardCompact = true;
                    cardHeightClass = "h-[250px]";
                    cardHeightValue = 250;
                } else {
                    isKitCardCompact = false;
                    cardHeightClass = "min-h-[500px]";
                    cardHeightValue = 'auto';
                }
            }

            items.push(
                <motion.div
                    key={kit.id}
                    id={`item-container-${kit.id}`}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        height: cardHeightValue
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cardHeightClass}
                >
                    <KitCard
                        kit={kit}
                        compact={isKitCardCompact}
                        onViewDetails={() => setExpandedProductId(expandedProductId === kit.id ? null : kit.id)}
                    />
                </motion.div>
            );

            const isEndOfRow = i === insertIndex;
            const isLastItem = i === filteredKits.length - 1;

            if (expandedIndex !== -1 && (isEndOfRow || (isLastItem && i < insertIndex))) {
                const expandedKit = filteredKits[expandedIndex];

                // Set column span dynamically based on layout
                let colSpanClass = "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4";
                if (isMaximized) {
                    colSpanClass = "col-span-1 sm:col-span-2 lg:col-span-4 xl:col-span-5";
                }

                items.push(
                    <div key={`details-${expandedKit.id}`} className={`${colSpanClass} w-full`}>
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
        { id: 'kits-solares', label: 'Kits Solares' },
        { id: 'paneles-solares', label: 'Paneles' },
        { id: 'inversores', label: 'Inversores' },
        { id: 'baterias-solares', label: 'Baterías' },
        { id: 'accesorios', label: 'Accesorios' },
        { id: 'reguladores', label: 'Reguladores' }
    ];

    const handleTabChange = (tabId: string) => {
        setSelectedType(tabId);
        setSelectedSubtype('all'); // Reset subcategory when changing main category
        if (tabId === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', tabId);
        }
        searchParams.delete('sub'); // Clear subcategory in URL
        setSearchParams(searchParams);
    };

    const handleSubTabChange = (subId: string) => {
        setSelectedSubtype(subId);
        if (subId === 'all') {
            searchParams.delete('sub');
        } else {
            searchParams.set('sub', subId);
        }
        setSearchParams(searchParams);
    };

    // Find current active category's subcategories
    const activeCategoryConfig = b2bCategories.find(c => {
        // match by href ending
        return c.href.includes(`catalog=${selectedType}`) || c.href.includes(`category=${selectedType}`);
    });

    const activeSubcategories = activeCategoryConfig?.items.map(item => {
        // extract the 'sub' value from href, or roughly convert name to slug
        const subMatch = item.href.match(/sub=([^&]+)/);
        return {
            id: subMatch ? subMatch[1] : item.name.toLowerCase().replace(/ /g, '-'),
            label: item.name
        };
    }).filter(sub => !sub.id.includes('calculadora')) || [];

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
                    <div
                        className="fixed inset-0 z-[10000] overflow-y-auto"
                        onClick={onClose}
                    >
                        <div className="flex min-h-screen items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`relative w-full bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMaximized ? 'max-w-[100vw] h-screen rounded-none' : 'max-w-6xl max-h-[90vh] rounded-3xl'
                                    }`}
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl flex flex-col gap-4 z-20 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{t('catalog.modal.title')}</h2>
                                            <p className="text-slate-400 text-sm">{t('catalog.modal.subtitle')}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setIsMaximized(!isMaximized)}
                                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                                title={isMaximized ? "Restaurar" : "Maximizar"}
                                            >
                                                {isMaximized ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filters & Sorting First Row */}
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center z-10">
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
                                            {/* Stock Filter Toggle */}
                                            <button
                                                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showOnlyInStock
                                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${showOnlyInStock ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                                En Stock
                                            </button>

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

                                    {/* Categories & Subcategories Second Row */}
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 w-max">
                                            {tabs.map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => handleTabChange(tab.id)}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedType === tab.id
                                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Subcategories Row */}
                                        <AnimatePresence>
                                            {selectedType !== 'all' && activeSubcategories.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: -8 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: -8 }}
                                                    className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-xl border border-white/5 w-max ml-1"
                                                >
                                                    <button
                                                        onClick={() => handleSubTabChange('all')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedSubtype === 'all'
                                                            ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                            }`}
                                                    >
                                                        Todas
                                                    </button>
                                                    {activeSubcategories.map(sub => (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => handleSubTabChange(sub.id)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedSubtype === sub.id
                                                                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                                }`}
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-zinc-950/50">
                                    {filteredKits.length > 0 ? (
                                        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMaximized ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6 pb-20 auto-rows-auto`}>
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
