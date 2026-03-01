import { useState, useMemo, useEffect } from 'react';
import { Battery, ArrowRight, Leaf, TrendingUp, Bot, Sparkles, Loader2, Briefcase, Calculator, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

export const SolarCalculator = ({ onReserveClick }: { onReserveClick?: () => void }) => {
    const { t } = useTranslation();
    const { addItem, toggleCart } = useCart();
    const [bill, setBill] = useState(150);
    const [sunHours, setSunHours] = useState(5);
    const [installerMargin, setInstallerMargin] = useState(30); // % de ganancia para el instalador
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<{ verdict: string; summary: string; details: string[] } | null>(null);
    const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReport(null);

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // AI Logic Simulation based on 'data'
        const verdict = data.paybackYears < 5 ? t('calculator.ai.excellent') : data.paybackYears < 8 ? t('calculator.ai.veryGood') : t('calculator.ai.good');

        setReport({
            verdict,
            summary: `${t('calculator.ai.summaryBase', { bill, sunHours, size: data.systemSizeKw.toFixed(1) })} ${t('calculator.ai.summaryROI', { roi: Math.round(data.roi) })}`,
            details: [
                t('calculator.ai.detailCashFlow', { loan: Math.round(data.loanPayment), savings: Math.round(data.initialMonthlySavings) }),
                t('calculator.ai.detailEnv', { co2: Math.round(data.annualCo2SavedKg / 1000), trees: Math.round(data.annualTrees) }),
                t('calculator.ai.detailPayback', { years: data.paybackYears.toFixed(1) })
            ]
        });
        setIsGenerating(false);
        setHasGeneratedReport(true);
    };

    // Reset report status when inputs change
    useEffect(() => {
        setHasGeneratedReport(false);
    }, [bill, sunHours, installerMargin]);

    // Constants for Spain (approximate) - B2B Model
    const ELECTRICITY_PRICE = 0.20; // €/kWh
    const PANEL_WATTAGE = 450; // W

    // B2B Costs (Wholesale prices for installer)
    const SYSTEM_COST_B2B_PER_KW = 500; // € (Material cost per kW: Panels, Inverter, Structure)
    const BASE_INSTALL_COST_PER_KW = 250; // € (Labor cost estimate per kW)

    const CO2_PER_KWH = 0.3; // kg
    const TREES_PER_TON_CO2 = 45; // trees per ton

    const FINANCING_RATE = 0.065; // 6.5% interest
    const FINANCING_YEARS = 10;

    const data = useMemo(() => {
        // 1. Calculate Consumption
        const monthlyKwh = bill / ELECTRICITY_PRICE;
        const annualKwh = monthlyKwh * 12;

        // 2. System Sizing
        const requiredKwp = annualKwh / (sunHours * 365 * 0.75);
        const panelCount = Math.ceil((requiredKwp * 1000) / PANEL_WATTAGE);
        const systemSizeKw = (panelCount * PANEL_WATTAGE) / 1000;

        // 3. Financials (B2B & B2C)
        const totalMaterialCostB2B = systemSizeKw * SYSTEM_COST_B2B_PER_KW;
        const totalLaborCost = systemSizeKw * BASE_INSTALL_COST_PER_KW;
        const baseCostForInstaller = totalMaterialCostB2B + totalLaborCost;

        // Installer Profit
        const profitMultiplier = 1 + (installerMargin / 100);
        const expectedNetProfit = baseCostForInstaller * (installerMargin / 100);

        // Client Final Price
        const finalPriceForClient = baseCostForInstaller * profitMultiplier;

        // Financing for Final Client
        const monthlyRate = FINANCING_RATE / 12;
        const numPayments = FINANCING_YEARS * 12;
        const loanPayment = (finalPriceForClient * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Savings for Final Client
        const initialAnnualSavings = annualKwh * ELECTRICITY_PRICE;
        const initialMonthlySavings = initialAnnualSavings / 12;
        const netMonthlyBenefit = initialMonthlySavings - loanPayment;

        // ROI & Payback for Final Client
        const paybackYears = finalPriceForClient / initialAnnualSavings;
        const roi = ((initialAnnualSavings * 25 - finalPriceForClient) / finalPriceForClient) * 100;

        // 4. Environmental
        const annualCo2SavedKg = annualKwh * CO2_PER_KWH;
        const annualTrees = (annualCo2SavedKg / 1000) * TREES_PER_TON_CO2;

        return {
            panelCount,
            systemSizeKw,
            totalMaterialCostB2B,
            expectedNetProfit,
            finalPriceForClient,
            loanPayment,
            initialMonthlySavings,
            netMonthlyBenefit,
            paybackYears,
            roi,
            annualCo2SavedKg,
            annualTrees
        };
    }, [bill, sunHours, installerMargin]);

    return (
        <section className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 max-w-6xl mx-auto shadow-2xl relative" aria-labelledby="calculator-title">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-3xl" />

            <div className="relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl text-primary">
                            <Calculator className="w-8 h-8" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="calculator-title" className="text-2xl font-heading font-bold tracking-tight text-foreground">{t('calculator.title')}</h2>
                            <p className="text-muted-foreground text-sm">{t('calculator.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border/50 text-sm font-medium">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>Herramienta B2B</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* INPUTS SECTION (Installer Controls) */}
                    <div className="lg:col-span-4 space-y-8 bg-secondary/40 p-6 rounded-2xl h-fit border border-border/50 shadow-inner">

                        {/* Installer Margin Input */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label htmlFor="margin-input" className="text-sm font-bold text-primary uppercase tracking-wider">{t('calculator.installerMargin', 'Margen Comercial')}</label>
                                <motion.span
                                    key={installerMargin}
                                    initial={{ scale: 1.2, color: "var(--color-primary)" }}
                                    animate={{ scale: 1, color: "var(--color-foreground)" }}
                                    className="text-3xl font-mono font-bold text-foreground"
                                >
                                    {installerMargin}%
                                </motion.span>
                            </div>
                            <input
                                id="margin-input"
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={installerMargin}
                                onChange={(e) => setInstallerMargin(Number(e.target.value))}
                                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/90 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-mono" aria-hidden="true">
                                <span>10% ({t('calculator.profitMargin', 'Margen')})</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Bill Input (Client's data) */}
                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div className="flex justify-between items-end">
                                <label htmlFor="bill-input" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('calculator.currentBill')}</label>
                                <span className="text-2xl font-mono font-bold text-foreground">{bill}€</span>
                            </div>
                            <input
                                id="bill-input"
                                type="range"
                                min="50"
                                max="600"
                                step="10"
                                value={bill}
                                onChange={(e) => setBill(Number(e.target.value))}
                                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-muted-foreground hover:accent-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-mono" aria-hidden="true">
                                <span>50€</span>
                                <span>600€</span>
                            </div>
                        </div>

                        {/* Sun Hours Input */}
                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div className="flex justify-between items-end">
                                <label htmlFor="sun-input" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('calculator.sunHours')}</label>
                                <span className="text-2xl font-mono font-bold text-foreground">{sunHours}h</span>
                            </div>
                            <input
                                id="sun-input"
                                type="range"
                                min="3"
                                max="10"
                                step="0.5"
                                value={sunHours}
                                onChange={(e) => setSunHours(Number(e.target.value))}
                                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-muted-foreground hover:accent-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-mono" aria-hidden="true">
                                <span>3h</span>
                                <span>10h ({t('calculator.sunHoursSummer')})</span>
                            </div>
                        </div>
                    </div>

                    {/* RESULTS SECTION */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* B2B VIEW: Installer Numbers */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-6">
                                <Briefcase className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-lg">{t('calculator.installerViewTitle', 'Tus Números de Instalador')}</h3>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-background/50 rounded-xl p-4 border border-border/40">
                                    <p className="text-sm text-muted-foreground mb-1">{t('calculator.b2bCost', 'Coste Materiales (B2B)')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-mono font-bold text-foreground">{Math.round(data.totalMaterialCostB2B).toLocaleString()}€</span>
                                        <span className="text-xs text-muted-foreground">({data.systemSizeKw.toFixed(1)} kWp)</span>
                                    </div>
                                </div>

                                <motion.div
                                    className="bg-primary/10 rounded-xl p-4 border border-primary/30"
                                    key={`profit-${installerMargin}`}
                                    initial={{ y: -5, opacity: 0.8 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <p className="text-sm text-primary font-medium mb-1">{t('calculator.netProfit', 'Beneficio Neto Proyectado')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-mono font-bold text-primary">+{Math.round(data.expectedNetProfit).toLocaleString()}€</span>
                                        <span className="text-xs text-primary/70">margen</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* B2C VIEW: Client Presentation */}
                        <div className="bg-secondary/40 border border-border/50 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                                <TrendingUp className="w-5 h-5" />
                                <h3 className="font-bold text-lg">{t('calculator.clientViewTitle', 'Datos para tu Cliente')}</h3>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-background/40 p-4 rounded-xl">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('calculator.clientPrice', 'PVP Recomendado Cliente')}</p>
                                    <p className="text-xl font-mono font-bold text-foreground">{Math.round(data.finalPriceForClient).toLocaleString()}€</p>
                                </div>
                                <div className="bg-background/40 p-4 rounded-xl">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('calculator.financingInstallment')}</p>
                                    <p className="text-xl font-mono font-bold text-foreground">{Math.round(data.loanPayment)}€<span className="text-sm font-sans text-muted-foreground">/mes</span></p>
                                </div>
                                <div className="bg-background/40 p-4 rounded-xl">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('calculator.estimatedSavings')}</p>
                                    <p className="text-xl font-mono font-bold text-accent">{Math.round(data.initialMonthlySavings)}€<span className="text-sm font-sans text-muted-foreground">/mes</span></p>
                                </div>
                            </div>

                            {/* System Recommendation & Impact */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-card/50 rounded-xl p-4 border border-border/50 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">{t('calculator.recommendedSystem')}</span>
                                        <span className="text-foreground font-mono">{data.systemSizeKw.toFixed(1)} kWp</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end justify-center">
                                        <span className="text-2xl font-bold text-foreground tracking-tighter leading-none">{data.panelCount}</span>
                                        <span className="text-sm text-primary font-medium mt-1">{t('calculator.tier1Panels')}</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/10 to-transparent rounded-xl p-4 border border-green-500/10 flex justify-around items-center">
                                    <div className="text-center">
                                        <Leaf className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                        <p className="text-sm font-bold text-foreground">{(data.annualCo2SavedKg / 1000).toFixed(1)}T</p>
                                    </div>
                                    <div className="w-px h-8 bg-border/50" />
                                    <div className="text-center">
                                        <Battery className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                                        <p className="text-sm font-bold text-foreground">{data.paybackYears.toFixed(1)}y</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* AI REPORT SECTION */}
                <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Bot className="w-32 h-32 text-blue-400" aria-hidden="true" />
                    </div>

                    <div className="relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                            <div className="flex-1 space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                                    IA para Ventas
                                </div>
                                <h3 className="text-xl lg:text-2xl font-heading font-bold text-foreground">{t('calculator.ai.title')}</h3>
                                <p className="text-muted-foreground text-sm max-w-xl">
                                    Genera un argumento de venta irrefutable basado en los datos financieros para presentar a tu cliente final.
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerateReport}
                                disabled={isGenerating || hasGeneratedReport}
                                className={cn(
                                    "flex-shrink-0 px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition-all w-full md:w-auto justify-center shadow-lg",
                                    isGenerating || hasGeneratedReport
                                        ? "bg-secondary text-muted-foreground shadow-none"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40"
                                )}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('calculator.ai.analyzing')}
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-5 h-5" aria-hidden="true" />
                                        {t('calculator.ai.generate')}
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Report Content */}
                        <AnimatePresence>
                            {report && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: 10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: 10 }}
                                    className="border-t border-blue-500/10 pt-6 mt-6"
                                >
                                    <div className="bg-background/40 backdrop-blur-md rounded-xl p-6 border border-blue-500/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h4 className="font-bold text-lg text-foreground">{t('calculator.ai.resultTitle')}: <span className={report.verdict === t('calculator.ai.excellent') ? 'text-emerald-400' : 'text-blue-400'}>{report.verdict}</span></h4>
                                        </div>

                                        <p className="text-slate-300 leading-relaxed text-sm mb-6">
                                            {report.summary}
                                        </p>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            {report.details.map((detail, index) => (
                                                <div key={index} className="bg-background/60 p-4 rounded-lg border border-white/5">
                                                    <p className="text-xs text-slate-300">{detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* B2B Action Bottom */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            addItem({
                                id: `custom-kit-${data.systemSizeKw.toFixed(2)}kwp`,
                                name: `Kit Profesional ${data.systemSizeKw.toFixed(1)} kWp`,
                                description: `${data.panelCount} Paneles Tier-1 con Inversor Híbrido`,
                                type: 'hybrid',
                                total_power: data.systemSizeKw,
                                price: data.totalMaterialCostB2B,
                                stock: 99,
                                image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800'
                            });
                            toggleCart();
                        }}
                        className="flex-1 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Añadir Materiales al Carrito B2B
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="sm:px-8 py-4 bg-secondary text-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-3 border border-border/50 hover:bg-secondary/80 transition-all"
                    >
                        Descargar Presupuesto Cliente
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
};
