import { HelpCircle } from 'lucide-react';

export function FaqPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <HelpCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Preguntas Frecuentes</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
                Resuelve tus dudas rápidamente consultando nuestra base de conocimiento estructurada para clientes.
            </p>
            <div className="w-full max-w-2xl bg-secondary border border-white/10 p-8 rounded-2xl shadow-xl text-left space-y-4">
                <details className="group border-b border-white/10 pb-4">
                    <summary className="font-bold text-lg text-white cursor-pointer hover:text-primary transition-colors">¿Cuánto tardan en realizar una instalación?</summary>
                    <p className="mt-2 text-slate-400">Dependiendo del tamaño de la instalación, solemos completar el trabajo en 1 a 3 días hábiles.</p>
                </details>
                <details className="group border-b border-white/10 pb-4">
                    <summary className="font-bold text-lg text-white cursor-pointer hover:text-primary transition-colors">¿Qué garantía tienen los paneles?</summary>
                    <p className="mt-2 text-slate-400">Ofrecemos hasta 25 años de garantía de producción por parte del fabricante.</p>
                </details>
                <details className="group border-b border-white/10 pb-4">
                    <summary className="font-bold text-lg text-white cursor-pointer hover:text-primary transition-colors">¿Tramitáis las subvenciones?</summary>
                    <p className="mt-2 text-slate-400">Sí, nuestro equipo se encarga de todo el papeleo legal y solicitud de ayudas disponibles en tu comunidad.</p>
                </details>
            </div>
        </div>
    );
}
