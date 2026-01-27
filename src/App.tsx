import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SolarCalculator } from './components/SolarCalculator';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { SolarDsmSection } from './features/technology/SolarDsmSection';
import { ToastProvider } from './components/common/Toast';
import { InstallerSection } from './components/trust/InstallerSection';
import { CartProvider } from './context/CartContext';
import { useTranslation } from 'react-i18next';
import { LeadFormModal } from './components/common/LeadFormModal';
import { HeroSection } from './components/layout/HeroSection';
import { TestimonialsSection } from './components/trust/TestimonialsSection';
import { CatalogSection } from './features/catalog/CatalogSection';

function HomePage() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const { t } = useTranslation();

  const scrollToSimulator = () => {
    const element = document.getElementById('calculator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection onScrollToSimulator={scrollToSimulator} />

      <div className="container mx-auto px-4 py-12 space-y-24">
        {/* Calculator Section */}
        <div id="calculator" className="scroll-mt-24">
          <SolarCalculator onReserveClick={() => setIsLeadFormOpen(true)} />
        </div>

        {/* Solar Mapping DSM Technology */}
        <SolarDsmSection />

        {/* Products Section */}
        <div id="productos" className="scroll-mt-32">
          <CatalogSection />
        </div>

        <LeadFormModal
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
        />

        {/* Installers Section */}
        <InstallerSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Why Choose Us / Trust Section */}
        <section className="grid md:grid-cols-3 gap-8 py-12 border-t border-border/50">
          {[
            { title: t('sections.guarantee.title'), desc: t('sections.guarantee.desc') },
            { title: t('sections.installation.title'), desc: t('sections.installation.desc') },
            { title: t('sections.support.title'), desc: t('sections.support.desc') }
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-secondary/20 border border-white/5">
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* Protected Routes Example */}
            <Route element={<ProtectedRoute />}>
              {/* Add protected routes here later, e.g. /profile, /orders */}
            </Route>

            {/* Admin Routes Example */}
            <Route element={<ProtectedRoute requireAdmin />}>
              {/* Add admin routes here later, e.g. /admin/dashboard */}
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
