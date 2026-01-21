import { LucideZap, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleCart, itemCount } = useCart();
    const { t } = useTranslation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-secondary/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex bg-primary/10 p-2 rounded-xl">
                        <LucideZap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">SolarGen</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#dsm" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.products')} {/* Using products as generic link for now */}
                    </a>
                    <a href="#productos" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.calculator')}
                    </a>
                    <a href="#installers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.installers')}
                    </a>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-secondary">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                    {/* <Button variant="primary" size="sm">
                        Get Quote
                    </Button> */}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-slate-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-secondary px-6 py-4 space-y-4 animate-in slide-in-from-top-4">
                    <a href="#" className="block text-sm font-medium text-slate-300 hover:text-white">
                        {t('nav.products')}
                    </a>
                    <a href="#" className="block text-sm font-medium text-slate-300 hover:text-white">
                        {t('nav.calculator')}
                    </a>
                    <a href="#" className="block text-sm font-medium text-slate-300 hover:text-white">
                        {t('nav.installers')}
                    </a>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400 text-sm">{t('common.language')}</span>
                        <LanguageSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
}
