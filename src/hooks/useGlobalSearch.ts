import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Kit } from '../types';
import { CatalogService } from '../features/catalog/CatalogService';
import { b2bCategories } from '../config/navigation';
import type { LucideIcon } from 'lucide-react';
import {
    Sun, Battery, Settings, Wrench, PenTool, Zap,
    Calculator, Map, ShoppingCart, Home
} from 'lucide-react';

// ── Result types ──────────────────────────────────────────────

export interface SearchResultProduct {
    type: 'product';
    id: string;
    name: string;
    price: number;
    image_url: string;
    categorySlug?: string;
    subcategorySlug?: string;
    stockStatus?: string;
}

export interface SearchResultCategory {
    type: 'category';
    id: string;
    name: string;
    href: string;
    icon: LucideIcon;
    subcategories: string[];
}

export interface SearchResultPage {
    type: 'page';
    id: string;
    name: string;
    description: string;
    href: string;
    icon: LucideIcon;
}

export type SearchResult = SearchResultProduct | SearchResultCategory | SearchResultPage;

export interface GroupedResults {
    products: SearchResultProduct[];
    categories: SearchResultCategory[];
    pages: SearchResultPage[];
    total: number;
}

// ── Static pages ──────────────────────────────────────────────

const STATIC_PAGES: SearchResultPage[] = [
    {
        type: 'page',
        id: 'page-home',
        name: 'Inicio',
        description: 'Página principal',
        href: '/',
        icon: Home,
    },
    {
        type: 'page',
        id: 'page-calculator',
        name: 'Simulador Solar',
        description: 'Calcula tu ahorro fotovoltaico',
        href: '/#calculator',
        icon: Calculator,
    },
    {
        type: 'page',
        id: 'page-dsm',
        name: 'Mapa 3D Solar',
        description: 'Mapeo solar con tecnología DSM',
        href: '/#dsm',
        icon: Map,
    },
    {
        type: 'page',
        id: 'page-cart',
        name: 'Carrito',
        description: 'Tu cesta de compra',
        href: '/cart',
        icon: ShoppingCart,
    },
];

// ── Category icon mapping ─────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
    'Kits Solares': Sun,
    'Paneles Solares': Zap,
    'Inversores': Wrench,
    'Baterías': Battery,
    'Accesorios': Settings,
    'Reguladores': PenTool,
};

// ── Hook ──────────────────────────────────────────────────────

const MAX_PRODUCT_RESULTS = 6;
const MAX_CATEGORY_RESULTS = 4;
const MAX_PAGE_RESULTS = 4;
const DEBOUNCE_MS = 200;

export const useGlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [catalog, setCatalog] = useState<Kit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [catalogLoaded, setCatalogLoaded] = useState(false);

    // Debounce input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    // Lazy-load catalog on first open
    const loadCatalog = useCallback(async () => {
        if (catalogLoaded) return;
        setIsLoading(true);
        try {
            const data = await CatalogService.getAllCatalog();
            setCatalog(data);
            setCatalogLoaded(true);
        } finally {
            setIsLoading(false);
        }
    }, [catalogLoaded]);

    // Search logic
    const results: GroupedResults = useMemo(() => {
        const term = debouncedQuery.trim().toLowerCase();

        if (!term) {
            return { products: [], categories: [], pages: [], total: 0 };
        }

        // ── Products ────────────────────────
        const matchedProducts: SearchResultProduct[] = catalog
            .filter(kit =>
                kit.name.toLowerCase().includes(term) ||
                (kit.description || '').toLowerCase().includes(term) ||
                (kit.category_slug || '').toLowerCase().includes(term) ||
                (kit.subcategory_slug || '').toLowerCase().includes(term)
            )
            .slice(0, MAX_PRODUCT_RESULTS)
            .map(kit => ({
                type: 'product' as const,
                id: kit.id,
                name: kit.name,
                price: kit.price,
                image_url: kit.image_url,
                categorySlug: kit.category_slug,
                subcategorySlug: kit.subcategory_slug,
                stockStatus: kit.stock_status,
            }));

        // ── Categories ──────────────────────
        const matchedCategories: SearchResultCategory[] = b2bCategories
            .filter(cat =>
                cat.title.toLowerCase().includes(term) ||
                cat.items.some(item => item.name.toLowerCase().includes(term))
            )
            .slice(0, MAX_CATEGORY_RESULTS)
            .map(cat => ({
                type: 'category' as const,
                id: `cat-${cat.title}`,
                name: cat.title,
                href: cat.href,
                icon: CATEGORY_ICON_MAP[cat.title] || Sun,
                subcategories: cat.items
                    .filter(item => item.name.toLowerCase().includes(term) || cat.title.toLowerCase().includes(term))
                    .map(item => item.name),
            }));

        // ── Pages ───────────────────────────
        const matchedPages: SearchResultPage[] = STATIC_PAGES
            .filter(page =>
                page.name.toLowerCase().includes(term) ||
                page.description.toLowerCase().includes(term)
            )
            .slice(0, MAX_PAGE_RESULTS);

        const total = matchedProducts.length + matchedCategories.length + matchedPages.length;

        return { products: matchedProducts, categories: matchedCategories, pages: matchedPages, total };
    }, [debouncedQuery, catalog]);

    const reset = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
    }, []);

    return {
        query,
        setQuery,
        results,
        isLoading,
        catalogLoaded,
        loadCatalog,
        reset,
    };
};
