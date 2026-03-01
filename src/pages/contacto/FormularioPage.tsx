import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function FormularioPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center">
            {/* Header Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center w-full max-w-3xl mb-12"
            >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-heading tracking-tight">
                    Contacto y Presupuestos
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8">
                    Nuestro equipo de técnicos e ingenieros está a tu completa disposición <strong className="text-white font-semibold">¡Será un placer atenderte!</strong>
                </p>

                <div className="inline-block border-2 border-primary/50 text-primary px-8 py-3 rounded-xl font-mono text-xl font-bold bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                    <span className="flex items-center gap-3">
                        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        teléfono: 641 322 236
                    </span>
                </div>
            </motion.div>

            {/* Form Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl bg-secondary/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Decorative gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-16 text-center z-10 relative flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <Check className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">¡Mensaje enviado!</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md">
                            Hemos recibido tu solicitud correctamente. Nuestro equipo se pondrá en contacto contigo muy pronto.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                            Enviar otro mensaje
                        </Button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">
                                    Nombre <span className="text-red-400">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    placeholder="Tu nombre completo"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">
                                    Teléfono <span className="text-red-400">*</span>
                                </label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    placeholder="+34 600 000 000"
                                />
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">
                                Correo electrónico <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                placeholder="tu@email.com"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">
                                ¿Cómo prefieres que te contactemos?
                            </label>
                            <select className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium appearance-none cursor-pointer">
                                <option value="telefono">Teléfono</option>
                                <option value="email">Correo electrónico</option>
                                <option value="whatsapp">WhatsApp</option>
                            </select>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">
                                Cuéntanos cómo podemos ayudarte
                            </label>
                            <textarea
                                rows={4}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium resize-none"
                                placeholder="Detalla tu consulta o proyecto aquí..."
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 flex-shrink-0">
                                    <input
                                        required
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 focus:ring-offset-0 focus:ring-offset-secondary transition-colors cursor-pointer"
                                    />
                                </div>
                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                    <strong className="text-slate-300 font-medium">Acuerdo RGPD <span className="text-red-400">*</span></strong>
                                    <br />
                                    He leído y acepto la Política de privacidad
                                </span>
                            </label>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4">
                            <Button
                                type="submit"
                                className="w-full py-4 text-lg font-bold min-h-[56px] rounded-xl flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-b-2 border-secondary rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Enviar mensaje
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
