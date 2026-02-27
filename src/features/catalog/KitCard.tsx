import { LucideZap } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { Kit } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'framer-motion';

interface KitCardProps {
    kit: Kit;
    compact?: boolean;
    onViewDetails?: () => void;
}

export function KitCard({ kit, onViewDetails, compact = false }: KitCardProps) {
    const [imgError, setImgError] = useState(false);
    const isOutOfStock = kit.stock_status === 'out_of_stock' || (kit.stock !== undefined && kit.stock <= 0);

    return (
        <Card
            variant="interactive"
            layout
            className={`h-full flex flex-col group relative overflow-hidden cursor-pointer border-0 shadow-2xl transition-all duration-700 ease-in-out ${compact ? 'rounded-3xl' : 'rounded-[2rem]'}`}
            onClick={onViewDetails}
        >
            {/* Full Height Background Image */}
            <div className="absolute inset-0 z-0">
                {(kit.image_url && kit.image_url !== '' && !imgError) ? (
                    <motion.img
                        layout
                        src={kit.image_url}
                        alt={kit.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${compact ? 'group-hover:scale-105' : 'group-hover:scale-110'} ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                        {/* Fallback pattern */}
                        <img
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                            alt="Solar Pattern"
                            className={`w-full h-full object-cover opacity-50 transition-transform duration-1000 ease-in-out ${compact ? 'scale-100' : 'group-hover:scale-110'} ${isOutOfStock ? 'grayscale' : ''}`}
                        />
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
                    </div>
                )}
                {/* Refined Gradient: lighter at top, darker at bottom for text */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${compact ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'}`} />
            </div>

            {/* Content */}
            <motion.div layout className={`relative z-10 flex flex-col h-full ${compact ? 'p-4' : 'p-6'}`}>
                {/* Floating Badge */}
                {!compact && (
                    <div className="flex justify-between items-start">
                        <Badge variant={kit.type === 'hybrid' ? 'success' : 'default'} className="backdrop-blur-xl bg-white/10 border-white/20 text-white px-4 py-1.5 text-xs font-bold tracking-wider shadow-lg">
                            {kit.type.toUpperCase()}
                        </Badge>
                        {/* Stock Status Badge */}
                        {isOutOfStock && (
                            <Badge variant="destructive" className="backdrop-blur-xl bg-red-500/20 border-red-500/50 text-red-500 px-3 py-1 text-[10px] font-bold tracking-wider shadow-lg">
                                AGOTADO
                            </Badge>
                        )}
                        {(kit.stock_status === 'low_stock' || (kit.stock !== undefined && kit.stock <= 5 && kit.stock > 0)) && (
                            <Badge variant="warning" className="backdrop-blur-xl bg-yellow-500/20 border-yellow-500/50 text-yellow-500 px-3 py-1 text-[10px] font-bold tracking-wider shadow-lg">
                                POCAS UNIDADES
                            </Badge>
                        )}
                    </div>
                )}

                {/* Vertical Spacer */}
                <div className="flex-1" />

                {/* Bottom Info Panel */}
                <motion.div layout className={`transform transition-transform duration-700 ease-in-out ${compact ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
                    {/* Power Spec - full mode */}
                    {!compact && (
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md">
                                <LucideZap className="w-4 h-4 text-primary fill-current" />
                            </div>
                            <span className="font-semibold text-primary tracking-wide text-sm">{kit.total_power} kW System</span>
                        </div>
                    )}

                    {/* Title */}
                    <motion.h3 layout className={`${compact ? 'text-lg mb-1' : 'text-3xl mb-3'} font-bold text-white leading-tight drop-shadow-lg`}>
                        {kit.name}
                    </motion.h3>

                    {/* Compact hover reveal: power + type between name and price */}
                    {compact && (
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    <LucideZap className="w-3 h-3 text-primary fill-current" />
                                    <span className="text-xs font-semibold text-primary">{kit.total_power} kW</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{kit.type}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description - reveals on hover ONLY if not compact */}
                    {!compact && (
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                            <p className="text-slate-200 text-sm line-clamp-3 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 font-light leading-relaxed">
                                {kit.description}
                            </p>
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className={`flex items-end justify-between border-t border-white/10 ${compact ? 'pt-3 mt-1' : 'pt-5 mt-2'}`}>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <motion.span layout className={`${compact ? 'text-xl' : 'text-3xl'} font-bold text-white tracking-tight`}>
                                    {formatCurrency(kit.price)}
                                </motion.span>
                            </div>
                            {!compact && (
                                <span className="text-sm text-slate-400 font-medium">
                                    or {formatCurrency(kit.monthly_finance_cost || 0)}/mo
                                </span>
                            )}
                        </div>

                        {!compact && (
                            <Button
                                variant="primary"
                                size="icon"
                                className="bg-white text-black hover:bg-primary hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails?.();
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </Card>
    );
}
