import {
    Sun, Battery, Settings, Wrench, PenTool, Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
    name: string;
    href: string;
};

export type Category = {
    title: string;
    icon: LucideIcon;
    href: string;
    items: NavItem[];
};

export const b2bCategories: Category[] = [
    {
        title: 'Kits Solares',
        icon: Sun,
        href: '/?category=kits-solares',
        items: [
            { name: 'Vivienda Aislada', href: '/?category=kits-solares&sub=vivienda-aislada' },
            { name: 'Autoconsumo Conectado a Red', href: '/?category=kits-solares&sub=autoconsumo-red' },
            { name: 'Calculadora de Kits', href: '/calculadora-kits' }
        ]
    },
    {
        title: 'Paneles Solares',
        icon: Zap,
        href: '/?category=paneles-solares',
        items: [
            { name: 'Monocristalinos', href: '/?category=paneles-solares&sub=monocristalinos' }
        ]
    },
    {
        title: 'Inversores',
        icon: Wrench,
        href: '/?category=inversores',
        items: [
            { name: 'Aislada', href: '/?category=inversores&sub=aislada' },
            { name: 'Conexión Red', href: '/?category=inversores&sub=red' },
            { name: 'Híbridos', href: '/?category=inversores&sub=hibridos' }
        ]
    },
    {
        title: 'Baterías',
        icon: Battery,
        href: '/?category=baterias-solares',
        items: [
            { name: 'Litio', href: '/?category=baterias-solares&sub=litio' },
            { name: 'Estacionarias OPZS', href: '/?category=baterias-solares&sub=opzs' },
            { name: 'Estacionarias UOPzS', href: '/?category=baterias-solares&sub=uopzs' },
            { name: 'Estacionarias OPZV', href: '/?category=baterias-solares&sub=opzv' },
            { name: 'AGM', href: '/?category=baterias-solares&sub=agm' },
            { name: 'Monoblock', href: '/?category=baterias-solares&sub=monoblock' },
            { name: 'Gel', href: '/?category=baterias-solares&sub=gel' }
        ]
    },
    {
        title: 'Accesorios',
        icon: Settings,
        href: '/?category=accesorios',
        items: [
            { name: 'Estructuras Chapa', href: '/?category=estructuras&sub=chapa' },
            { name: 'Estructuras Teja', href: '/?category=estructuras&sub=teja' },
            { name: 'Estructuras Inclinación', href: '/?category=estructuras&sub=inclinacion' },
            { name: 'Estructuras Elevadas', href: '/?category=estructuras&sub=elevadas' },
            { name: 'Cuadros Fotovoltaica', href: '/?category=accesorios&sub=cuadros' },
            { name: 'Generadores Gasolina', href: '/?category=accesorios&sub=generadores' }
        ]
    },
    {
        title: 'Reguladores',
        icon: PenTool,
        href: '/?category=reguladores',
        items: [
            { name: 'Reguladores de Carga', href: '/?category=reguladores&sub=carga' },
            { name: 'Calculadora de Reguladores', href: '/calculadora-reguladores' }
        ]
    }
];
