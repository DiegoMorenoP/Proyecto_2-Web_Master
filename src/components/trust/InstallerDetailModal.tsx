import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, ShieldCheck, CheckCircle, Award, Calendar, Briefcase } from 'lucide-react';
import { Button } from '../common/Button';
import { useEffect } from 'react';

export interface Installer {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    verified: boolean;
    avatar: string;
    description: string;
    specialties: string[];
    yearsExperience: number;
    completedProjects: number;
    certifications: string[];
    gallery?: string[];
}

interface InstallerDetailModalProps {
    installer: Installer | null;
    isOpen: boolean;
    onClose: () => void;
}

export function InstallerDetailModal({ installer, isOpen, onClose }: InstallerDetailModalProps) {
    // Prevent body scroll when open
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

    if (!installer) return null;

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                    >
                        <div className="bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto flex flex-col">

                            {/* Header Image / Cover */}
                            <div className="h-48 bg-gradient-to-r from-primary/20 via-zinc-800 to-zinc-900 relative shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute -bottom-12 left-8 flex items-end">
                                    <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                        {installer.avatar}
                                    </div>
                                    <div className="mb-4 ml-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-bold text-white shadow-black drop-shadow-md">{installer.name}</h2>
                                            {installer.verified && (
                                                <ShieldCheck className="w-5 h-5 text-primary fill-primary/20" />
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-300 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm w-fit">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {installer.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left Column: Main Info */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* About */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-3">Sobre nosotros</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {installer.description}
                                        </p>
                                    </section>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <div className="flex justify-center mb-2">
                                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{installer.rating}</div>
                                            <div className="text-xs text-slate-500">{installer.reviews} reseñas</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <div className="flex justify-center mb-2">
                                                <Briefcase className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{installer.completedProjects}+</div>
                                            <div className="text-xs text-slate-500">Proyectos</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <div className="flex justify-center mb-2">
                                                <Calendar className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{installer.yearsExperience}</div>
                                            <div className="text-xs text-slate-500">Años Exp.</div>
                                        </div>
                                    </div>

                                    {/* Gallery (Mock) */}
                                    <section>
                                        <h3 className="text-lg font-bold text-white mb-3">Trabajos Recientes</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="aspect-square rounded-xl bg-zinc-800 border border-white/5 overflow-hidden relative group">
                                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 group-hover:bg-black/20 transition-colors">
                                                        <span className="text-xs">Proyecto {i}</span>
                                                    </div>
                                                    {/* Placeholder logic just solid color */}
                                                    <div className={`w-full h-full opacity-20 bg-gradient-to-br from-primary to-blue-600`} />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Sidebar */}
                                <div className="space-y-6">

                                    {/* Specialties */}
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-primary" />
                                            Especialidades
                                        </h4>
                                        <ul className="space-y-3">
                                            {installer.specialties.map((spec, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    {spec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Certifications */}
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            Certificaciones
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {installer.certifications.map((cert, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 text-slate-300 text-xs rounded-full border border-white/5">
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <Button className="w-full py-6 text-lg shadow-xl shadow-primary/20">
                                        Solicitar Presupuesto
                                    </Button>
                                    <p className="text-center text-xs text-slate-500">
                                        Respuesta media: &lt; 2 horas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
