import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package, FolderOpen, FileText, Loader2, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import type { SearchResultProduct, SearchResultCategory, SearchResultPage, SearchResult } from '../../hooks/useGlobalSearch';
import { cn } from '../../lib/utils';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GlobalSearchModal = ({ isOpen, onClose }: GlobalSearchModalProps) => {
    const { query, setQuery, results, isLoading, loadCatalog, reset } = useGlobalSearch();
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Build flat list of all results for keyboard navigation
    const flatResults: SearchResult[] = [
        ...results.products,
        ...results.categories,
        ...results.pages,
    ];

    // Load catalog when modal opens
    useEffect(() => {
        if (isOpen) {
            loadCatalog();
            requestAnimationFrame(() => inputRef.current?.focus());
        } else {
            reset();
            setActiveIndex(-1);
        }
    }, [isOpen, loadCatalog, reset]);

    // Prevent body scroll
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

    // Navigate to result
    const handleSelect = useCallback((result: SearchResult) => {
        onClose();

        switch (result.type) {
            case 'product': {
                const prod = result as SearchResultProduct;
                const params = new URLSearchParams();
                if (prod.categorySlug) params.set('category', prod.categorySlug);
                params.set('_t', Date.now().toString());
                navigate(`/?${params.toString()}`);
                break;
            }
            case 'category': {
                const cat = result as SearchResultCategory;
                navigate(cat.href);
                break;
            }
            case 'page': {
                const page = result as SearchResultPage;
                if (page.href.startsWith('/#')) {
                    navigate('/');
                    setTimeout(() => {
                        const sectionId = page.href.replace('/#', '');
                        const el = document.getElementById(sectionId);
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    navigate(page.href);
                }
                break;
            }
        }
    }, [navigate, onClose]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : 0));
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : flatResults.length - 1));
            return;
        }

        if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < flatResults.length) {
            e.preventDefault();
            handleSelect(flatResults[activeIndex]);
        }
    }, [activeIndex, flatResults, handleSelect, onClose]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
            activeEl?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(-1);
    }, [query]);

    if (!isOpen) return null;

    let flatIndex = -1;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div
                        className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[70vh]"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={handleKeyDown}
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 mx-3 mt-3 mb-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                <Search className="w-5 h-5 text-slate-500 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('search.placeholder')}
                                    className="flex-1 bg-transparent text-lg text-white placeholder:text-slate-600 focus:outline-none"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    ESC
                                </button>
                            </div>

                            {/* Results */}
                            <div
                                ref={listRef}
                                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            >
                                {/* Loading state */}
                                {isLoading && (
                                    <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm">{t('search.loading')}</span>
                                    </div>
                                )}

                                {/* Empty state */}
                                {!isLoading && !query && (
                                    <div className="px-5 py-10 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center">
                                            <Search className="w-6 h-6 text-primary/60" />
                                        </div>
                                        <p className="text-sm text-slate-500 mb-1">{t('search.emptyTitle')}</p>
                                        <p className="text-xs text-slate-600">{t('search.emptyHint')}</p>
                                    </div>
                                )}

                                {/* No results state */}
                                {!isLoading && query && results.total === 0 && (
                                    <div className="px-5 py-10 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                            <Search className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <p className="text-sm text-slate-400">{t('search.noResults')}</p>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {t('search.noResultsHint')}
                                        </p>
                                    </div>
                                )}

                                {/* Results list */}
                                {!isLoading && results.total > 0 && (
                                    <div className="py-2">
                                        {/* Products */}
                                        {results.products.length > 0 && (
                                            <ResultGroup
                                                label={t('search.groups.products')}
                                                icon={<Package className="w-3.5 h-3.5" />}
                                                count={results.products.length}
                                            >
                                                {results.products.map((product) => {
                                                    flatIndex++;
                                                    const idx = flatIndex;
                                                    return (
                                                        <ProductResultItem
                                                            key={product.id}
                                                            product={product}
                                                            isActive={activeIndex === idx}
                                                            dataIndex={idx}
                                                            onSelect={() => handleSelect(product)}
                                                            onHover={() => setActiveIndex(idx)}
                                                        />
                                                    );
                                                })}
                                            </ResultGroup>
                                        )}

                                        {/* Categories */}
                                        {results.categories.length > 0 && (
                                            <ResultGroup
                                                label={t('search.groups.categories')}
                                                icon={<FolderOpen className="w-3.5 h-3.5" />}
                                                count={results.categories.length}
                                            >
                                                {results.categories.map((category) => {
                                                    flatIndex++;
                                                    const idx = flatIndex;
                                                    return (
                                                        <CategoryResultItem
                                                            key={category.id}
                                                            category={category}
                                                            isActive={activeIndex === idx}
                                                            dataIndex={idx}
                                                            onSelect={() => handleSelect(category)}
                                                            onHover={() => setActiveIndex(idx)}
                                                        />
                                                    );
                                                })}
                                            </ResultGroup>
                                        )}

                                        {/* Pages */}
                                        {results.pages.length > 0 && (
                                            <ResultGroup
                                                label={t('search.groups.pages')}
                                                icon={<FileText className="w-3.5 h-3.5" />}
                                                count={results.pages.length}
                                            >
                                                {results.pages.map((page) => {
                                                    flatIndex++;
                                                    const idx = flatIndex;
                                                    return (
                                                        <PageResultItem
                                                            key={page.id}
                                                            page={page}
                                                            isActive={activeIndex === idx}
                                                            dataIndex={idx}
                                                            onSelect={() => handleSelect(page)}
                                                            onHover={() => setActiveIndex(idx)}
                                                        />
                                                    );
                                                })}
                                            </ResultGroup>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer hints */}
                            {results.total > 0 && (
                                <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-4 text-[11px] text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↑↓</kbd>
                                            {t('search.hints.navigate')}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CornerDownLeft className="w-3 h-3" />
                                            {t('search.hints.select')}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">esc</kbd>
                                            {t('search.hints.close')}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-600">
                                        {results.total} {t('search.hints.resultsCount')}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

// ── Sub-components ────────────────────────────────────────────

interface ResultGroupProps {
    label: string;
    icon: React.ReactNode;
    count: number;
    children: React.ReactNode;
}

const ResultGroup = ({ label, icon, count, children }: ResultGroupProps) => (
    <div className="mb-1">
        <div className="flex items-center gap-2 px-5 py-2">
            <span className="text-slate-600">{icon}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-[10px] text-slate-700 bg-white/5 rounded px-1.5 py-0.5">{count}</span>
        </div>
        <div className="px-2">{children}</div>
    </div>
);

// ── Product Item ──────────────────────────────────────────────

interface ProductResultItemProps {
    product: SearchResultProduct;
    isActive: boolean;
    dataIndex: number;
    onSelect: () => void;
    onHover: () => void;
}

const ProductResultItem = ({ product, isActive, dataIndex, onSelect, onHover }: ProductResultItemProps) => (
    <button
        data-index={dataIndex}
        onClick={onSelect}
        onMouseEnter={onHover}
        className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
            isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
        )}
    >
        <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
            isActive ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-slate-500"
        )}>
            <Package className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-medium truncate", isActive ? "text-white" : "text-slate-300")}>
                {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-primary font-semibold">
                    {product.price.toLocaleString('es-ES')}€
                </span>
                {product.stockStatus === 'out_of_stock' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/10 font-medium">
                        Agotado
                    </span>
                )}
                {product.stockStatus === 'low_stock' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 font-medium">
                        Pocas unidades
                    </span>
                )}
            </div>
        </div>
        <ArrowRight className={cn(
            "w-4 h-4 shrink-0 transition-all",
            isActive ? "text-primary translate-x-0 opacity-100" : "text-slate-600 -translate-x-1 opacity-0 group-hover:opacity-50 group-hover:translate-x-0"
        )} />
    </button>
);

// ── Category Item ─────────────────────────────────────────────

interface CategoryResultItemProps {
    category: SearchResultCategory;
    isActive: boolean;
    dataIndex: number;
    onSelect: () => void;
    onHover: () => void;
}

const CategoryResultItem = ({ category, isActive, dataIndex, onSelect, onHover }: CategoryResultItemProps) => {
    const Icon = category.icon;
    return (
        <button
            data-index={dataIndex}
            onClick={onSelect}
            onMouseEnter={onHover}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                isActive ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-slate-500"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-300")}>
                    {category.name}
                </p>
                {category.subcategories.length > 0 && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {category.subcategories.slice(0, 3).join(' · ')}
                        {category.subcategories.length > 3 && ` +${category.subcategories.length - 3}`}
                    </p>
                )}
            </div>
            <ArrowRight className={cn(
                "w-4 h-4 shrink-0 transition-all",
                isActive ? "text-primary translate-x-0 opacity-100" : "text-slate-600 -translate-x-1 opacity-0 group-hover:opacity-50 group-hover:translate-x-0"
            )} />
        </button>
    );
};

// ── Page Item ─────────────────────────────────────────────────

interface PageResultItemProps {
    page: SearchResultPage;
    isActive: boolean;
    dataIndex: number;
    onSelect: () => void;
    onHover: () => void;
}

const PageResultItem = ({ page, isActive, dataIndex, onSelect, onHover }: PageResultItemProps) => {
    const Icon = page.icon;
    return (
        <button
            data-index={dataIndex}
            onClick={onSelect}
            onMouseEnter={onHover}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                isActive ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-slate-500"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-300")}>
                    {page.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{page.description}</p>
            </div>
            <ArrowRight className={cn(
                "w-4 h-4 shrink-0 transition-all",
                isActive ? "text-primary translate-x-0 opacity-100" : "text-slate-600 -translate-x-1 opacity-0 group-hover:opacity-50 group-hover:translate-x-0"
            )} />
        </button>
    );
};
