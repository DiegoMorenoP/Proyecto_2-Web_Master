
import { Badge } from '../../components/common/Badge';
import { Scan, Box, Layers, MousePointer2 } from 'lucide-react';
import { SolarMap } from './SolarMap';

export function SolarDsmSection() {
    return (
        <section id="dsm" className="py-24 relative overflow-hidden bg-slate-900/50">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                            <Scan className="w-3 h-3 mr-2" />
                            Tecnología DSM 2026
                        </Badge>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Mapeo Solar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">3D & AI</span>
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Utilizamos <strong>modelos digitales de superficie (DSM)</strong> y algoritmos de visión por computador para calcular la irradiancia exacta de cada metro cuadrado de tu tejado.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                { icon: Box, text: "Modelado 3D de obstáculos y sombras" },
                                { icon: Layers, text: "Cálculo de eficiencia por m²" },
                                { icon: MousePointer2, text: "Selección automática del área óptima" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                        <item.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Functional Solar Map */}
                    <div className="relative aspect-square md:aspect-video lg:aspect-square h-[500px] w-full">
                        <SolarMap />
                    </div>
                </div>
            </div>
        </section>
    );
}
