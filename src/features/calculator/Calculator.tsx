import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GlassContainer } from '../../components/common/GlassContainer';
import { LucideZap, Sun, TrendingUp, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Calculator() {
    const [step, setStep] = useState<'input' | 'simulating' | 'result'>('input');
    const [bill, setBill] = useState('');
    const [zip, setZip] = useState('');

    const handleSimulate = () => {
        if (!bill || !zip) return;
        setStep('simulating');

        // Fake simulation delay
        setTimeout(() => {
            setStep('result');
        }, 2000);
    };

    const reset = () => {
        setStep('input');
        setBill('');
        setZip('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <GlassContainer className="p-8 md:p-12 text-center space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-bold">
                                    Design Your <span className="text-primary">Energy System</span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                    AI-powered sizing based on your consumption and location.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-medium text-slate-300">Monthly Bill (€)</label>
                                    <input
                                        type="number"
                                        value={bill}
                                        onChange={(e) => setBill(e.target.value)}
                                        placeholder="120"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-2xl text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-medium text-slate-300">Zip Code</label>
                                    <input
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        placeholder="28001"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-2xl text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleSimulate}
                                disabled={!bill || !zip}
                                className="w-full max-w-sm text-lg"
                            >
                                Analyze Potential <LucideZap className="ml-2" />
                            </Button>
                        </GlassContainer>
                    </motion.div>
                )}

                {step === 'simulating' && (
                    <motion.div
                        key="simulating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 border-t-4 border-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sun className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-8 text-xl text-slate-300 font-mono animate-pulse">
                            Calculating Irradiance...
                        </p>
                    </motion.div>
                )}

                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Result Card */}
                            <Card variant="glass" className="md:col-span-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none -mr-16 -mt-16"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Recommended System
                                        </span>
                                    </div>

                                    <h3 className="text-4xl font-bold mb-2">Hybrid 6.0kW</h3>
                                    <p className="text-slate-400 mb-8">
                                        Based on your €{bill}/mo consumption, this system covers 92% of your energy needs.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <div className="text-slate-400 text-sm mb-1">Annual Savings</div>
                                            <div className="text-2xl font-bold text-accent">€1,240</div>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <div className="text-slate-400 text-sm mb-1">Payback Period</div>
                                            <div className="text-2xl font-bold text-white">4.2 Years</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button size="lg" className="flex-1">
                                            Configure System
                                        </Button>
                                        <Button variant="outline" size="lg" onClick={reset}>
                                            Recalculate
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Specs */}
                            <div className="space-y-6">
                                <Card className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                                        <Sun className="h-6 w-6 text-yellow-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Solar Power</div>
                                        <div className="font-bold">14 x 450W</div>
                                    </div>
                                </Card>

                                <Card className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Battery className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Battery Storage</div>
                                        <div className="font-bold">5.0 kWh</div>
                                    </div>
                                </Card>

                                <Card className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Grid Independence</div>
                                        <div className="font-bold text-green-500">92%</div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
