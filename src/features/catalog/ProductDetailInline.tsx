import { motion } from 'framer-motion';
import { ShoppingCart, Check, Zap, Battery, Home, Info, X } from 'lucide-react';
import type { Kit } from '../../types';
import { Button } from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

interface ProductDetailInlineProps {
    product: Kit;
    onClose: () => void;
    onAddToCart: (product: Kit) => void;
}

export function ProductDetailInline({ product, onClose, onAddToCart }: ProductDetailInlineProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full overflow-hidden col-span-1 md:col-span-2 lg:col-span-3"
        >
            <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative mt-4 mb-8 backdrop-blur-xl">
                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>

                {/* Left Column: Image & Quick Specs */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Zap className="w-16 h-16 text-slate-700" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                {product.type.toUpperCase()}
                            </span>
                            <span className="text-primary font-medium text-sm">
                                {product.total_power} kW System
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{product.name}</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <Zap className="w-5 h-5 text-yellow-500 mb-2" />
                            <div className="text-xs text-slate-400">Generación</div>
                            <div className="font-bold text-white">{product.total_power} kW</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <Battery className="w-5 h-5 text-blue-500 mb-2" />
                            <div className="text-xs text-slate-400">Batería</div>
                            <div className="font-bold text-white">Opcional</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <Home className="w-5 h-5 text-emerald-500 mb-2" />
                            <div className="text-xs text-slate-400">Ideal</div>
                            <div className="font-bold text-white">Vivienda</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <Info className="w-5 h-5 text-purple-500 mb-2" />
                            <div className="text-xs text-slate-400">Garantía</div>
                            <div className="font-bold text-white">25 Años</div>
                        </div>
                    </div>

                    {/* Includes */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-white">Incluye:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                            {[
                                "Paneles Solares Tier-1",
                                "Inversor Híbrido",
                                "Estructura Coplanar",
                                "Protecciones DC/AC",
                                "Monitorización WiFi"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">
                                    {Number(product.price).toLocaleString()}€
                                </span>
                                <span className="text-sm text-slate-500 line-through">
                                    {(Number(product.price * 1.2)).toLocaleString()}€
                                </span>
                            </div>
                            <div className="text-sm text-slate-400">
                                Financiación desde {product.monthly_finance_cost}€/mes
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px] gap-2 shadow-lg shadow-primary/20"
                            onClick={() => onAddToCart(product)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {t('common.addToCart')}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
