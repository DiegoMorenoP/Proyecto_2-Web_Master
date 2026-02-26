import { LucideZap, ShoppingCart, Menu, X, LogOut, User, Maximize2, Trash2, Search, Command } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LoginModal } from '../auth/LoginModal';
import { MegaMenu } from './MegaMenu';
import { MobileMenuNav } from './MobileMenuNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartHover, setIsCartHover] = useState(false);
    const cartHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { toggleCart, itemCount, items, subtotal, removeItem } = useCart();
    const { t } = useTranslation();
    const { user, signOut, profile } = useAuth();

    // ⌘K / Ctrl+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleCartMouseEnter = () => {
        if (cartHoverTimeout.current) clearTimeout(cartHoverTimeout.current);
        setIsCartHover(true);
    };

    const handleCartMouseLeave = () => {
        cartHoverTimeout.current = setTimeout(() => setIsCartHover(false), 200);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-secondary/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 mr-4"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="flex bg-primary/10 p-2 rounded-xl">
                        <LucideZap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-xl font-bold tracking-tight text-white">SolarGen</span>
                </Link>

                {/* Desktop Nav - Center */}
                <MegaMenu />

                {/* Right Actions - Always Visible */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Global Search Trigger */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all group"
                        title={t('search.triggerTitle')}
                        id="global-search-trigger"
                    >
                        <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        <span className="hidden md:inline text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                            {t('search.triggerLabel')}
                        </span>
                        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                            <Command className="w-3 h-3" />K
                        </kbd>
                    </button>
                    {/* Language - Hidden on Tablet/Mobile */}
                    <div className="hidden xl:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Cart - Always Visible */}
                    <div
                        className="relative"
                        onMouseEnter={handleCartMouseEnter}
                        onMouseLeave={handleCartMouseLeave}
                    >
                        <Button variant="ghost" size="sm" onClick={toggleCart} className="relative p-2 h-10 w-10 md:w-auto md:px-4">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-secondary">
                                    {itemCount}
                                </span>
                            )}
                        </Button>

                        {/* Hover Popover */}
                        {isCartHover && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Flecha */}
                                <div className="absolute -top-1.5 right-5 w-3 h-3 bg-secondary/95 border-l border-t border-white/10 rotate-45" />

                                {items.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-slate-400">
                                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        Tu cesta está vacía
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                                            {items.slice(0, 3).map(item => (
                                                <div key={item.id} className="flex gap-3 items-center group/item">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingCart className="w-4 h-4 text-slate-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {item.quantity}x · <span className="text-primary font-mono">{item.price.toLocaleString()}€</span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                                        className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            {items.length > 3 && (
                                                <p className="text-xs text-center text-slate-500">
                                                    +{items.length - 3} producto{items.length - 3 > 1 ? 's' : ''} más
                                                </p>
                                            )}
                                        </div>

                                        <div className="border-t border-white/5 px-4 py-3 flex justify-between items-center bg-white/[0.02]">
                                            <div>
                                                <span className="text-xs text-slate-400">Subtotal</span>
                                                <p className="text-lg font-bold font-mono text-white">{subtotal.toLocaleString()}€</p>
                                            </div>
                                            <Link
                                                to="/cart"
                                                onClick={() => setIsCartHover(false)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold rounded-lg transition-colors"
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                                Ver carrito
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Login / Profile - Always Visible */}
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="h-8 w-8 rounded-full bg-white/10 object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                            </Link>
                            <button onClick={() => signOut()} className="hidden md:block text-slate-400 hover:text-white transition-colors" title="Cerrar sesión">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title={t('common.login')}
                            aria-label={t('common.login')}
                        >
                            <User className="h-5 w-5" />
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="xl:hidden text-slate-300 p-2 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Menu */}
            {isMenuOpen && (
                <div className="xl:hidden border-t border-white/5 bg-secondary px-6 py-4 space-y-4 animate-in slide-in-from-top-4 shadow-2xl">
                    <div className="lg:hidden">
                        <MobileMenuNav closeMenu={() => setIsMenuOpen(false)} />
                    </div>

                    {/* Extra items that hide from top bar */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">{t('common.language')}</span>
                        <LanguageSwitcher />
                    </div>

                    {user && (
                        <div className="border-t border-white/5 pt-2">
                            <button
                                onClick={() => { signOut(); setIsMenuOpen(false); }}
                                className="flex items-center gap-3 w-full text-left text-sm font-medium text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                {t('common.logout')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}
