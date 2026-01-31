import { useState } from 'react';
import { GlassContainer } from '../common/GlassContainer';
import { Badge } from '../common/Badge';
import { MapPin, Star, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { InstallerDetailModal, type Installer } from './InstallerDetailModal';
import { InstallersListModal } from './InstallersListModal';

const INSTALLERS: Installer[] = [
    {
        id: 1,
        name: "SolarTech Madrid",
        location: "Madrid, España",
        rating: 4.9,
        reviews: 124,
        verified: true,
        avatar: "ST",
        description: "Líderes en instalación fotovoltaica en la Comunidad de Madrid. Más de 10 años llevando energía limpia a hogares y empresas con un servicio llave en mano que incluye desde el diseño hasta la legalización.",
        specialties: ["Instalación Residencial", "Sistemas Híbridos", "Cargadores VE", "Mantenimiento Preventivo"],
        yearsExperience: 12,
        completedProjects: 1540,
        certifications: ["Industria Acreditado", "Tesla Certified Installer", "SunPower Premier Partner"]
    },
    {
        id: 2,
        name: "EcoInstall BCN",
        location: "Barcelona, España",
        rating: 4.8,
        reviews: 89,
        verified: true,
        avatar: "EI",
        description: "Expertos en autoconsumo compartido y comunidades solares. Hacemos que la transición energética sea fácil y accesible para todos en el área metropolitana de Barcelona, priorizando la estética y eficiencia.",
        specialties: ["Comunidades Solares", "Residencial Premium", "Tramitación de Subvenciones", "Baterías Virtuales"],
        yearsExperience: 8,
        completedProjects: 850,
        certifications: ["Generalitat Certificado", "Huawei Gold Partner", "APsystems Expert"]
    },
    {
        id: 3,
        name: "Valencia Renovables",
        location: "Valencia, España",
        rating: 5.0,
        reviews: 56,
        verified: true,
        avatar: "VR",
        description: "Especialistas en grandes instalaciones de autoconsumo industrial y bombeo solar. Ingeniería propia para garantizar el máximo rendimiento de tu instalación bajo el sol del Levante.",
        specialties: ["Industrial", "Bombeo Solar", "Huertas Solares", "Alta Tensión"],
        yearsExperience: 15,
        completedProjects: 2100,
        certifications: ["ISO 9001:2015", "Fronius Service Partner", "SMA Expert Installer"]
    },
    // Mock duplicates for full list view
    {
        id: 4,
        name: "Soluciones del Sur",
        location: "Sevilla, España",
        rating: 4.7,
        reviews: 42,
        verified: true,
        avatar: "SS",
        description: "Energía solar para Andalucía. Aprovecha el sol al máximo con nuestros kits de alto rendimiento.",
        specialties: ["Residencial", "Riego Solar"],
        yearsExperience: 7,
        completedProjects: 500,
        certifications: ["Junta Andalucía"]
    },
    {
        id: 5,
        name: "Norte Solar",
        location: "Bilbao, España",
        rating: 4.9,
        reviews: 30,
        verified: true,
        avatar: "NS",
        description: "Instalaciones robustas para el clima del norte. Paneles de alta eficiencia y estructuras reforzadas.",
        specialties: ["Residencial", "Industrial"],
        yearsExperience: 10,
        completedProjects: 300,
        certifications: ["EVE Acreditado"]
    },
    {
        id: 6,
        name: "Galicia Verde",
        location: "Vigo, España",
        rating: 4.8,
        reviews: 75,
        verified: true,
        avatar: "GV",
        description: "Transformando tejados en Galicia. Especialistas en integración arquitectónica.",
        specialties: ["Tejados Pizarra", "Integración"],
        yearsExperience: 9,
        completedProjects: 600,
        certifications: ["Xunta Renovables"]
    }
];

export function InstallerSection() {
    const { t } = useTranslation();
    const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    return (
        <section id="installers" className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-4 right-4 bottom-4 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none rounded-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                            <ShieldCheck className="w-3 h-3 mr-2" />
                            {t('installers.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            <Trans i18nKey="installers.title" components={{ 1: <span className="text-primary" /> }} />
                        </h2>
                        <p className="text-slate-400 text-lg">
                            {t('installers.desc')}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-8 text-slate-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-primary" />
                                {t('installers.count')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                4.9/5 {t('installers.rating')}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsListModalOpen(true)}
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 group"
                        >
                            {t('installers.viewAll')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {INSTALLERS.slice(0, 3).map(installer => (
                        <GlassContainer
                            key={installer.id}
                            className="p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                            onClick={() => setSelectedInstaller(installer)}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                                        {installer.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold group-hover:text-primary transition-colors">{installer.name}</h3>
                                        <div className="flex items-center text-xs text-slate-400">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {installer.location}
                                        </div>
                                    </div>
                                </div>
                                {installer.verified && (
                                    <div className="text-primary" title="Verificado">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-white font-mono">{installer.rating}</span>
                                    <span className="text-slate-500 text-xs">({installer.reviews})</span>
                                </div>
                                <button className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                                    {t('installers.viewProfile')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </GlassContainer>
                    ))}
                </div>
            </div>

            <InstallerDetailModal
                installer={selectedInstaller}
                isOpen={!!selectedInstaller}
                onClose={() => setSelectedInstaller(null)}
            />

            <InstallersListModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                installers={INSTALLERS}
                onSelectInstaller={(installer) => {
                    setIsListModalOpen(false);
                    setTimeout(() => setSelectedInstaller(installer), 300); // Small delay for smooth transition
                }}
            />
        </section>
    );
}
