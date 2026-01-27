import { useEffect, useState } from 'react';
import { KitCard } from './KitCard';
import { BentoGrid } from '../../components/layout/BentoGrid';
import type { Kit } from '../../types';
import { CatalogService } from './CatalogService';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatalogueModal } from './CatalogueModal';
import { Badge } from '../../components/common/Badge';
import { useTranslation } from 'react-i18next';
import { ProductDetailModal } from '../../components/products/ProductDetailModal';
import { useCart } from '../../context/CartContext';

export function CatalogSection() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3); // Start with 3 items
    const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Kit | null>(null);

    const { t } = useTranslation();
    const { addItem } = useCart();

    useEffect(() => {
        async function loadKits() {
            try {
                const data = await CatalogService.getKits();
                setKits(data);
            } finally {
                setIsLoading(false);
            }
        }
        loadKits();
    }, []);

    // ... (skipping duplicate useEffect) ...

    return (
        <section className="py-20">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] tracking-wider font-bold px-2 py-1">
                            {t('catalog.badge')}
                        </Badge>
                    </div>
                    <h2 className="text-4xl font-bold mb-3 text-white">{t('catalog.title')}</h2>
                    <p className="text-slate-400 max-w-xl text-lg">
                        {t('catalog.description')}
                    </p>
                </div>

                <button
                    onClick={() => setIsCatalogueOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-yellow-500/50 text-yellow-500 font-medium hover:bg-yellow-500/10 transition-all group shrink-0"
                >
                    <span>{t('catalog.viewAll')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
                    <AnimatePresence mode="popLayout">
                        {kits.filter(k => (k.stock ?? 0) > 0).slice(0, visibleCount).map((kit) => (
                            <motion.div
                                key={kit.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[520px] w-full"
                            >
                                <KitCard
                                    kit={kit}
                                    onViewDetails={() => setSelectedProduct(kit)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </BentoGrid>
            )}

            <div className="mt-12 flex justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                        onClick={() => {
                            if (visibleCount < 9) {
                                setVisibleCount(prev => prev + 3);
                            } else {
                                setIsCatalogueOpen(true);
                            }
                        }}
                        className="relative overflow-hidden flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-white font-bold tracking-wide hover:from-primary hover:to-primary/80 hover:text-secondary transition-all group shadow-[0_0_20px_rgba(255,183,1,0.1)] hover:shadow-[0_0_30px_rgba(255,183,1,0.4)]"
                    >
                        <span className="relative z-10 uppercase text-sm">
                            {visibleCount < 9 ? t('catalog.showMore') : t('catalog.viewAll')}
                        </span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            <CatalogueModal
                isOpen={isCatalogueOpen}
                onClose={() => setIsCatalogueOpen(false)}
                kits={kits}
                onViewDetails={setSelectedProduct}
            />

            <ProductDetailModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                onAddToCart={addItem}
            />
        </section>
    );
}
