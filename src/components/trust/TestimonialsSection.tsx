import { useState } from 'react';
import { Star, User, Quote, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { TestimonialsModal, type Testimonial } from './TestimonialsModal';

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Carlos Rodríguez",
        role: "Propietario en Madrid",
        text: "La simulación fue exacta. Me dijeron que ahorraría 400€ al año y tras 6 meses estoy ahorrando incluso más. El proceso de instalación fue impecable.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 2,
        name: "Ana Morales",
        role: "Casa de Campo en Toledo",
        text: "Increíble la tecnología de mapeo solar. Me mostraron exactamente dónde poner los paneles para máxima eficiencia. Muy recomendado.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 3,
        name: "David K.",
        role: "Chalet en Valencia",
        text: "El servicio post-venta es de otro nivel. Tuve una duda con el inversor y me llamaron en 5 minutos. Profesionales de verdad.",
        rating: 5,
        image: null
    },
    {
        id: 4,
        name: "Elena Pastor",
        role: "Ático en Barcelona",
        text: "Tenía dudas por el espacio en mi terraza, pero el kit Urban fue perfecto. Ahora cargo mi coche eléctrico casi gratis.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 5,
        name: "Miguel Ángel",
        role: "Finca en Andalucía",
        text: "La instalación aislada cambió mi vida. Ya no dependo de generadores ruidosos. Silencio total y energía limpia.",
        rating: 5,
        image: null
    },
    {
        id: 6,
        name: "Sarah Jenkins",
        role: "Villa en Málaga",
        text: "Very impressive service. The installers were clean, fast, and explained the app perfectly. Loving my solar production!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

export const TestimonialsSection = () => {
    const { t } = useTranslation();
    const [visibleCount, setVisibleCount] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasExpandedOnce, setHasExpandedOnce] = useState(false);

    const handleViewMore = () => {
        setVisibleCount(6);
        setHasExpandedOnce(true);
    };

    return (
        <section className="py-12 bg-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                        <Trans i18nKey="trust.title" components={{ 1: <span className="text-primary" /> }} />
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('trust.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <AnimatePresence>
                        {TESTIMONIALS.slice(0, visibleCount).map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative hover:border-primary/20 transition-colors group"
                            >
                                <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>

                                <p className="text-slate-300 mb-8 leading-relaxed">
                                    "{t.text}"
                                </p>

                                <div className="flex items-center gap-4">
                                    {t.image ? (
                                        <img
                                            src={t.image}
                                            alt={t.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <User className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-foreground">{t.name}</div>
                                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col items-center gap-8">
                    {!hasExpandedOnce && (
                        <button
                            onClick={handleViewMore}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2 group"
                        >
                            {t('common.showMore')}
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    )}

                    <div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="text-yellow-500 font-bold">4.9/5</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                        </div>
                        <span className="text-muted-foreground ml-2 text-sm group-hover:text-white transition-colors">{t('trust.reviews.basedOn')}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground ml-1 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>

            <TestimonialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                testimonials={TESTIMONIALS} // In a real app, this would clearly be a larger fetched list
            />
        </section>
    );
};
