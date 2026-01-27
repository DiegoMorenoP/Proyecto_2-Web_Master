import { useEffect, useState } from 'react';
import { KitCard } from './KitCard';
import { BentoGrid, BentoItem } from '../../components/layout/BentoGrid';
import type { Kit } from '../../types';
import { CatalogService } from './CatalogService';
import { Loader2, ArrowRight } from 'lucide-react';
import { CatalogueModal } from './CatalogueModal';
import { Badge } from '../../components/common/Badge';
import { useTranslation } from 'react-i18next';
import { ProductDetailModal } from '../../components/products/ProductDetailModal';
import { useCart } from '../../context/CartContext';

export function CatalogSection() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
                <BentoGrid>
                    {kits.map(kit => (
                        <BentoItem key={kit.id}>
                            <KitCard
                                kit={kit}
                                onViewDetails={() => setSelectedProduct(kit)}
                            />
                        </BentoItem>
                    ))}
                </BentoGrid>
            )}

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
