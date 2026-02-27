import { useEffect, useState } from 'react';
import { User, Mail, Link as LinkIcon, Building2, Save, Loader2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { accountService } from '../services/accountService';
import type { ProfileFormData } from '../types';
import { Layout } from '../../../components/layout/Layout';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../components/common/Toast';

export function ProfilePage() {
    const { user, profile } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<ProfileFormData>({
        username: '',
        full_name: '',
        website: '',
        avatar_url: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                full_name: profile.full_name || '',
                website: profile.website || '',
                avatar_url: profile.avatar_url || ''
            });
        } else if (!user) {
            // Dummy data for visual demo when not authenticated
            setFormData({
                username: 'invitado_demo',
                full_name: 'Usuario Visitante (Demo)',
                website: 'https://ejemplo.com',
                avatar_url: 'https://i.pravatar.cc/150?u=demo'
            });
        }
    }, [profile, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast('Perfil actualizado correctamente (Modo Demo)', 'success');
            return;
        }

        try {
            setIsSaving(true);
            await accountService.updateUserProfile(user.id, formData);
            showToast('Perfil actualizado correctamente', 'success');
            // Nota: Aquí se podría forzar un refresco del contexto Auth,
            // pero el onAuthStateChange en AuthContext podría no detectar
            // cambios en la tabla profiles automáticamente.
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            showToast(error.message || 'Error al actualizar el perfil', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Removed if (!user) return null; to allow demo viewing

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-80px)]">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">Mi Perfil</h1>
                            <p className="text-slate-400 mt-1">Gestiona tu información personal y configuración de cuenta.</p>
                        </div>
                    </div>

                    <div className="bg-secondary/40 border border-white/5 rounded-3xl overflow-hidden">
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-r from-slate-800 to-secondary relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-secondary flex items-center justify-center overflow-hidden relative group">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-slate-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Edit3 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-16">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="full_name" className="text-sm font-medium text-slate-300">
                                            Nombre Completo
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                id="full_name"
                                                name="full_name"
                                                value={formData.full_name || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                                                placeholder="Ej: Laura Martínez"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="username" className="text-sm font-medium text-slate-300">
                                            Nombre de usuario
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                                                placeholder="Ej: laura_mtz"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-300">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={user?.email || 'demo@solargen.es'}
                                                disabled
                                                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">El correo electrónico no se puede cambiar directamente.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="website" className="text-sm font-medium text-slate-300">
                                            Sitio Web
                                        </label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="url"
                                                id="website"
                                                name="website"
                                                value={formData.website || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                                                placeholder="https://ejemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="avatar_url" className="text-sm font-medium text-slate-300">
                                            URL de la imagen de perfil (Avatar)
                                        </label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="url"
                                                id="avatar_url"
                                                name="avatar_url"
                                                value={formData.avatar_url || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                                                placeholder="https://ejemplo.com/avatar.jpg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/5 my-8"></div>

                                {/* Company Info Section (Read Only Example) */}
                                {profile?.company_id && (
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            Datos de Empresa
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Tu perfil está asociado a una cuenta de instalador/empresa.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-500 block mb-1">Rol de usuario</span>
                                                <span className="text-white font-medium capitalize">{profile.role}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block mb-1">ID de Empresa Asociada</span>
                                                <span className="text-white font-mono">{profile.company_id.split('-')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="min-w-[140px]"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
