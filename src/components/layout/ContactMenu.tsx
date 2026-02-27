import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Calculator, BookOpen, Mail, Phone, HelpCircle } from 'lucide-react';

export function ContactMenu() {
    const [isHover, setIsHover] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setIsHover(false), 200);
    };

    return (
        <div
            className="relative hidden md:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
            >
                <span className="text-sm font-medium">Contacto</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHover ? 'rotate-180' : ''}`} />
            </button>

            {/* Hover Popover */}
            {isHover && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-secondary border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Flecha */}
                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-secondary border-l border-t border-white/10 rotate-45" />
                    {/* Invisible bridge */}
                    <div className="absolute -top-3 left-0 w-full h-3" />

                    <div className="p-2 flex flex-col gap-1 relative z-10 text-left">
                        <Link to="/contacto/presupuesto" onClick={() => setIsHover(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Calculator className="h-4 w-4 opacity-70" />
                            Presupuesto personalizado
                        </Link>
                        <Link to="/contacto/guia" onClick={() => setIsHover(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <BookOpen className="h-4 w-4 opacity-70" />
                            Guía de CuencaSolar
                        </Link>
                        <Link to="/contacto/formulario" onClick={() => setIsHover(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Mail className="h-4 w-4 opacity-70" />
                            Formulario de contacto
                        </Link>
                        <Link to="/contacto/llamar" onClick={() => setIsHover(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Phone className="h-4 w-4 opacity-70" />
                            Llamar a CuencaSolar
                        </Link>
                        <Link to="/contacto/faq" onClick={() => setIsHover(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <HelpCircle className="h-4 w-4 opacity-70" />
                            FAQ (Preguntas Frecuentes)
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
