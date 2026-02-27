import { PhoneCall } from 'lucide-react';

export function PresupuestoPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <PhoneCall className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Presupuesto Personalizado</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
                Déjanos tus datos y un especialista energético de CuencaSolar se pondrá en contacto contigo para ofrecerte la mejor solución.
            </p>
            <div className="w-full max-w-md bg-secondary border border-white/10 p-8 rounded-2xl shadow-xl">
                <p className="text-slate-400">
                    [Aquí iría el formulario de presupuesto]
                </p>
            </div>
        </div>
    );
}
