import { useState, useMemo } from 'react';
import { Sun, Battery, DollarSign, ArrowRight, Leaf, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const SolarCalculator = () => {
    const [bill, setBill] = useState(150);
    const [sunHours, setSunHours] = useState(5);

    // Constants for Spain (approximate)
    const ELECTRICITY_PRICE = 0.20; // €/kWh
    const PANEL_WATTAGE = 450; // W
    const SYSTEM_COST_PER_KW = 1100; // € (installed)
    const CO2_PER_KWH = 0.3; // kg
    const TREES_PER_TON_CO2 = 45; // trees per ton
    const ANNUAL_INFLATION = 0.03; // 3% electricity price increase
    const FINANCING_RATE = 0.065; // 6.5% interest
    const FINANCING_YEARS = 10;

    const data = useMemo(() => {
        // 1. Calculate Consumption
        const monthlyKwh = bill / ELECTRICITY_PRICE;
        const annualKwh = monthlyKwh * 12;

        // 2. System Sizing (Target ~100% offset if possible, capped by roof/regulations usually, here simple)
        // Required Annual Generation = Annual kWh
        // Installed kWp = Annual kWh / (Sun Hours * 365 * Efficiency)
        // Efficiency factor ~ 0.75 (performance ratio)
        const requiredKwp = annualKwh / (sunHours * 365 * 0.75);
        const panelCount = Math.ceil((requiredKwp * 1000) / PANEL_WATTAGE);
        const systemSizeKw = (panelCount * PANEL_WATTAGE) / 1000;

        // 3. Financials
        const totalSystemCost = systemSizeKw * SYSTEM_COST_PER_KW;

        // Monthly financing payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
        const monthlyRate = FINANCING_RATE / 12;
        const numPayments = FINANCING_YEARS * 12;
        const loanPayment = (totalSystemCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Savings
        const initialAnnualSavings = annualKwh * ELECTRICITY_PRICE;
        const initialMonthlySavings = initialAnnualSavings / 12;

        // Net Monthly (Positive Cash Flow)
        // We assume they stop paying the utility bill (mostly) and pay the loan instead.
        // Remnant utility bill (fixed costs) not calculated here for simplicity's sake, assuming near 100% offset.
        const netMonthlyBenefit = initialMonthlySavings - loanPayment;

        // ROI & Payback
        const paybackYears = totalSystemCost / initialAnnualSavings;
        const roi = ((initialAnnualSavings * 25 - totalSystemCost) / totalSystemCost) * 100; // 25 year lifetime

        // 4. Environmental
        const annualCo2SavedKg = annualKwh * CO2_PER_KWH;
        const annualTrees = (annualCo2SavedKg / 1000) * TREES_PER_TON_CO2;

        return {
            panelCount,
            systemSizeKw,
            totalSystemCost,
            loanPayment,
            initialMonthlySavings,
            netMonthlyBenefit,
            paybackYears,
            roi,
            annualCo2SavedKg,
            annualTrees
        };
    }, [bill, sunHours]);

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <Sun className="text-primary w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-sans tracking-tight text-white">Simulador de Precisión</h2>
                            <p className="text-slate-400 text-sm">Ajusta el consumo para dimensionar el sistema fotovoltaico.</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* INPUTS SECTION */}
                    <div className="lg:col-span-4 space-y-8 bg-white/5 p-6 rounded-2xl h-fit">
                        {/* Bill Input */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Factura Mensual Actual</span>
                                <span className="text-3xl font-bold text-primary">{bill}€</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="600"
                                step="10"
                                value={bill}
                                onChange={(e) => setBill(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                            <div className="flex justify-between text-xs text-slate-500 font-mono">
                                <span>50€</span>
                                <span>600€</span>
                            </div>
                        </div>

                        {/* Sun Hours Input */}
                        <div className="space-y-6 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Horas de Sol Diarias</span>
                                <span className="text-3xl font-bold text-primary">{sunHours}h</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                step="0.5"
                                value={sunHours}
                                onChange={(e) => setSunHours(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                            <div className="flex justify-between text-xs text-slate-500 font-mono">
                                <span>3h</span>
                                <span>10h (Verano)</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 text-blue-200 text-sm">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>Cálculo basado en irradiación media anual y precio pool 0.20€/kWh.</p>
                        </div>
                    </div>

                    {/* RESULTS SECTION */}
                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">

                        {/* Financial Card */}
                        <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />

                            <div className="space-y-4 relative z-10 w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="text-accent w-5 h-5" />
                                    <h3 className="font-bold text-lg text-white">Proyección Financiera (TCO)</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-4 border-y border-white/10">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Cuota Financiación</p>
                                        <p className="text-2xl text-white font-mono font-bold">{Math.round(data.loanPayment)}€<span className="text-sm text-slate-500">/mes</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-sm mb-1">Ahorro Estimado</p>
                                        <p className="text-2xl text-accent font-mono font-bold">{Math.round(data.initialMonthlySavings)}€<span className="text-sm text-slate-500">/mes</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 md:ml-12 relative z-10 flex-shrink-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow-static" style={{ transform: 'rotate(-45deg)', animation: 'none' }} />
                                    {/* Static visual representation of 'autarky' or savings % */}
                                    <div className="absolute inset-0 rounded-full border-4 border-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)' }} />

                                    <div className="text-center">
                                        <span className="block text-3xl font-bold text-white">92%</span>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Autarquía</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Recommendation */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Sistema Recomendado</span>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-white tracking-tighter">{data.panelCount}</span>
                                <span className="text-lg text-primary font-medium mb-1.5">Paneles Tier-1</span>
                            </div>
                            <p className="text-slate-400 text-sm">Potencia total instalada: <span className="text-white font-mono">{data.systemSizeKw.toFixed(1)} kWp</span></p>
                        </div>

                        {/* Cash Flow */}
                        <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20 hover:bg-accent/15 transition-colors">
                            <span className="text-xs font-bold text-accent uppercase tracking-widest mb-4 block">Cash Flow Positivo</span>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-accent tracking-tighter">+{Math.round(data.netMonthlyBenefit)}€</span>
                                <span className="text-lg text-accent/80 font-medium mb-1.5">/mes</span>
                            </div>
                            <p className="text-accent/80 text-sm">Ahorro neto desde el primer mes</p>
                        </div>

                        {/* Environmental Impact (Full Width) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-green-900/40 to-slate-900/40 rounded-2xl p-6 border border-green-500/20 flex flex-wrap gap-8 items-center justify-center md:justify-around">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{(data.annualCo2SavedKg / 1000).toFixed(1)} Ton</p>
                                    <p className="text-xs text-green-200/70 uppercase tracking-wider">CO2 Evitado / Año</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                                    <Sun className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{Math.round(data.annualTrees)}</p>
                                    <p className="text-xs text-emerald-200/70 uppercase tracking-wider">Árboles Equivalentes</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                                    <Battery className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{data.paybackYears.toFixed(1)} Años</p>
                                    <p className="text-xs text-blue-200/70 uppercase tracking-wider">Retorno Inversión</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-10 w-full py-4 bg-primary text-secondary-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                    Reservar Estudio Gratuito
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};
