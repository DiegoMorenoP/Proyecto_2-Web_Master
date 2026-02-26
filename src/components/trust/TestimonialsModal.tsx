
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Quote, User, Maximize2, Minimize2 } from 'lucide-react';

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    text: string;
    rating: number;
    image: string | null;
}

interface TestimonialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    testimonials: Testimonial[];
}

export function TestimonialsModal({ isOpen, onClose, testimonials }: TestimonialsModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
                    />
                    <div
                        className="fixed inset-0 z-[10000] overflow-y-auto"
                        onClick={onClose}
                    >
                        <div className="flex min-h-screen items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`relative w-full bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMaximized ? 'max-w-[100vw] h-screen rounded-none' : 'max-w-6xl max-h-[90vh] rounded-3xl'
                                    }`}
                            >
                                <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl flex flex-col gap-4 z-20 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Opiniones de Clientes</h2>
                                            <p className="text-slate-400 text-sm">Más de 500 reseñas verificadas de propietarios satisfechos</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setIsMaximized(!isMaximized)}
                                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                                title={isMaximized ? "Restaurar" : "Maximizar"}
                                            >
                                                {isMaximized ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-zinc-950/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                                        {testimonials.map((t, i) => (
                                            <motion.div
                                                key={t.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
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
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
