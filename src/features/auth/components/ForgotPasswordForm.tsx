import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { type ForgotPasswordFormData, forgotPasswordSchema } from '../schemas';

interface ForgotPasswordFormProps {
    embedded?: boolean;
}

export function ForgotPasswordForm({ embedded = false }: ForgotPasswordFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al enviar el correo de recuperación');
        } finally {
            setLoading(false);
        }
    };

    const containerClasses = embedded
        ? "w-full max-w-md space-y-8 p-8"
        : "w-full max-w-md space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm";

    if (success) {
        return (
            <div className={containerClasses}>
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                        Revisa tu correo
                    </h2>
                    <p className="text-sm text-slate-400 mb-8">
                        Te hemos enviado un enlace para que puedas recuperar tu contraseña.
                        Revisa también tu carpeta de spam si no lo encuentras.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex justify-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Recuperar Contraseña
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            placeholder="tu@email.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-400">Error</h3>
                                <div className="mt-2 text-sm text-red-300">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Enviar Enlace'
                    )}
                </button>

                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </div>
    );
}
