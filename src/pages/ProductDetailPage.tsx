import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loader2, ArrowLeft, Check, Shield, Zap } from 'lucide-react';
import type { Kit } from '../types';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [kit, setKit] = useState<Kit | null>(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        async function fetchKit() {
            if (!id) return;

            // Since we don't have a single "getById" service yet, raw fetch is fine for now
            // Ideally we move this to CatalogService
            const { data, error } = await supabase
                .from('kits')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setKit(data as Kit);
            }
            setLoading(false);
        }
        fetchKit();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!kit) {
        return (
            <div className="min-h-screen pt-32 text-center text-white">
                <h2 className="text-2xl font-bold">Producto no encontrado</h2>
                <Link to="/" className="text-primary hover:underline mt-4 block">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al catálogo
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Image & Specs */}
                <div className="space-y-8">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-white/10 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-32 h-32 text-slate-700" />
                        </div>
                        {/* If we had a real image url: <img src={kit.image_url} ... /> */}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Especificaciones Técnicas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-1">Potencia Total</div>
                                <div className="text-xl font-mono text-primary">{kit.total_power} kW</div>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-1">Tipo de Sistema</div>
                                <div className="text-xl font-bold text-white capitalize">{kit.type}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Buying Info */}
                <div className="space-y-8">
                    <div>
                        <Badge variant="success" className="mb-4">Disponibilidad Inmediata</Badge>
                        <h1 className="text-4xl font-bold text-white mb-4">{kit.name}</h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            {kit.description || "Sistema solar de alto rendimiento diseñado para maximizar el autoconsumo y reducir tu factura eléctrica desde el primer día."}
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-white">{kit.monthly_finance_cost}€</span>
                                <span className="text-xl text-slate-400 mb-1">/ mes</span>
                            </div>
                            <div className="text-sm text-primary mb-8 font-medium">
                                Financiación flexible a 60 meses
                            </div>

                            <div className="pt-6 border-t border-white/10 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Precio al contado</span>
                                    <span className="text-2xl font-bold text-white">{kit.price}€</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-emerald-400">Ahorro estimado (25 años)</span>
                                    <span className="text-emerald-400 font-bold">~12.500€</span>
                                </div>
                            </div>

                            <Button className="w-full py-6 text-lg" onClick={() => kit && addItem(kit)}>
                                Añadir al Carrito
                            </Button>
                            <div className="text-center mt-4 text-xs text-slate-500">
                                Incluye instalación certificada y legalización
                            </div>
                        </div>
                    </div>

                    {/* Compatibility / Trust */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <Shield className="w-5 h-5 text-primary" />
                            <span>Garantía de producción 25 años</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Compatible con baterías Huawei Luna2000</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Monitorización app móvil incluida</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
