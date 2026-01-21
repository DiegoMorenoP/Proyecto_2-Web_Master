import { ArrowUpRight, Zap, Battery } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    power: string;
    savings: string;
    image?: string;
    popular?: boolean;
    stock?: number;
    onAddToCart?: () => void;
    variant?: 'vertical' | 'horizontal';
}

export const ProductCard = ({ id, title, price, power, savings, image, popular, stock, onAddToCart, variant = 'vertical' }: ProductCardProps) => {
    // Determine active layout based on prop and viewport (md handled by CSS classes)
    const isHorizontal = variant === 'horizontal';
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group rounded-3xl p-1 h-full ${popular ? 'bg-gradient-to-br from-primary/40 to-emerald-600/20' : 'bg-white/5'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl pointer-events-none" />

            {/* Main Card Container */}
            <div className={`relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[22px] overflow-hidden border border-white/10 flex flex-col ${isHorizontal ? 'md:flex-row' : ''}`}>

                {/* Image Area */}
                <div className={`relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 ${isHorizontal ? 'md:w-5/12 h-64 md:h-full' : 'h-48 md:h-64 w-full'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                    {/* Badges - Now inside image to avoid text overlap */}
                    <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-2 items-end">
                        {popular && (
                            <div className="bg-primary text-secondary-foreground text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-primary/20 flex items-center gap-1 backdrop-blur-md bg-opacity-90">
                                <Zap className="w-3 h-3" />
                                {t('common.popular').toUpperCase()}
                            </div>
                        )}
                        {stock !== undefined && stock < 5 && (
                            <div className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20 animate-pulse backdrop-blur-md bg-opacity-90">
                                {t('common.onlyLeft', { count: stock }).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {image ? (
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Zap className="w-16 h-16 text-slate-700" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className={`font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors ${isHorizontal ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                            {title}
                        </h3>

                        <div className="flex flex-wrap items-baseline gap-2 mb-4 md:mb-6">
                            <span className={`font-mono text-white ${isHorizontal ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                                {price.toLocaleString()}€
                            </span>
                            <span className="text-xs md:text-sm text-slate-400 whitespace-nowrap">/ kit completo</span>
                        </div>

                        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Zap className="w-4 h-4 text-primary shrink-0" />
                                <span className="truncate">{t('common.power')}: <span className="text-white font-medium">{power}</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Battery className="w-4 h-4 text-accent shrink-0" />
                                <span className="truncate">{t('common.savings')}: <span className="text-accent font-medium">{savings}</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                        <Link to={`/product/${id}`} className="flex-1 py-2.5 md:py-3 rounded-xl border border-white/10 text-white text-sm md:text-base font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group/btn relative overflow-hidden">
                            <span className="relative z-10">{t('common.viewDetails')}</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </Link>
                        {onAddToCart && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCart();
                                }}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors shrink-0"
                                title={t('common.addToCart')}
                            >
                                <Zap className="w-5 h-5 fill-current" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
