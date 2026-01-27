import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Rectangle, CircleMarker } from 'react-leaflet';
import { Search, Zap, Sun, Loader2, ScanLine, BrainCircuit, Waves, Maximize2, Minimize2, Plus, Minus, MousePointer2, ChevronDown, ChevronUp, X, Locate, Trash2, Layers } from 'lucide-react';
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
    const base = 6.5;
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

function MapResizer({ isFullscreen }: { isFullscreen: boolean }) {
    const map = useMap();
    useEffect(() => {
        // Wait for transition to finish or pump updates
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 550); // > 500ms transition
        return () => clearTimeout(timer);
    }, [isFullscreen, map]);
    return null;
}

function MapControls({
    isFullscreen,
    onToggleFullscreen,
    hasStatsPanel,
    onLocateMe,
    isLocating
}: {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    hasStatsPanel: boolean;
    onLocateMe: () => void;
    isLocating: boolean;
}) {
    const map = useMap();

    // Prevent map interaction when clicking controls
    const stopProp = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    return (
        <div
            className={`absolute right-6 z-[6000] flex flex-col gap-2 transition-all duration-300 ${hasStatsPanel ? 'bottom-48 sm:bottom-40' : 'bottom-6'}`}
            onMouseDown={stopProp}
            onDoubleClick={stopProp}
            onClick={stopProp}
        >
            <div className="flex flex-col rounded-xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-md bg-slate-900/90">
                <button
                    onClick={(e) => { stopProp(e); map.zoomIn(); }}
                    className="p-3 hover:bg-white/10 text-white transition-colors border-b border-white/10"
                    title="Acercar"
                    type="button"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => { stopProp(e); map.zoomOut(); }}
                    className="p-3 hover:bg-white/10 text-white transition-colors"
                    title="Alejar"
                    type="button"
                >
                    <Minus className="w-5 h-5" />
                </button>
            </div>

            <button
                onClick={(e) => { stopProp(e); onLocateMe(); }}
                className="p-3 rounded-xl shadow-xl border border-white/10 backdrop-blur-md bg-slate-900/90 hover:bg-white/10 text-white transition-colors"
                title="Mi Ubicación"
                type="button"
                disabled={isLocating}
            >
                {isLocating ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Locate className="w-5 h-5" />}
            </button>


            <button
                onClick={(e) => { stopProp(e); onToggleFullscreen(); }}
                className="p-3 rounded-xl shadow-xl border border-white/10 backdrop-blur-md bg-slate-900/90 hover:bg-white/10 text-white transition-colors"
                title={isFullscreen ? "Minimizar Mapa" : "Expandir Mapa"}
                type="button"
            >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
        </div>
    );
}

function PanelPlacer({ onPlacePanel }: { onPlacePanel: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            // Prevent placement if clicking on controls
            const target = e.originalEvent.target as HTMLElement;
            if (target.closest('button') || target.closest('.leaflet-control') || target.closest('.leaflet-interactive')) {
                return;
            }
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
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [mode, setMode] = useState<'view' | 'analyze' | 'place'>('view');
    const [analysisState, setAnalysisState] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
    const [solarData, setSolarData] = useState<{ irradiance: number; quality: string } | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isStatsExpanded, setIsStatsExpanded] = useState(false); // Collapsed by default
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Collapsible search state
    const [mapType, setMapType] = useState<'satellite' | 'standard'>('satellite');
    const mapWrapperRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Auto-focus input when search opens
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            // Small timeout to allow transition/render
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isSearchOpen]);

    // Sync fullscreen state with browser event
    useEffect(() => {
        const handleChange = () => {
            const doc = document as any;
            const isFull = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
            setIsFullscreen(isFull);
            setIsStatsExpanded(isFull); // Auto-expand on fullscreen, collapse on minimize
        };

        document.addEventListener('fullscreenchange', handleChange);
        document.addEventListener('webkitfullscreenchange', handleChange);
        document.addEventListener('mozfullscreenchange', handleChange);
        document.addEventListener('MSFullscreenChange', handleChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleChange);
            document.removeEventListener('webkitfullscreenchange', handleChange);
            document.removeEventListener('mozfullscreenchange', handleChange);
            document.removeEventListener('MSFullscreenChange', handleChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        if (!mapWrapperRef.current) return;
        const elem = mapWrapperRef.current as any;
        const doc = document as any;

        if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
            try {
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    await elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    await elem.mozRequestFullScreen();
                }
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
            }
        } else {
            if (doc.exitFullscreen) {
                await doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
                await doc.webkitExitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                await doc.mozCancelFullScreen();
            } else if (doc.msExitFullscreen) {
                await doc.msExitFullscreen();
            }
        }
    };

    // Panel Specs
    const PANEL_WIDTH = 0.000018;
    const PANEL_HEIGHT = 0.000010;

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCenter([latitude, longitude]);
                setMarkerPosition([latitude, longitude]);
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLocating(false);
                alert('No se pudo obtener tu ubicación. Por favor, verifica los permisos de tu navegador.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        setAnalysisState('idle');
        setSolarData(null);
        setPanels([]);
        setMarkerPosition(null);
        setMode('view');

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setCenter([lat, lon]);
                setMarkerPosition([lat, lon]);
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
        setTimeout(() => setAnalysisState('processing'), 3000);
        setTimeout(() => {
            const peakHours = getPeakSunHours(center[0]);
            let quality = 'Buena';
            if (peakHours > 5) quality = 'Excelente';
            if (peakHours < 3.5) quality = 'Moderada';
            setSolarData({ irradiance: peakHours, quality });
            setAnalysisState('complete');
            setMode('place');
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
    const irradiance = solarData?.irradiance || getPeakSunHours(center[0]);
    const panelPower = 0.45;
    const totalPower = panels.length * panelPower;
    const annualGeneration = Math.round(totalPower * irradiance * 365 * 0.85);
    const annualSavings = Math.round(annualGeneration * 0.15);

    return (
        <div
            ref={mapWrapperRef}
            className={`relative transition-all duration-500 ease-in-out bg-slate-900 overflow-hidden border border-white/10 shadow-2xl group ${isFullscreen ? 'w-full h-full rounded-none border-0' : 'w-full h-full rounded-3xl'}`}
        >

            <MapContainer
                center={center}
                zoom={18}
                maxZoom={22}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={false}
            >
                {mapType === 'satellite' ? (
                    <>
                        <TileLayer
                            attribution='Tiles &copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxNativeZoom={19}
                            maxZoom={22}
                        />
                        <TileLayer
                            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
                            opacity={0.6}
                        />
                    </>
                ) : (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        maxNativeZoom={20}
                        maxZoom={22}
                    />
                )}

                <FlyToLocation coords={center} />
                <MapResizer isFullscreen={isFullscreen} />
                <PanelPlacer onPlacePanel={addPanel} />
                <MapControls
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    hasStatsPanel={panels.length > 0}
                    onLocateMe={handleLocateMe}
                    isLocating={isLocating}
                />

                {panels.map((panel) => (
                    <Rectangle
                        key={panel.id}
                        bounds={panel.bounds}
                        pathOptions={{ color: '#22c55e', weight: 1, fillOpacity: 0.7 }}
                    />
                ))}

                {markerPosition && (
                    <>
                        <CircleMarker
                            center={markerPosition}
                            radius={20}
                            pathOptions={{
                                color: '#eab308',
                                fillColor: '#eab308',
                                fillOpacity: 0.2,
                                weight: 0
                            }}
                            interactive={false}
                        />
                        <CircleMarker
                            center={markerPosition}
                            radius={6}
                            pathOptions={{
                                color: '#ffffff',
                                fillColor: '#eab308',
                                fillOpacity: 1,
                                weight: 2
                            }}
                            interactive={false}
                        />
                    </>
                )}
            </MapContainer>

            {/* --- OVERLAYS --- */}
            <AnimatePresence>
                {analysisState === 'scanning' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[400] pointer-events-none"
                    >
                        <motion.div
                            className="absolute left-0 w-full h-2 bg-primary/60 shadow-[0_0_40px_rgba(34,197,94,0.8)]"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="absolute inset-0 border-[20px] border-primary/10" />

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-xl border border-primary/50 text-primary font-mono flex flex-col items-center gap-2">
                            <ScanLine className="w-8 h-8 animate-pulse" />
                            <span className="text-lg font-bold">ESCANEANDO DSM-LIDAR...</span>
                            <span className="text-xs text-primary/70">Analizando topografía y sombras</span>
                        </div>
                    </motion.div>
                )}

                {(analysisState === 'complete' || mode === 'place') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="absolute inset-0 z-[300] pointer-events-none bg-gradient-to-br from-yellow-500/10 via-red-500/5 to-transparent mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            {/* Search Bar */}
            {/* Search Bar & Map Controls */}
            <div className={`absolute left-4 z-[500] transition-all duration-300 flex items-center gap-3 ${isFullscreen ? 'top-8' : 'top-4'}`}>

                {/* Map Layer Toggle (Standard <-> Satellite) */}
                <button
                    onClick={() => setMapType(prev => prev === 'satellite' ? 'standard' : 'satellite')}
                    title={mapType === 'satellite' ? "Cambiar a Mapa Plano" : "Cambiar a Satélite"}
                    className="h-12 w-12 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-white shadow-2xl transition-all hover:scale-105"
                >
                    <Layers className="w-5 h-5" />
                </button>

                {/* Search Input */}
                <div className={`relative transition-all duration-300 ease-out flex items-center shadow-2xl bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden ${isSearchOpen || searchQuery ? 'w-[320px] sm:w-[500px]' : 'w-12 h-12'}`}>

                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={`absolute left-0 top-0 h-12 w-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-20 ${isSearchOpen || searchQuery ? 'bg-transparent' : 'bg-slate-900/95'}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <form
                        onSubmit={(e) => {
                            handleSearch(e);
                        }}
                        className={`w-full h-full flex items-center transition-opacity duration-300 ${isSearchOpen || searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Introduce tu dirección completa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            onBlur={() => {
                                if (!searchQuery) {
                                    setIsSearchOpen(false);
                                }
                            }}
                            className="w-full h-12 bg-transparent text-white pl-12 pr-10 focus:outline-none placeholder:text-slate-500 text-sm"
                        />
                        {loading && (
                            <div className="absolute right-3">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            </div>
                        )}
                        {searchQuery && !loading && (
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                className="absolute right-3 text-slate-500 hover:text-white p-1"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Main Controls Toolkit */}
            {analysisState !== 'scanning' && (
                <div className={`absolute left-4 z-[500] flex flex-col gap-3 transition-all duration-300 ${isFullscreen ? 'top-24' : 'top-20'}`}>

                    {analysisState === 'idle' && (
                        <button
                            onClick={startAnalysis}
                            title="Analizar Tejado con IA"
                            className="flex items-center gap-3 px-6 h-14 rounded-xl backdrop-blur-md bg-yellow-500 text-slate-900 font-black shadow-lg shadow-yellow-500/20 hover:scale-105 hover:shadow-yellow-500/40 transition-all group/btn"
                        >
                            <BrainCircuit className="w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-700" />
                            <span className="text-sm uppercase tracking-wide">Analizar con IA</span>
                        </button>
                    )}

                    {analysisState === 'complete' && (
                        <div className="flex flex-col gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl w-fit">
                            <button
                                onClick={() => setMode('view')}
                                title="Navegar Mapa"
                                className={`p-2.5 rounded-lg transition-all ${mode === 'view' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <MousePointer2 className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setMode('place')}
                                title="Colocar Paneles"
                                className={`p-2.5 rounded-lg transition-all ${mode === 'place' ? 'bg-primary text-secondary shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Sun className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setPanels([])}
                                title="Limpiar Paneles"
                                className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {mode === 'place' && panels.length === 0 && (
                        <div className="absolute left-14 top-0 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs text-white whitespace-nowrap animate-in fade-in slide-in-from-left-2 pointer-events-none">
                            Haz clic para añadir paneles
                        </div>
                    )}
                </div>
            )}

            {/* Stats HUD */}
            {analysisState === 'complete' && (
                <>
                    {/* Top Right Info */}
                    {/* Top Right Info (Collapsible) */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`absolute right-4 z-[500] transition-all duration-300 flex flex-col items-end gap-2 ${isFullscreen ? 'top-24' : 'top-20'}`}
                    >
                        <button
                            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl hover:bg-white/5 transition-colors"
                        >
                            <Waves className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-white">ANÁLISIS COMPLETADO</span>
                            {isStatsExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        <AnimatePresence>
                            {isStatsExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-64 space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                            <div><div className="text-slate-500">IRRADIANCIA</div><div className="text-white text-lg">{solarData?.irradiance} <span className="text-[10px]">kWh/m²</span></div></div>
                                            <div><div className="text-slate-500">CALIDAD</div><div className="text-emerald-400 text-lg">{solarData?.quality}</div></div>
                                            <div><div className="text-slate-500">LATITUD</div><div className="text-slate-300">{center[0].toFixed(4)}</div></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Bottom Stats Bar */}
                    {/* Bottom Stats Bar */}
                    {panels.length > 0 && (
                        <div className={`absolute left-0 right-0 z-[5000] transition-all duration-300 ${isFullscreen ? 'bottom-8 px-8' : 'bottom-6 px-4'}`}>
                            <div className={`${isFullscreen ? 'max-w-6xl' : 'max-w-4xl'} mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}>
                                <div className={`flex flex-col ${isFullscreen ? 'md:grid md:grid-cols-4 lg:grid-cols-6' : 'md:flex-row'} items-center justify-between gap-4 p-4 md:p-6`}>

                                    {/* Standard Stats (Always Visible) */}
                                    <div className={`flex items-center gap-4 ${isFullscreen ? 'col-span-2' : 'flex-1'}`}>
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <Zap className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Potencia del Sistema</div>
                                            <div className="text-2xl font-bold text-white leading-none">
                                                {totalPower.toFixed(2)} <span className="text-sm font-normal text-slate-500">kWp</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isFullscreen && <div className="hidden md:block w-px h-12 bg-white/10" />}

                                    <div className={`flex items-center gap-4 ${isFullscreen ? 'col-span-2' : 'flex-1'}`}>
                                        <div className="text-center md:text-left w-full">
                                            <div className="text-sm text-slate-400">Producción Estimada</div>
                                            <div className="text-xl font-bold text-white leading-none">
                                                {annualGeneration.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh/año</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isFullscreen && <div className="hidden md:block w-px h-12 bg-white/10" />}

                                    <div className={`flex items-center gap-4 ${isFullscreen ? 'col-span-2' : 'flex-1'}`}>
                                        <div className="text-center md:text-left w-full">
                                            <div className="text-sm text-slate-400">Ahorro Anual</div>
                                            <div className="text-xl font-bold text-emerald-400 leading-none">
                                                ~{annualSavings}€
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extended Stats (Fullscreen Only) */}
                                    {isFullscreen && (
                                        <>
                                            <div className="col-span-2 flex flex-col justify-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="text-xs text-slate-400 mb-1">Impacto Ambiental</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-lg font-bold text-green-400">{(annualGeneration * 0.4).toFixed(0)} kg</div>
                                                    <span className="text-[10px] text-slate-500">CO2 Ahorrado</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex flex-col justify-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="text-xs text-slate-400 mb-1">Retorno Inversión</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-lg font-bold text-blue-400">~4.2</div>
                                                    <span className="text-[10px] text-slate-500">Años (Estimado)</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex flex-col justify-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="text-xs text-slate-400 mb-1">Árboles Plantados</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-lg font-bold text-emerald-400">{(annualGeneration / 200).toFixed(0)}</div>
                                                    <span className="text-[10px] text-slate-500">Equivalentes</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
