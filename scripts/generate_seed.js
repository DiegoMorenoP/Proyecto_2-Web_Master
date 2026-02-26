import fs from 'fs';
import path from 'path';

const SEED_FILE = path.join(process.cwd(), 'supabase', 'seed.sql');

// Data Generators
const generatePanels = () => {
    return Array.from({ length: 12 }).map((_, i) => ({
        name: `Panel Solar Monocristalino Pro ${450 + (i * 10)}W - Pallet`,
        type: 'panel',
        price: 6500 + (i * 150),
        base_price: 6500 + (i * 150),
        sku: `PNL-PRO-${450 + (i * 10)}-PLT`,
        pack_quantity: 30,
        voltage: 48,
        stock_status: 'in_stock',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        category_slug: 'paneles-solares',
        subcategory_slug: 'monocristalinos',
        specifications: JSON.stringify({
            potencia: `${450 + (i * 10)}W`,
            tecnologia: 'Monocristalino PERC',
            dimensiones: '2094 x 1038 x 35 mm',
            peso: '23.5 kg',
            garantia: '25 años',
        })
    }));
};

const generateInverters = () => {
    return Array.from({ length: 14 }).map((_, i) => ({
        name: `Inversor B2B Serie ${i < 5 ? 'Aislada' : i < 10 ? 'Red' : 'Híbrido'} ${5 + i}kW`,
        type: 'inverter',
        price: 1100 + (i * 80),
        base_price: 1100 + (i * 80),
        sku: `INV-B2B-${5 + i}K-${i}`,
        pack_quantity: 1,
        voltage: null,
        stock_status: 'in_stock',
        image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80',
        category_slug: 'inversores',
        subcategory_slug: i < 5 ? 'aislada' : i < 10 ? 'red' : 'hibridos',
        specifications: JSON.stringify({
            potencia_nominal: `${5 + i}kW`,
            mppt: i % 2 === 0 ? 2 : 3,
            eficiencia: '98.5%',
            tipo_onda: 'Senoidal Pura',
            proteccion_ip: 'IP65',
        })
    }));
};

const generateBatteries = () => {
    const types = ['litio', 'opzs', 'uopzs', 'opzv', 'agm', 'monoblock', 'gel'];
    let products = [];
    for (const t of types) {
        for (let i = 0; i < 3; i++) {
            products.push({
                name: `Batería Industrial ${t.toUpperCase()} ${100 + (i * 50)}Ah`,
                type: 'battery',
                price: 800 + (i * 400),
                base_price: 800 + (i * 400),
                sku: `BAT-${t}-${100 + (i * 50)}`,
                pack_quantity: 1,
                voltage: 48,
                stock_status: 'in_stock',
                image_url: 'https://images.unsplash.com/photo-1569024733183-40533e4b0930?auto=format&fit=crop&w=800&q=80',
                category_slug: 'baterias-solares',
                subcategory_slug: t,
                specifications: JSON.stringify({
                    capacidad: `${100 + (i * 50)}Ah`,
                    ciclos_vida: t === 'litio' ? '>6000' : '>1500',
                    tecnologia: t.toUpperCase(),
                    voltaje_nominal: '48V',
                })
            });
        }
    }
    return products;
};

const generateAccessories = () => {
    const types = ['chapa', 'teja', 'inclinacion', 'elevadas', 'cuadros', 'generadores-gasolina'];
    let products = [];
    let count = 0;
    for (const t of types) {
        for (let i = 0; i < 3; i++) {
            count++;
            products.push({
                name: `Accesorio ${t.toUpperCase()} Mod ${count}`,
                type: 'panel', // fallback since no acc enum exists in db type currently, wait database only has panel/inverter/battery
                price: 50 + (i * 20),
                base_price: 50 + (i * 20),
                sku: `ACC-${t}-${count}`,
                pack_quantity: t.includes('estructura') ? 10 : 1,
                voltage: null,
                stock_status: 'in_stock',
                image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
                category_slug: t === 'generadores-gasolina' ? 'accesorios' : 'estructuras',
                subcategory_slug: t,
                specifications: JSON.stringify({
                    material: 'Aluminio Anodizado',
                    compatibilidad: 'Universal',
                    garantia: '10 años',
                })
            });
        }
    }
    return products;
};

const generateRegulators = () => {
    return Array.from({ length: 12 }).map((_, i) => ({
        name: `Regulador MPPT B2B ${30 + (i * 10)}A`,
        type: 'inverter', // fallback
        price: 150 + (i * 20),
        base_price: 150 + (i * 20),
        sku: `REG-MPPT-${30 + (i * 10)}`,
        pack_quantity: 1,
        voltage: null,
        stock_status: 'in_stock',
        image_url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
        category_slug: 'reguladores',
        subcategory_slug: 'carga',
        specifications: JSON.stringify({
            corriente_max: `${30 + (i * 10)}A`,
            voltaje_bateria: '12V/24V/48V Auto',
            eficiencia_rastreo: '99.9%',
        })
    }));
};

const generateKits = () => {
    const types = ['isolated', 'grid', 'hybrid'];
    let products = [];
    let count = 0;
    for (const t of types) {
        for (let i = 0; i < 4; i++) {
            count++;
            products.push({
                name: `Kit B2B Instalador ${t} Mod ${count}`,
                type: t,
                price: 2500 + (count * 400),
                total_power: 3 + (count * 0.5),
                monthly_finance_cost: 30 + (count * 5),
                description: 'Kit B2B completo especialmente diseñado para instalaciones rápidas.',
                image_url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80',
                category_slug: 'kits-solares',
                subcategory_slug: t === 'isolated' ? 'vivienda-aislada' : 'autoconsumo-red',
                specifications: JSON.stringify({
                    potencia_total: `${3 + (count * 0.5)}kW`,
                    tiempo_instalacion: '8h',
                    incluye_estructura: 'Sí',
                })
            });
        }
    }
    return products;
};

// Compile SQL
let sql = `
-- Seed Data for Solar B2B MV
BEGIN;

TRUNCATE TABLE "public"."kit_items" CASCADE;
TRUNCATE TABLE "public"."simulations" CASCADE;
TRUNCATE TABLE "public"."kits" CASCADE;
TRUNCATE TABLE "public"."order_items" CASCADE;
TRUNCATE TABLE "public"."orders" CASCADE;
TRUNCATE TABLE "public"."documents" CASCADE;
TRUNCATE TABLE "public"."products" CASCADE;
TRUNCATE TABLE "public"."profiles" CASCADE;
TRUNCATE TABLE "public"."companies" CASCADE;
TRUNCATE TABLE "public"."leads" CASCADE;

WITH new_companies AS (
    INSERT INTO "public"."companies" (cif, name, legal_name, address, city, postal_code, country, phone_number, tier, status) VALUES
    ('A12345678', 'SolarInstal Madrid', 'Instalaciones Solares Madrileñas S.A.', 'Calle Gran Vía 12', 'Madrid', '28013', 'España', '+34600100200', 'gold', 'validated'),
    ('B87654321', 'EcoEnergia Sur', 'Eco Energía Andalucía S.L.', 'Avenida de la Constitución 4', 'Sevilla', '41004', 'España', '+34600200300', 'silver', 'validated'),
    ('C11223344', 'Norte Renovables', 'Norte Renovables Vasco S.L.', 'Gran Vía de Don Diego 20', 'Bilbao', '48001', 'España', '+34600300400', 'bronze', 'pending_validation')
    RETURNING id, name, tier
),
new_products AS (
    INSERT INTO "public"."products" (name, type, price, base_price, sku, pack_quantity, voltage, stock_status, image_url, category_slug, subcategory_slug, specifications) VALUES \n`;

const allProds = [
    ...generatePanels(),
    ...generateInverters(),
    ...generateBatteries(),
    ...generateAccessories(),
    ...generateRegulators(),
];

const productValues = allProds.map(p => `    ('${p.name}', '${p.type}', ${p.price}, ${p.base_price}, '${p.sku}', ${p.pack_quantity}, ${p.voltage || 'NULL'}, '${p.stock_status}', '${p.image_url}', '${p.category_slug}', '${p.subcategory_slug}', '${p.specifications}')`);
sql += productValues.join(',\n') + '\n    RETURNING id, name, type\n),\n\n';

sql += `new_kits AS (
    INSERT INTO "public"."kits" (name, type, total_power, price, monthly_finance_cost, description, image_url, category_slug, subcategory_slug, specifications) VALUES \n`;

const kits = generateKits();
const kitValues = kits.map(k => `    ('${k.name}', '${k.type}', ${k.total_power}, ${k.price}, ${k.monthly_finance_cost}, '${k.description}', '${k.image_url}', '${k.category_slug}', '${k.subcategory_slug}', '${k.specifications}')`);
sql += kitValues.join(',\n') + '\n    RETURNING id, name, price\n);\n\n';

sql += `COMMIT;\n`;

fs.writeFileSync(SEED_FILE, sql);
console.log('Seed SQL regenerated successfully with B2B scalable schema.');
