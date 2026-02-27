import { Phone } from 'lucide-react';

export function LlamarPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Phone className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Llamar a CuencaSolar</h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
                Hablemos. Nuestro equipo de atención al cliente está disponible para ti.
            </p>
            <div className="w-full max-w-md bg-secondary border border-white/10 p-8 rounded-2xl shadow-xl space-y-4">
                <div className="text-3xl font-mono font-bold text-primary">
                    +34 900 123 456
                </div>
                <p className="text-sm text-slate-400">Lunes a Viernes de 9:00h a 18:00h</p>
            </div>
        </div>
    );
}
