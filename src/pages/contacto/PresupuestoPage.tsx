import { motion } from 'framer-motion';
import { Check, Zap, Plug, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PresupuestoPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center">
            {/* Header Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center w-full max-w-4xl mb-16 relative z-10"
            >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
                    <Zap className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-heading tracking-tight">
                    Presupuesto personalizado
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-medium">
                    Para diseñar la solución óptima para tu negocio, necesitamos saber si tienes acceso a la red eléctrica o no.
                </p>
            </motion.div>

            {/* Cards Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10"
            >
                {/* Decoradores de fondo estilo "glow" */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Tarjeta: Instalación Aislada */}
                <motion.div
                    variants={cardVariants}
                    className="group flex flex-col bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl relative"
                >
                    {/* Borde superior decorativo */}
                    <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-400 group-hover:from-primary group-hover:to-primary/70 transition-colors" />

                    <div className="p-8 md:p-10 flex-grow flex flex-col">
                        <div className="flex items-center justify-center mb-8">
                            <h2 className="text-3xl font-bold text-white group-hover:text-primary transition-colors text-center w-full">
                                Instalación Aislada
                            </h2>
                        </div>

                        <ul className="space-y-6 mb-8 text-slate-300 flex-grow">
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Independencia total:</strong> Tu propia energía sin depender de compañías distribuidoras ni de sus subidas de tarifa.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Para zonas remotas:</strong> Ideal para naves agrícolas, explotaciones y fincas donde no llega el cableado público.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Requiere baterías:</strong> Imprescindible un sistema de almacenamiento a escala industrial para suministrar carga nocturna.
                                </div>
                            </li>
                        </ul>

                        <div className="bg-red-500/10 group-hover:bg-primary/10 border-l-4 border-red-500 group-hover:border-primary transition-colors rounded-r-xl p-5 mb-8">
                            <p className="text-red-400 group-hover:text-primary transition-colors font-medium">
                                Ideal si: El emplazamiento de tu proyecto no tiene contrato ni infraestructura de luz con ninguna compañía.
                            </p>
                        </div>

                        <Link
                            to="/categoria/kits-scl-aislada"
                            className="mt-auto block w-full text-center py-4 bg-red-500 hover:bg-red-600 group-hover:bg-primary group-hover:hover:bg-primary/90 group-hover:text-secondary text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Ver Kits Aislados
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 duration-300" />
                        </Link>
                    </div>
                </motion.div>

                {/* Tarjeta: Conexión a Red */}
                <motion.div
                    variants={cardVariants}
                    className="group flex flex-col bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl relative"
                >
                    {/* Borde superior decorativo */}
                    <div className="h-2 w-full bg-gradient-to-r from-red-500 to-red-400 group-hover:from-primary group-hover:to-primary/70 transition-colors" />

                    <div className="p-8 md:p-10 flex-grow flex flex-col">
                        <div className="flex items-center justify-center mb-8">
                            <h2 className="text-3xl font-bold text-white group-hover:text-primary transition-colors text-center w-full flex items-center justify-center gap-3">
                                Conexión a Red <Plug className="w-6 h-6 opacity-50" />
                            </h2>
                        </div>

                        <ul className="space-y-6 mb-8 text-slate-300 flex-grow">
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Ahorro drástico inmediato:</strong> Reduce radicalmente el OPEX elécrtico de tus operaciones desde el primer mes de encendido.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Respaldo continuo de la red:</strong> Si hay picos de demanda y el sol no basta, la red te complementa sin un microsegundo de cortes.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-red-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                                <div>
                                    <strong className="text-white">Compensación y excedentes:</strong> Posibilidad de amortizar o vender la recarga marginal que generes y no autoconsumas dentro de la red.
                                </div>
                            </li>
                        </ul>

                        <div className="bg-red-500/10 group-hover:bg-primary/10 border-l-4 border-red-500 group-hover:border-primary transition-colors rounded-r-xl p-5 mb-8">
                            <p className="text-red-400 group-hover:text-primary transition-colors font-medium">
                                Ideal si: Ya pagas facturas de luz para tus instalaciones y el objetivo principal es mejorar tus costes operativos.
                            </p>
                        </div>

                        <Link
                            to="/categoria/kits-scl-conexion-red"
                            className="mt-auto block w-full text-center py-4 bg-red-500 hover:bg-red-600 group-hover:bg-primary group-hover:hover:bg-primary/90 group-hover:text-secondary text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Ver Kits Conexión a Red
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
