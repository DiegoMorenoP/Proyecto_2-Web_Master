import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Maximize2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 z-[100] h-full w-full max-w-md bg-secondary border-l border-white/10 shadow-2xl flex flex-col"

                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Tu Cesta
                            </h2>
                            <div className="flex items-center gap-4">
                                {items.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                        title="Vaciar todo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Vaciar</span>
                                    </button>
                                )}
                                <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                                    <button
                                        onClick={() => {
                                            toggleCart();
                                            navigate('/cart');
                                        }}
                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                        title="Ampliar a pantalla completa"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={toggleCart}
                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                        title="Cerrar carrito"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Tu cesta está vacía.</p>
                                    <Button variant="outline" className="mt-6" onClick={toggleCart}>
                                        Volver a la tienda
                                    </Button>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-20 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image_url && (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-sm mb-1">{item.name}</h3>
                                            <p className="text-primary font-mono">{item.price.toLocaleString()}€</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-white text-slate-400 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-white text-slate-400 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-2xl font-bold text-white font-mono">
                                        {subtotal.toLocaleString()}€
                                    </span>
                                </div>
                                <Button className="w-full py-6 text-lg group">
                                    Tramitar Pedido
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
