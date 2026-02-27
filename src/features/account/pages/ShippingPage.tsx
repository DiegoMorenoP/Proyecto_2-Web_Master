import { useEffect, useState } from 'react';
import { Truck, PackageCheck, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { accountService } from '../services/accountService';
import type { Order } from '../types';
import { Layout } from '../../../components/layout/Layout';
import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';

const DUMMY_SHIPPING_ORDERS: Order[] = [
    {
        id: 'ORD-2026-P4K2',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'shipped',
        total_amount: 8250.00,
        shipping_address: 'Av. Diagonal 456, 08006 Barcelona, España',
        notes: null,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // Hace 3 días
    },
    {
        id: 'ORD-2026-M8N5',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'processing',
        total_amount: 3100.25,
        shipping_address: 'Plaza Nueva 1, 41001 Sevilla, España',
        notes: 'Instalación programada para el martes',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // Ayer
    },
    {
        id: 'ORD-2026-X7Y9',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'delivered',
        total_amount: 14500.50,
        shipping_address: 'Calle Mayor 123, 28001 Madrid, España',
        notes: null,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // Hace 45 días
    }
];

export function ShippingPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadShipping = async () => {
            try {
                setLoading(true);

                if (!user) {
                    setOrders(DUMMY_SHIPPING_ORDERS.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status)));
                    return;
                }
                const data = await accountService.fetchUserOrders(user.id);

                // Si no hay datos, mostramos los dummy para testing
                let activeShippings = [];
                if (data.length === 0) {
                    activeShippings = DUMMY_SHIPPING_ORDERS.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status));
                } else {
                    activeShippings = data.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status));
                }

                setOrders(activeShippings);
            } catch (err: any) {
                console.error('Error fetching shipping data:', err);
                setError(err.message || 'Error al cargar los envíos');
            } finally {
                setLoading(false);
            }
        };

        loadShipping();
    }, [user]);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-80px)]">
                <div className="mb-8 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <Truck className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">Mis Envíos</h1>
                        <p className="text-slate-400 mt-1">Realiza el seguimiento de tus pedidos en curso.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-slate-400">Consultando estado de envíos...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
                        <p>{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-secondary/30 rounded-3xl border border-white/5 shadow-xl">
                        <PackageCheck className="w-24 h-24 mx-auto mb-6 opacity-20 text-slate-400" />
                        <h2 className="text-2xl font-bold font-heading mb-4 text-white">No hay envíos activos</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Tus pedidos han sido entregados o aún no han entrado en la fase de preparación.
                        </p>
                        <Link to="/orders">
                            <Button variant="outline" className="py-6 px-8 text-lg rounded-xl">
                                Ver todos mis pedidos
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => {
                            const isShipped = order.status === 'shipped' || order.status === 'delivered';
                            const isDelivered = order.status === 'delivered';
                            return (
                                <div key={order.id} className="bg-secondary/40 border border-white/5 rounded-2xl p-6 lg:p-8">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white font-mono">PEDIDO #{order.id.split('-')[0].toUpperCase()}</h3>
                                            <p className="text-sm text-slate-400">Llegada estimada: {isDelivered ? 'Entregado' : 'Próximamente'}</p>
                                        </div>
                                        {order.shipping_address && (
                                            <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2 rounded-lg">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                {order.shipping_address}
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative">
                                        {/* Background line */}
                                        <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-white/10 z-0"></div>

                                        {/* Progress line */}
                                        <div
                                            className="hidden sm:block absolute top-6 left-6 h-0.5 bg-blue-500 z-0 transition-all duration-1000"
                                            style={{ width: isDelivered ? '100%' : isShipped ? '50%' : '10%' }}
                                        ></div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                                            {/* Phase 1: Processing */}
                                            <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-secondary border-4 border-secondary/80 shrink-0">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm sm:text-base">En preparación</div>
                                                    <div className="text-xs text-slate-400">Revisando tu pedido</div>
                                                </div>
                                            </div>

                                            {/* Phase 2: Shipped */}
                                            <div className={`flex sm:flex-col items-center gap-4 sm:gap-3 sm:justify-center ${!isShipped ? 'opacity-40 grayscale' : ''}`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-secondary/80 shrink-0 ${isShipped ? 'bg-blue-500 text-secondary' : 'bg-slate-800 text-slate-400'}`}>
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <div className="sm:text-center">
                                                    <div className="font-bold text-white text-sm sm:text-base">En camino</div>
                                                    <div className="text-xs text-slate-400">El transportista lo ha recogido</div>
                                                </div>
                                            </div>

                                            {/* Phase 3: Delivered */}
                                            <div className={`flex sm:flex-col items-center gap-4 sm:gap-3 sm:justify-end ${!isDelivered ? 'opacity-40 grayscale' : ''}`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-secondary/80 shrink-0 sm:ml-auto ${isDelivered ? 'bg-green-500 text-secondary' : 'bg-slate-800 text-slate-400'}`}>
                                                    <PackageCheck className="w-5 h-5" />
                                                </div>
                                                <div className="sm:text-right w-full">
                                                    <div className="font-bold text-white text-sm sm:text-base">Entregado</div>
                                                    <div className="text-xs text-slate-400">Paquete en destino</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
