import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { b2bCategories } from '../../config/navigation';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export function MobileMenuNav({ closeMenu }: { closeMenu: () => void }) {
    const { t } = useTranslation();
    const [openCategory, setOpenCategory] = useState<number | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleCategory = (idx: number) => {
        setOpenCategory(openCategory === idx ? null : idx);
    };

    return (
        <nav className="flex flex-col gap-2">
            {/* Mobile Search Bar */}
            <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-left mb-2 group hover:bg-white/10 transition-colors"
            >
                <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                <span className="text-sm text-slate-500 group-hover:text-slate-300">{t('search.triggerLabel')}</span>
            </button>

            <div className="flex flex-col gap-1">
                <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('nav.products')}
                </div>
                {b2bCategories.map((category, idx) => {
                    const Icon = category.icon;
                    const isOpen = openCategory === idx;

                    return (
                        <div key={category.title} className="flex flex-col">
                            <button
                                onClick={() => toggleCategory(idx)}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors",
                                    isOpen ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 opacity-70" />
                                    {category.title}
                                </div>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-11 pr-3 py-2 flex flex-col gap-3">
                                            {category.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    to={item.href}
                                                    onClick={closeMenu}
                                                    className="text-sm text-slate-400 hover:text-white flex items-center justify-between group"
                                                >
                                                    {item.name}
                                                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </Link>
                                            ))}
                                            <Link
                                                to={category.href}
                                                onClick={closeMenu}
                                                className="text-xs font-semibold text-primary mt-1"
                                            >
                                                Ver todo en {category.title} →
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <div className="h-px bg-white/10 my-2" />

            <a href="#dsm" onClick={closeMenu} className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-3 rounded-lg hover:bg-white/5">
                {t('nav.map3d')}
            </a>
            <a href="#calculator" onClick={closeMenu} className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-3 rounded-lg hover:bg-white/5">
                {t('nav.calculator')}
            </a>

            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}
