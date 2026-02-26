import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { Layout } from '../components/layout/Layout';

export function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-foreground">Tu Carrito</h1>
                        <p className="text-muted-foreground mt-1">Revisa tus productos antes de finalizar la compra.</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-secondary/30 rounded-3xl border border-white/5 shadow-xl">
                        <ShoppingBag className="w-24 h-24 mx-auto mb-6 opacity-20 text-slate-400" />
                        <h2 className="text-2xl font-bold font-heading mb-4 text-foreground">Tu carrito está vacío</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            No tienes ningún sistema solar en tu carrito. Descubre nuestra gama de productos y empieza a ahorrar hoy mismo.
                        </p>
                        <Link to="/#productos">
                            <Button className="py-6 px-8 text-lg rounded-xl">
                                Explorar Catálogo
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Items Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold font-heading text-foreground">Productos ({items.length})</h3>
                                <button
                                    onClick={clearCart}
                                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Vaciar Carrito
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-secondary/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="w-full sm:w-32 h-32 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/5">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Zap className="w-12 h-12 text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-lg text-foreground mb-1 pr-6">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {item.type === 'hybrid' ? 'Sistema Híbrido' : 'Conexión a Red'} • {item.total_power} kW
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 bg-black/20 rounded-xl p-1.5 border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-base font-mono font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-xl font-bold font-mono text-primary">
                                                    {(item.price * item.quantity).toLocaleString()}€
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1 border border-border/50 rounded-3xl p-8 bg-card/40 backdrop-blur-xl sticky top-24 shadow-2xl">
                            <h3 className="text-2xl font-bold font-heading mb-6 border-b border-white/10 pb-4">Resumen de Pedido</h3>

                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-foreground">{subtotal.toLocaleString()}€</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Envío</span>
                                    <span className="text-accent uppercase font-bold text-xs">Gratis</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Impuestos</span>
                                    <span>Calculados en el checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-medium text-foreground">Total</span>
                                    <span className="text-4xl font-bold font-mono text-foreground leading-none">
                                        {subtotal.toLocaleString()}€
                                    </span>
                                </div>
                                <div className="text-xs text-primary mt-3 flex items-center gap-1 justify-end">
                                    Financiación disponible desde ~{(subtotal / 60).toFixed(2)}€/mes
                                </div>
                            </div>

                            <Button className="w-full py-6 text-lg rounded-xl mb-4 group shadow-lg shadow-primary/20 hover:shadow-primary/30">
                                Proceder al Checkout
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <div className="space-y-3 mt-8">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                    <span>Pago 100% seguro y encriptado</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-xl">
                                    <Zap className="w-5 h-5 text-primary" />
                                    <span>Soporte técnico premium incluido</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
