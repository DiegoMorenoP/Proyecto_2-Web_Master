import { Mail } from 'lucide-react';

export function FormularioPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Mail className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Formulario de Contacto</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
                ¿Tienes alguna duda comercial o técnica? Escríbenos y te responderemos en la mayor brevedad posible.
            </p>
            <div className="w-full max-w-md bg-secondary border border-white/10 p-8 rounded-2xl shadow-xl">
                <p className="text-slate-400">
                    [Aquí iría el formulario de contacto general]
                </p>
            </div>
        </div>
    );
}
