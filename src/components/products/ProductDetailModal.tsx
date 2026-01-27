import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingCart, Zap, Battery, Home, Info, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Kit } from '../../types';
import { Button } from '../common/Button';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Kit | null;
    onAddToCart: (product: Kit) => void;
}

export function ProductDetailModal({ isOpen, onClose, product, onAddToCart }: ProductDetailModalProps) {
    const { t } = useTranslation();

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[10050] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-[10060] left-4 right-4 top-4 bottom-4 md:left-10 md:right-10 md:top-10 md:bottom-10 lg:left-[10%] lg:right-[10%] lg:top-[5%] lg:bottom-[5%] bg-background rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row max-w-7xl mx-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-muted">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                                    <Zap className="w-24 h-24 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r" />

                            {/* Tags over image */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {(product.type === 'hybrid' || (product.popularity_score && product.popularity_score > 8)) && (
                                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg backdrop-blur-md">
                                        {product.popularity_score ? `Popular (${product.popularity_score})` : t('common.popular')}
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-black/60 text-white text-xs font-bold rounded-full backdrop-blur-md border border-white/10">
                                    {product.total_power}kW Potencia
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto bg-card/50 backdrop-blur-3xl">
                            <div className="mb-6">
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                                    {product.name}
                                </h2>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-mono font-bold text-primary">
                                        {Number(product.price).toLocaleString()}€
                                    </span>
                                    <span className="text-lg text-muted-foreground line-through">
                                        {(Number(product.price) * 1.2).toLocaleString()}€
                                    </span>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">
                                        -20% Oferta
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                                    <Zap className="w-5 h-5 text-yellow-500 mb-2" />
                                    <div className="text-sm text-muted-foreground">Generación</div>
                                    <div className="font-bold text-foreground">{product.total_power} kW</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                                    <Battery className="w-5 h-5 text-blue-500 mb-2" />
                                    <div className="text-sm text-muted-foreground">Batería</div>
                                    <div className="font-bold text-foreground">Opcional</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                                    <Home className="w-5 h-5 text-emerald-500 mb-2" />
                                    <div className="text-sm text-muted-foreground">Ideal para</div>
                                    <div className="font-bold text-foreground">Vivienda Mediana</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                                    <Info className="w-5 h-5 text-purple-500 mb-2" />
                                    <div className="text-sm text-muted-foreground">Garantía</div>
                                    <div className="font-bold text-foreground">25 Años</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h3 className="text-lg font-bold text-foreground">Lo que incluye</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Paneles Solares Tier-1 Alta Eficiencia",
                                        "Inversor Híbrido Inteligente",
                                        "Estructura de Montaje (Tejado/Suelo)",
                                        "Cableado y Protecciones DC/AC",
                                        "App de Monitorización 24/7"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="p-1 rounded-full bg-primary/10 text-primary">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border/50 flex flex-col md:flex-row gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-1 gap-2 shadow-xl shadow-primary/20"
                                    disabled={product.stock !== undefined && product.stock === 0}
                                    onClick={() => {
                                        if (product.stock !== undefined && product.stock === 0) return;
                                        onAddToCart(product);
                                        onClose();
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stock !== undefined && product.stock === 0 ? t('common.outOfStock') : `${t('common.addToCart')} - ${Number(product.price).toLocaleString()}€`}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 gap-2"
                                    onClick={onClose}
                                >
                                    Seguir mirando <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
