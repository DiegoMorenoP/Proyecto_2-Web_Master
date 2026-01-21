import { LucideZap } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-slate-950 py-12">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <LucideZap className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight text-white">SolarGen</span>
                        </div>
                        <p className="text-slate-400 max-w-xs">
                            The next generation of sustainable energy e-commerce.
                            Engineering grade hardware, consumer grade experience.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Calculator</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Kits</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Components</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Installers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Warranty</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-slate-500">
                    © 2026 SolarGen Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
