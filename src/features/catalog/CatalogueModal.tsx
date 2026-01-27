import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import type { Kit } from '../../types';
import { KitCard } from './KitCard';
import { useTranslation } from 'react-i18next';

interface CatalogueModalProps {
    isOpen: boolean;
    onClose: () => void;
    kits: Kit[];
    onViewDetails: (kit: Kit) => void;
}

export function CatalogueModal({ isOpen, onClose, kits, onViewDetails }: CatalogueModalProps) {
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                            {filteredKits.map(kit => (
                                                <div key={kit.id} className="h-[380px]">
                                                    <KitCard
                                                        kit={kit}
                                                        onViewDetails={() => onViewDetails(kit)}
                                                    />
                                                </div>
                                            ))}
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
