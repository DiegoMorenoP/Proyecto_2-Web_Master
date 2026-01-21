import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Catbot } from '../chat/Catbot';
import { CartDrawer } from '../cart/CartDrawer';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-secondary text-white font-sans flex flex-col">
            <Header />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
            <Catbot />
            <CartDrawer />
        </div>
    );
}
