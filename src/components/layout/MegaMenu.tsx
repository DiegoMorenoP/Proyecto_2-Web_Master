import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { b2bCategories } from '../../config/navigation';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function MegaMenu() {
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsHovered(true);
        if (activeTab === null) setActiveTab(0);
    };

    const handleMouseLeave = () => {
        if (isPinned) return;
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            setActiveTab(null);
        }, 400); // 400ms hover tolerance
    };

    const handleToggleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPinned(!isPinned);
        if (!isPinned) {
            setIsHovered(true);
            if (activeTab === null) setActiveTab(0);
        }
    };

    const handleCategoryClick = (href: string) => {
        setIsHovered(false);
        setIsPinned(false);
        setActiveTab(null);

        // If we're already on home, manipulate search params to force re-trigger
        if (location.pathname === '/') {
            // Add a timestamp to force useEffect re-trigger
            const separator = href.includes('?') ? '&' : '?';
            navigate(`${href}${separator}_t=${Date.now()}`, { replace: true });
        } else {
            navigate(href);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsPinned(false);
                setIsHovered(false);
                setActiveTab(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menu on scroll past hero section
    useEffect(() => {
        const handleScroll = () => {
            if ((isHovered || isPinned) && window.scrollY > window.innerHeight * 0.8) {
                setIsPinned(false);
                setIsHovered(false);
                setActiveTab(null);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHovered, isPinned]);

    const isVisible = isHovered || isPinned;

    return (
        <div
            ref={menuRef}
            className="relative hidden lg:flex items-center gap-6 h-full"
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="flex items-center h-full group"
                onMouseEnter={handleMouseEnter}
            >
                <button
                    onClick={handleToggleClick}
                    className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors h-full"
                >
                    {t('nav.products')}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isVisible && "rotate-180")} />
                </button>
            </div>

            <a href="#dsm" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {t('nav.map3d')}
            </a>
            <a href="#calculator" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {t('nav.calculator')}
            </a>


            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="absolute top-full -left-32 w-[800px] bg-secondary border border-white/10 rounded-xl shadow-2xl overflow-hidden flex"
                        style={{ marginTop: 0 }}
                    >
                        {/* Invisible bridge to cover gap between trigger and dropdown */}
                        <div className="absolute -top-3 left-0 w-full h-3" />
                        {/* Sidebar Categories */}
                        <div className="w-1/3 bg-white/5 border-r border-white/10 p-2 flex flex-col gap-1">
                            {b2bCategories.map((category, idx) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.title}
                                        onMouseEnter={() => setActiveTab(idx)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full",
                                            activeTab === idx
                                                ? "bg-primary/20 text-primary"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 opacity-70" />
                                        {category.title}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="w-2/3 p-6 bg-secondary relative">
                            <AnimatePresence mode="wait">
                                {activeTab !== null && (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <div className="col-span-2 mb-4">
                                            <h3 className="text-lg font-bold text-white mb-1">{b2bCategories[activeTab].title}</h3>
                                            <button
                                                onClick={() => handleCategoryClick(b2bCategories[activeTab!].href)}
                                                className="text-xs text-primary hover:text-primary/80 font-medium"
                                            >
                                                Ver todo en {b2bCategories[activeTab].title} →
                                            </button>
                                        </div>

                                        {b2bCategories[activeTab].items.map((item) => (
                                            <button
                                                key={item.href}
                                                onClick={() => handleCategoryClick(item.href)}
                                                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group/link text-left"
                                            >
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover/link:bg-primary transition-colors" />
                                                {item.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
