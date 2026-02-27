import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Users, Zap, Truck, Headphones, ShieldCheck, Package } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '../common/Button';
import { useEffect, useState } from 'react';

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (target: number, duration = 2000, startDelay = 600) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }, startDelay);
        return () => clearTimeout(timeout);
    }, [target, duration, startDelay]);

    return count;
};

/* ─── Brand Logos (SVG Inline for perf) ─── */
const BRAND_LOGOS = [
    { name: 'Huawei Solar', abbr: 'HUAWEI' },
    { name: 'Canadian Solar', abbr: 'CANADIAN' },
    { name: 'LONGi', abbr: 'LONGi' },
    { name: 'JA Solar', abbr: 'JA SOLAR' },
    { name: 'Growatt', abbr: 'GROWATT' },
    { name: 'Trina Solar', abbr: 'TRINA' },
];

/* ─── Stat Card ─── */
interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
    delay: number;
    accent?: boolean;
}

const StatCard = ({ icon, value, label, delay, accent }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`relative group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${accent
            ? 'bg-primary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/15'
            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06]'
            }`}
    >
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400 group-hover:text-white'
            } transition-colors`}>
            {icon}
        </div>
        <div>
            <div className={`text-xl font-heading font-bold tracking-tight ${accent ? 'text-primary' : 'text-white'
                }`}>
                {value}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    </motion.div>
);

/* ─── Main Component ─── */
export const HeroSection = ({ onScrollToSimulator }: { onScrollToSimulator: () => void }) => {
    const { t } = useTranslation();
    const installersCount = useAnimatedCounter(2000, 2200, 800);
    const mwCount = useAnimatedCounter(15, 1800, 1000);

    return (
        <section className="relative min-h-[100svh] flex items-start overflow-hidden">
            {/* ── Background Layers ── */}
            <div className="absolute inset-0 z-0">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80 z-10" />
                {/* Accent radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent z-10" />
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 z-10 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '64px 64px',
                    }}
                />
                {/* Background image */}
                <img
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop"
                    alt="Solar Energy Infrastructure"
                    className="w-full h-full object-cover opacity-20 scale-105"
                />
            </div>

            {/* ── Content ── */}
            <div className="container relative z-20 px-6 mx-auto pt-[88px] pb-12 md:pt-[96px] md:pb-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ── Left Column: Copy ── */}
                    <div className="space-y-8 max-w-xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">
                                {t('hero.badge')}
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-heading font-extrabold tracking-tighter text-white !leading-[1.1]"
                        >
                            <Trans
                                i18nKey="hero.title"
                                components={{
                                    1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary" />,
                                }}
                            />
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg md:text-xl text-slate-400 leading-relaxed"
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={onScrollToSimulator}
                                className="text-base h-13 px-7 shadow-[0_0_30px_-8px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_-8px_rgba(250,204,21,0.6)] transition-shadow duration-500"
                            >
                                <Package className="w-5 h-5 mr-2" />
                                {t('hero.cta.simulate')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-base h-13 px-7 border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md"
                            >
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                {t('hero.cta.video')}
                            </Button>
                        </motion.div>

                        {/* Social proof micro-text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="flex items-center gap-3 pt-2"
                        >
                            <div className="flex -space-x-2">
                                {[
                                    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=64&h=64',
                                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=64&h=64',
                                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=64&h=64',
                                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=64&h=64',
                                ].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt=""
                                        className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                    />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    +2K
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">
                                Instaladores profesionales confían en nosotros
                            </p>
                        </motion.div>
                    </div>

                    {/* ── Right Column: Stats Grid ── */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <StatCard
                                icon={<Users className="w-5 h-5" />}
                                value={`${installersCount.toLocaleString()}+`}
                                label={t('hero.stats.installers')}
                                delay={0.5}
                                accent
                            />
                            <StatCard
                                icon={<Zap className="w-5 h-5" />}
                                value={`${mwCount}+ MW`}
                                label={t('hero.stats.dispatched')}
                                delay={0.65}
                            />
                            <StatCard
                                icon={<Truck className="w-5 h-5" />}
                                value={t('hero.stats.deliveryValue')}
                                label={t('hero.stats.delivery')}
                                delay={0.8}
                            />
                            <StatCard
                                icon={<Headphones className="w-5 h-5" />}
                                value="24/7"
                                label={t('hero.stats.support')}
                                delay={0.95}
                            />
                        </div>

                        {/* Decorative feature highlight */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-1">Cuenta profesional verificada</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Acceso exclusivo a precios mayoristas, condiciones de pago extendidas y gestor de cuenta dedicado para tu negocio.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Trusted By — Logos Strip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-10 lg:mt-14 pt-6 border-t border-white/[0.04]"
                >
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-[0.2em] text-center mb-6">
                        {t('hero.trustedBy')}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                        {BRAND_LOGOS.map((brand, i) => (
                            <motion.div
                                key={brand.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.3 + i * 0.08, duration: 0.4 }}
                                className="text-slate-600 hover:text-slate-300 transition-colors duration-300 cursor-default"
                            >
                                <span className="text-sm font-heading font-bold tracking-wider">
                                    {brand.abbr}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Scroll Indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
            >
                <ChevronDown className="w-6 h-6 text-white/20" />
            </motion.div>
        </section>
    );
};
