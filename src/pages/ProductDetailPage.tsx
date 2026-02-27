import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loader2, ArrowLeft, Check, Shield, Zap, TrendingUp } from 'lucide-react';
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

            // Try 'kits' table first
            const { data: kitsData, error: kitsError } = await supabase
                .from('kits')
                .select('*')
                .eq('id', id)
                .single();

            if (!kitsError && kitsData) {
                setKit(kitsData as Kit);
                setLoading(false);
                return;
            }

            // Fallback: try 'products' table
            const { data: prodsData, error: prodsError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (!prodsError && prodsData) {
                setKit(prodsData as Kit);
            }
            setLoading(false);
        }
        fetchKit();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center bg-background">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!kit) {
        return (
            <div className="min-h-screen pt-32 text-center text-foreground container mx-auto px-4 bg-background">
                <h2 className="text-2xl font-bold font-heading">Producto no encontrado</h2>
                <Link to="/" className="text-primary hover:underline mt-4 block">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 animate-fade-in bg-background">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver al catálogo
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Image & Specs */}
                <div className="space-y-8 animate-slide-up">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-secondary border border-border/50 relative shadow-2xl">
                        {kit.image_url ? (
                            <img src={kit.image_url} alt={kit.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                                <Zap className="w-32 h-32 text-slate-700" />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6">
                            <Badge variant="success" className="bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg border-0 px-4 py-1.5 text-sm font-bold">
                                {kit.type === 'hybrid' ? 'Tecnología Híbrida' : 'Conexión a Red'}
                            </Badge>
                        </div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                        <h3 className="text-lg font-bold font-heading text-foreground mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Especificaciones Técnicas
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-secondary/30 rounded-xl border border-border/30">
                                <div className="text-sm text-muted-foreground mb-1">Potencia Total</div>
                                <div className="text-2xl font-mono text-primary font-bold">{kit.total_power} kW</div>
                            </div>
                            <div className="p-4 bg-secondary/30 rounded-xl border border-border/30">
                                <div className="text-sm text-muted-foreground mb-1">Tipo de Sistema</div>
                                <div className="text-xl font-bold text-foreground capitalize">{kit.type}</div>
                            </div>
                            <div className="p-4 bg-secondary/30 rounded-xl border border-border/30">
                                <div className="text-sm text-muted-foreground mb-1">Garantía</div>
                                <div className="text-xl font-bold text-foreground">25 Años</div>
                            </div>
                            <div className="p-4 bg-secondary/30 rounded-xl border border-border/30">
                                <div className="text-sm text-muted-foreground mb-1">Financiación</div>
                                <div className="text-xl font-bold text-foreground">Disponible</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Buying Info */}
                <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">Disponibilidad Inmediata</Badge>
                            {kit.stock && kit.stock < 5 && (
                                <Badge variant="destructive" className="animate-pulse">¡Quedan {kit.stock}!</Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6 leading-tight max-w-xl">{kit.name}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {kit.description || "Sistema solar de alto rendimiento diseñado para maximizar el autoconsumo y reducir tu factura eléctrica desde el primer día."}
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="p-8 rounded-3xl bg-secondary/40 backdrop-blur-xl border border-border/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-end gap-3 mb-2">
                                <span className="text-5xl md:text-6xl font-bold font-mono text-foreground tracking-tighter">{Math.round(kit.monthly_finance_cost || 0)}€</span>
                                <span className="text-xl text-muted-foreground mb-2">/ mes</span>
                            </div>
                            <div className="text-sm text-primary mb-8 font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Financiación flexible a 60 meses
                            </div>

                            <div className="pt-6 border-t border-border/30 mb-8 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Precio al contado</span>
                                    <span className="text-xl font-bold text-foreground font-mono">{kit.price.toLocaleString()}€</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-accent">Ahorro estimado (25 años)</span>
                                    <span className="text-accent font-bold font-mono">~{(kit.price * 2.5).toLocaleString()}€</span>
                                </div>
                            </div>

                            <Button
                                className="w-full py-7 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
                                onClick={() => kit && addItem(kit)}
                            >
                                <Zap className="w-5 h-5 mr-2 fill-current" />
                                Añadir al Carrito
                            </Button>
                            <div className="text-center mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <Shield className="w-3 h-3" />
                                Incluye instalación certificada y legalización
                            </div>
                        </div>
                    </div>

                    {/* Compatibility / Trust */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 text-muted-foreground p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-foreground font-medium">Garantía Total</span>
                                <span className="text-sm">Cubrimos producción y mano de obra por 25 años.</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                <Check className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-foreground font-medium">Compatibilidad Universal</span>
                                <span className="text-sm">Funciona con baterías Huawei, Tesla y LG.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
