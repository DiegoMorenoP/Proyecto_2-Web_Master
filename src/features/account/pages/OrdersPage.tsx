import { useEffect, useState } from 'react';
import { Package, ChevronRight, Calculator, CalendarClock } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { accountService } from '../services/accountService';
import type { Order } from '../types';
import { Layout } from '../../../components/layout/Layout';
import { Button } from '../../../components/common/Button';
import { Link } from 'react-router-dom';

const DUMMY_ORDERS: Order[] = [
    {
        id: 'ORD-2026-X7Y9',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'delivered',
        total_amount: 14500.50,
        shipping_address: 'Calle Mayor 123, 28001 Madrid, España',
        notes: null,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // Hace 45 días
    },
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
        id: 'ORD-2026-J9H3',
        company_id: 'dummy',
        user_id: 'dummy',
        status: 'cancelled',
        total_amount: 150.00,
        shipping_address: 'Calle Alfonso I 45, 50003 Zaragoza, España',
        notes: 'Cancelado por el usuario',
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // Hace 3 meses
    }
];

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
        case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'processing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
};

const getStatusText = (status: Order['status']) => {
    switch (status) {
        case 'draft': return 'Borrador';
        case 'pending': return 'Pendiente';
        case 'processing': return 'En proceso';
        case 'shipped': return 'Enviado';
        case 'delivered': return 'Entregado';
        case 'cancelled': return 'Cancelado';
        default: return status;
    }
};

export function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                if (!user) {
                    setOrders(DUMMY_ORDERS);
                    return;
                }
                const data = await accountService.fetchUserOrders(user.id);
                // Si no hay datos, mostramos los dummy para testing
                if (data.length === 0) {
                    setOrders(DUMMY_ORDERS);
                } else {
                    setOrders(data);
                }
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Error al cargar los pedidos');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-80px)]">
                <div className="mb-8 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                        <Package className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">Mis Pedidos</h1>
                        <p className="text-slate-400 mt-1">Historial completo de tus compras e instalaciones.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-slate-400">Cargando tus pedidos...</p>
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
                        <Calculator className="w-24 h-24 mx-auto mb-6 opacity-20 text-slate-400" />
                        <h2 className="text-2xl font-bold font-heading mb-4 text-white">Aún no tienes pedidos</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Empieza a ahorrar energía hoy mismo explorando nuestros sistemas solares y opciones de instalación.
                        </p>
                        <Link to="/#productos">
                            <Button className="py-6 px-8 text-lg rounded-xl">
                                Explorar Catálogo
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-secondary/40 border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 group cursor-pointer hover:bg-secondary/60">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-white font-mono uppercase">
                                                #{order.id.split('-')[0]}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <CalendarClock className="w-4 h-4" />
                                            {new Intl.DateTimeFormat('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).format(new Date(order.created_at))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:border-l border-white/10 sm:pl-6">
                                        <div className="text-left sm:text-right">
                                            <div className="text-sm text-slate-400 mb-1">Total del pedido</div>
                                            <div className="text-2xl font-bold font-mono text-primary">
                                                {order.total_amount.toLocaleString('es-ES')}€
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all">
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-secondary transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
