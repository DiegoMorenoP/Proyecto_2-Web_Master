import { BookOpen } from 'lucide-react';

export function GuiaPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Guía de CuencaSolar</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
                Todo lo que necesitas saber sobre instalaciones fotovoltaicas, subvenciones, y mantenimiento.
            </p>
            <div className="w-full max-w-md bg-secondary border border-white/10 p-8 rounded-2xl shadow-xl flex items-center justify-center">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-colors">
                    Descargar Guía Completa (PDF)
                </button>
            </div>
        </div>
    );
}
