import { LucideZap } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { Kit } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface KitCardProps {
    kit: Kit;
}

export function KitCard({ kit }: KitCardProps) {
    return (
        <Card variant="interactive" className="h-full flex flex-col group relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <Badge variant={kit.type === 'hybrid' ? 'success' : 'default'}>
                        {kit.type.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-slate-400 text-sm">
                        <LucideZap className="w-4 h-4 mr-1 text-primary" />
                        {kit.total_power} kW
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6 flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {kit.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                        {kit.description}
                    </p>
                </div>

                {/* Image Placeholder */}
                <div className="w-full h-32 bg-slate-800/50 rounded-xl mb-6 flex items-center justify-center border border-white/5">
                    {/* Ideally uses kit.image_url */}
                    <LucideZap className="w-10 h-10 text-slate-600" />
                </div>

                {/* Footer / Price */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold text-white">
                            {formatCurrency(kit.monthly_finance_cost)}
                        </span>
                        <span className="text-sm text-slate-400">/mo</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-4">
                        or {formatCurrency(kit.price)} cash
                    </div>

                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-secondary group-hover:border-primary transition-all">
                        View Details
                    </Button>
                </div>
            </div>
        </Card>
    );
}
