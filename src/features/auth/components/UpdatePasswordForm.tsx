import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { type ResetPasswordFormData, resetPasswordSchema } from '../schemas';

export function UpdatePasswordForm() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm text-center">
                <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Contraseña Actualizada</h2>
                <p className="text-slate-400 mb-6">
                    Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página principal en breve.
                </p>
                <Link
                    to="/"
                    className="inline-flex justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
                >
                    Ir al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Actualizar Contraseña
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    Ingresa tu nueva contraseña para acceder a tu cuenta.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                            Nueva Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                        'Actualizar Contraseña'
                    )}
                </button>
            </form>
        </div>
    );
}
