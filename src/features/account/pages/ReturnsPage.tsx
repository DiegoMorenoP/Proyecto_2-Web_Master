import { useEffect, useState } from 'react';
import { RotateCcw, AlertCircle, Calendar, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { accountService } from '../services/accountService';
import type { Order } from '../types';
import { Layout } from '../../../components/layout/Layout';
import { Button } from '../../../components/common/Button';

const DUMMY_RETURNABLE_ORDERS: Order[] = [
    {
        id: 'ORD-2026-X7Y9',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'delivered',
        total_amount: 14500.50,
        shipping_address: 'Calle Mayor 123, 28001 Madrid, España',
        notes: null,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // Hace 15 días (elegible, < 30)
    },
    {
        id: 'ORD-2026-A1B2',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'delivered',
        total_amount: 850.00,
        shipping_address: 'Calle San Juan 45, 46001 Valencia, España',
        notes: 'Inversor',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Hace 5 días (elegible)
    }
];

export function ReturnsPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDeliveredOrders = async () => {
            try {
                setLoading(true);

                if (!user) {
                    setOrders(DUMMY_RETURNABLE_ORDERS.filter(o => o.status === 'delivered'));
                    return;
                }
                const data = await accountService.fetchUserOrders(user.id);

                // Si no hay datos, mostramos los dummy para testing
                let delivered = [];
                if (data.length === 0) {
                    delivered = DUMMY_RETURNABLE_ORDERS.filter(o => o.status === 'delivered');
                } else {
                    // Solo mostrar pedidos entregados que teóricamente se pueden devolver
                    delivered = data.filter(o => o.status === 'delivered');
                }

                setOrders(delivered);
            } catch (err: any) {
                console.error('Error fetching orders for returns:', err);
                setError(err.message || 'Error al cargar los pedidos entregados');
            } finally {
                setLoading(false);
            }
        };

        loadDeliveredOrders();
    }, [user]);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-80px)]">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <RotateCcw className="w-8 h-8 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">Devoluciones</h1>
                            <p className="text-slate-400 mt-1">Gestiona garantías y devoluciones de tus equipos.</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Lista de Pedidos a Devolver */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold font-heading text-white mb-4">Pedidos Elegibles</h2>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-secondary/30 rounded-2xl border border-white/5">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
                                <p>{error}</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16 px-4 bg-secondary/30 rounded-3xl border border-white/5">
                                <RotateCcw className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-400" />
                                <h3 className="text-lg font-bold text-white mb-2">No hay pedidos para devolver</h3>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                    Actualmente no tienes ningún pedido entregado que esté dentro del periodo de devolución.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-secondary/40 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-white font-mono uppercase">#{order.id.split('-')[0]}</span>
                                                <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300">Entregado</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                Fecha de compra: {new Date(order.created_at).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>
                                        <Button variant="outline" className="text-sm shrink-0 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10">
                                            Solicitar Devolución
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información de Política */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-secondary/50 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-primary" />
                                Política de Devoluciones
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Dispones de <strong>30 días</strong> naturales desde la recepción para devolver equipos fotovoltaicos.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Los productos deben estar en su <strong>embalaje original</strong> y no haber sido instalados.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Para gestionar la garantía (hasta 25 años en paneles), contacta directamente con soporte.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">¿Necesitas ayuda técnica?</h3>
                            <p className="text-sm text-slate-400 mb-6">
                                Nuestro equipo de ingenieros puede ayudarte a resolver problemas sin necesidad de devolver el equipo.
                            </p>
                            <div className="space-y-3">
                                <a href="tel:+34900000000" className="flex items-center gap-3 text-sm text-white hover:text-primary transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    900 000 000
                                </a>
                                <a href="mailto:soporte@solargen.es" className="flex items-center gap-3 text-sm text-white hover:text-primary transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    soporte@solargen.es
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
