
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Star, MapPin, ShieldCheck } from 'lucide-react';
import { GlassContainer } from '../common/GlassContainer';
import { InstallerDetailContent } from './InstallerDetailModal';
import type { Installer } from './InstallerDetailModal';
import { ArrowLeft } from 'lucide-react';

interface InstallersListModalProps {
    isOpen: boolean;
    onClose: () => void;
    installers: Installer[];
    onSelectInstaller: (installer: Installer) => void;
}

export function InstallersListModal({ isOpen, onClose, installers, onSelectInstaller }: InstallersListModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingInstaller, setViewingInstaller] = useState<Installer | null>(null);

    // Reset view when modal opens/closes
    useEffect(() => {
        if (!isOpen) setViewingInstaller(null);
    }, [isOpen]);

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

    const filteredInstallers = installers.filter(installer =>
        installer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="fixed inset-0 z-[10000] overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <AnimatePresence mode="wait">
                                    {viewingInstaller ? (
                                        <motion.div
                                            key="detail"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                                            onClick={(e) => { e.stopPropagation(); }} // Prevent bubble
                                        >
                                            <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
                                                {/* Back Button Overlay */}
                                                <button
                                                    onClick={() => setViewingInstaller(null)}
                                                    className="absolute top-4 left-4 z-50 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors flex items-center gap-2 pr-4"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                    <span className="text-sm font-bold">Volver</span>
                                                </button>

                                                <InstallerDetailContent
                                                    installer={viewingInstaller}
                                                    embedded
                                                    onClose={() => setViewingInstaller(null)}
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="list"
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="flex flex-col h-full"
                                        >
                                            <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl flex flex-col gap-4 z-20 shrink-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-white mb-1">Red de Instaladores</h2>
                                                        <p className="text-slate-400 text-sm">Encuentra expertos certificados cerca de ti</p>
                                                    </div>
                                                    <button
                                                        onClick={onClose}
                                                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                                    >
                                                        <X className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                <div className="relative w-full md:w-96 group">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Buscar por nombre o ciudad..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-zinc-950/50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                                                    {filteredInstallers.map(installer => (
                                                        <GlassContainer
                                                            key={installer.id}
                                                            className="p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                                            onClick={() => setViewingInstaller(installer)}
                                                        >
                                                            <div className="flex items-start justify-between mb-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                                                                        {installer.avatar}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-white font-bold group-hover:text-primary transition-colors">{installer.name}</h3>
                                                                        <div className="flex items-center text-xs text-slate-400">
                                                                            <MapPin className="w-3 h-3 mr-1" />
                                                                            {installer.location}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {installer.verified && (
                                                                    <div className="text-primary" title="Verificado">
                                                                        <ShieldCheck className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                    <span className="text-white font-mono">{installer.rating}</span>
                                                                    <span className="text-slate-500 text-xs">({installer.reviews})</span>
                                                                </div>
                                                                <button className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                                                                    Ver Perfil <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                                </button>
                                                            </div>
                                                        </GlassContainer>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
