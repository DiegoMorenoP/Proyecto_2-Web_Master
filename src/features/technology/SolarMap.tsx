import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Rectangle } from 'react-leaflet';
import { Search, Map as MapIcon, Zap, Sun, Info, Loader2, ScanLine, BrainCircuit, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet generic marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- Physics Engine ---
const getPeakSunHours = (lat: number): number => {
    // Simple approximation: closer to equator (0) = more sun.
    // 40deg (Madrid) ~= 5.0h, 51deg (London) ~= 3.5h
    const base = 6.5; // Max theoretical at equator
    const deduction = Math.abs(lat) * 0.06;
    return Math.max(2, parseFloat((base - deduction).toFixed(2)));
};

// --- Helper Components ---

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 18, { duration: 2 });
        }
    }, [coords, map]);
    return null;
}

function PanelPlacer({ onPlacePanel }: { onPlacePanel: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onPlacePanel(e.latlng);
        },
    });
    return null;
}

interface Panel {
    id: string;
    bounds: L.LatLngBoundsExpression;
    center: [number, number];
}

export function SolarMap() {
    const [searchQuery, setSearchQuery] = useState('');
    const [center, setCenter] = useState<[number, number]>([40.4168, -3.7038]); // Madrid default
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'view' | 'analyze' | 'place'>('view');
    const [analysisState, setAnalysisState] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
    const [solarData, setSolarData] = useState<{ irradiance: number; quality: string } | null>(null);

    // Panel Specs
    const PANEL_WIDTH = 0.000018;
    const PANEL_HEIGHT = 0.000010;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        setAnalysisState('idle'); // Reset analysis on new search
        setSolarData(null);
        setPanels([]); // Reset panels? Maybe better to keep them, but let's reset for clarity
        setMode('view');

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setCenter([lat, lon]);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const startAnalysis = () => {
        setMode('analyze');
        setAnalysisState('scanning');

        // Sequence: Scanning -> Processing -> Complete
        setTimeout(() => setAnalysisState('processing'), 3000);

        setTimeout(() => {
            const peakHours = getPeakSunHours(center[0]);
            let quality = 'Buena';
            if (peakHours > 5) quality = 'Excelente';
            if (peakHours < 3.5) quality = 'Moderada';

            setSolarData({
                irradiance: peakHours,
                quality
            });
            setAnalysisState('complete');
            setMode('place'); // Auto-switch to place mode after analysis
        }, 5500);
    };

    const addPanel = (latlng: L.LatLng) => {
        if (mode !== 'place') return;

        const newPanel: Panel = {
            id: crypto.randomUUID(),
            center: [latlng.lat, latlng.lng],
            bounds: [
                [latlng.lat - PANEL_HEIGHT, latlng.lng - PANEL_WIDTH],
                [latlng.lat + PANEL_HEIGHT, latlng.lng + PANEL_WIDTH]
            ]
        };
        setPanels([...panels, newPanel]);
    };

    // Calculations
    const irradiance = solarData?.irradiance || getPeakSunHours(center[0]); // Fallback/Live calc
    const panelPower = 0.45; // 450W
    const totalPower = panels.length * panelPower;
    // Annual Gen = Power * Irradiance(hours) * 365 * Efficiency(0.85 approx)
    const annualGeneration = Math.round(totalPower * irradiance * 365 * 0.85);
    const annualSavings = Math.round(annualGeneration * 0.15);

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">

            {/* Map Container */}
            <MapContainer
                center={center}
                zoom={18} // Start zoomed in for better analysis feel
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={false} // Prevent accidental zoom while scrolling page
                doubleClickZoom={false}
            >
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
                    opacity={0.6}
                />

                <FlyToLocation coords={center} />
                <PanelPlacer onPlacePanel={addPanel} />

                {panels.map((panel) => (
                    <Rectangle
                        key={panel.id}
                        bounds={panel.bounds}
                        pathOptions={{ color: '#22c55e', weight: 1, fillOpacity: 0.7 }}
                    />
                ))}
            </MapContainer>

            {/* --- AI SCANNING OVERLAYS --- */}
            <AnimatePresence>
                {analysisState === 'scanning' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[400] pointer-events-none"
                    >
                        {/* Scanning Beam */}
                        <motion.div
                            className="absolute left-0 w-full h-2 bg-primary/60 shadow-[0_0_40px_rgba(34,197,94,0.8)]"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Grid Effect */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="absolute inset-0 border-[20px] border-primary/10" />

                        {/* Status Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-xl border border-primary/50 text-primary font-mono flex flex-col items-center gap-2">
                            <ScanLine className="w-8 h-8 animate-pulse" />
                            <span className="text-lg font-bold">ESCANEANDO DSM-LIDAR...</span>
                            <span className="text-xs text-primary/70">Analizando topografía y sombras</span>
                        </div>
                    </motion.div>
                )}

                {/* Heatmap Overlay (Result) */}
                {(analysisState === 'complete' || mode === 'place') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="absolute inset-0 z-[300] pointer-events-none bg-gradient-to-br from-yellow-500/10 via-red-500/5 to-transparent mix-blend-overlay"
                    />
                )}
            </AnimatePresence>


            {/* UI Overlay: Search Bar */}
            <div className="absolute top-4 left-4 right-4 z-[500]">
                <form onSubmit={handleSearch} className="relative shadow-2xl">
                    <input
                        type="text"
                        placeholder="Introduce tu dirección completa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/95 backdrop-blur-md text-white border border-white/20 rounded-xl py-3 pl-12 pr-4 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </div>
                    )}
                </form>
            </div>

            {/* UI Overlay: Analysis Controls */}
            <div className="absolute top-20 left-4 z-[500] flex flex-col gap-2">
                {analysisState === 'idle' && (
                    <button
                        onClick={startAnalysis}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md bg-primary text-secondary font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform group/btn"
                    >
                        <BrainCircuit className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-700" />
                        <span>Analizar Tejado con IA</span>
                    </button>
                )}

                {analysisState === 'complete' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('place')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all ${mode === 'place' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-black/60 text-white border-white/10'}`}
                        >
                            <Sun className="w-4 h-4" />
                            <span>Añadir Paneles</span>
                        </button>
                    </div>
                )}
            </div>

            {/* UI Overlay: Tech HUD (Top Right) */}
            {analysisState === 'complete' && solarData && (
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-20 right-4 z-[500] w-64"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-white/10 pb-2">
                            <Waves className="w-4 h-4" />
                            <span>ANÁLISIS COMPLETADO</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                                <div className="text-slate-500">IRRADIANCIA</div>
                                <div className="text-white text-lg">{solarData.irradiance} <span className="text-[10px]">kWh/m²</span></div>
                            </div>
                            <div>
                                <div className="text-slate-500">CALIDAD</div>
                                <div className="text-emerald-400 text-lg">{solarData.quality}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">LATITUD</div>
                                <div className="text-slate-300">{center[0].toFixed(4)}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">TEMP. SUP.</div>
                                <div className="text-orange-400">~45°C</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* UI Overlay: Bottom Stats Bar */}
            {panels.length > 0 && (
                <div className="absolute bottom-6 left-4 right-4 z-[500]">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Potencia del Sistema</div>
                                <div className="text-2xl font-bold text-white leading-none">
                                    {totalPower.toFixed(2)} <span className="text-sm font-normal text-slate-500">kWp</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right md:text-left">
                                <div className="text-sm text-slate-400">Producción Estimada</div>
                                <div className="text-xl font-bold text-white leading-none">
                                    {annualGeneration.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh/año</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right md:text-left">
                                <div className="text-sm text-slate-400">Ahorro Anual</div>
                                <div className="text-xl font-bold text-emerald-400 leading-none">
                                    ~{annualSavings}€
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
