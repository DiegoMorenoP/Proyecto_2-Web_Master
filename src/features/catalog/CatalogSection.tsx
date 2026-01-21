import { useEffect, useState } from 'react';
import { KitCard } from './KitCard';
import { BentoGrid, BentoItem } from '../../components/layout/BentoGrid';
import type { Kit } from '../../types';
import { CatalogService } from './CatalogService';
import { Loader2 } from 'lucide-react';

export function CatalogSection() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Solar Kits</h2>
                <p className="text-slate-400">Pre-configured systems engineering for maximum efficiency.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <BentoGrid>
                    {kits.map(kit => (
                        <BentoItem key={kit.id}>
                            <KitCard kit={kit} />
                        </BentoItem>
                    ))}
                </BentoGrid>
            )}
        </section>
    );
}
