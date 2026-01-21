
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SolarCalculator } from './components/SolarCalculator';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CatalogService } from './features/catalog/CatalogService';
import type { Kit } from './types';
import { Loader2 } from 'lucide-react';

import { SolarDsmSection } from './features/technology/SolarDsmSection';
import { ToastProvider } from './components/common/Toast';

import { InstallerSection } from './components/trust/InstallerSection';
import { CartProvider, useCart } from './context/CartContext';
import { useTranslation, Trans } from 'react-i18next';

function HomePage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    CatalogService.getKits().then(data => {
      setKits(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 space-y-24">

        {/* Hero / Calculator Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              <Trans i18nKey="hero.title" components={{ 1: <span className="text-primary" /> }} />
            </h1>
            <p className="text-lg text-slate-400">
              {t('hero.subtitle')}
            </p>
          </div>

          <SolarCalculator />
        </section>

        {/* Solar Mapping DSM Technology */}
        <SolarDsmSection />

        {/* Products Section - Bento Grid */}
        <section id="productos">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">
              {t('sections.featuredKits')}
            </h2>
            <button className="text-primary hover:text-primary/80 font-medium transition-colors">
              {t('common.viewAll')} →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
              {kits.map((kit, index) => (
                <div
                  key={kit.id}
                  className={index === 1 ? "md:col-span-2" : "md:col-span-1"}
                >
                  <div className="h-full">
                    <ProductCard
                      id={kit.id}
                      title={kit.name}
                      price={Number(kit.price)}
                      power={`${kit.total_power}kW`}
                      savings="Estimado 400€/año" // Still hardcoded for now or needs to be dynamic
                      popular={kit.type === 'hybrid'}
                      variant={index === 1 ? 'horizontal' : 'vertical'}
                      image={kit.image_url || undefined}
                      stock={kit.stock || Math.floor(Math.random() * 8)} // Demo Scarcity: Random stock < 8
                      onAddToCart={() => addItem(kit)}
                    />
                  </div>
                </div>
              ))}
              {/* Fallback if no kits found in DB locally yet */}
              {kits.length === 0 && (
                <div className="col-span-3 text-center text-slate-500">
                  No se encontraron kits en la base de datos.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Installers Section */}
        <InstallerSection />

        {/* Why Choose Us / Trust Section */}
        <section className="grid md:grid-cols-3 gap-8 py-12 border-t border-white/5">
          {[
            { title: t('sections.guarantee.title'), desc: t('sections.guarantee.desc') },
            { title: t('sections.installation.title'), desc: t('sections.installation.desc') },
            { title: t('sections.support.title'), desc: t('sections.support.desc') }
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
