import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, LucideZap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
    id: 'init-1',
    text: "¡Hola! Soy Catbot 🐱⚡️. ¿En qué te puedo ayudar hoy? Pregúntame sobre kits, instalación o ahorro.",
    sender: 'bot',
    timestamp: new Date()
};

export function Catbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const [showChat, setShowChat] = useState(false);

    // Track scroll to hide entire chat on hero section
    useEffect(() => {
        const handleScroll = () => {
            // Show chat only after scrolling down 500px (past hero)
            setShowChat(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const hasInteracted = messages.some(m => m.sender === 'user');

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Prepare history for context
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('chat-ai', {
                body: { messages: [...history, { role: 'user', content: userMsg.text }] }
            });

            if (error) {
                console.error('Supabase Function Error:', error);
                throw error;
            }

            const botResponse = data.reply || "Miau... algo falló en mis circuitos solares. 😿";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            const errorMessage = error.message || "Error desconocido";
            const displayError = errorMessage === "Failed to fetch"
                ? "No se pudo conectar con el servidor (¿está corriendo?). 🔌"
                : `Error del servidor: ${errorMessage}`;

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: displayError,
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Click Outside Backdrop - Invisible but captures clicks */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[45]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Animated Chat Button Container */}
            <AnimatePresence>
                {(showChat || isOpen) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, rotate: 180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0, rotate: -180 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2"
                    >

                        {/* AI Label - floating above */}
                        <AnimatePresence>
                            {!isOpen && !hasInteracted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{
                                        opacity: [1, 0.7, 1],
                                        scale: 1,
                                        y: [0, -5, 0],
                                    }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                    className="absolute -top-14 -right-2 bg-zinc-900/90 backdrop-blur-md border border-white/10 text-zinc-100 text-xs font-bold px-3 py-2 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <span className="relative flex h-2 w-2 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <div className="flex flex-col items-start text-left leading-tight">
                                        <span>Ask AI</span>
                                        <span>Assistant</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            {/* Softer Breathing/Ripple Effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-primary/20 rounded-full blur-sm"
                            />

                            {/* Main Button */}
                            <motion.button
                                layout
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className={cn(
                                    "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-50", // z-50 to stay above backdrop
                                    isOpen
                                        ? "bg-zinc-800 text-white rotate-90"
                                        : "bg-gradient-to-tr from-primary via-yellow-400 to-yellow-200 text-black border-4 border-black/50"
                                )}
                            >
                                {isOpen ? (
                                    <X className="w-8 h-8" />
                                ) : (
                                    <div className="relative">
                                        <Bot className="w-8 h-8" />
                                        <motion.div
                                            animate={{
                                                opacity: [0.6, 1, 0.6],
                                                scale: [0.9, 1.1, 0.9]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute -top-1 -right-1"
                                        >
                                            <LucideZap className="w-4 h-4 text-white fill-white drop-shadow-md" />
                                        </motion.div>
                                    </div>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Catbot Assistant</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.sender === 'user' ? "bg-slate-700" : "bg-primary/20"
                                    )}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.sender === 'user'
                                            ? "bg-primary text-secondary font-medium rounded-tr-none"
                                            : "bg-white/10 text-slate-200 rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu pregunta..."
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <Button
                                    size="sm"
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="rounded-xl w-10 h-10 p-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
