import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SolarCalculator } from './components/SolarCalculator';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { UpdatePasswordPage } from './features/auth/pages/UpdatePasswordPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { SolarDsmSection } from './features/technology/SolarDsmSection';
import { ToastProvider } from './components/common/Toast';

import { CartProvider } from './context/CartContext';
import { useTranslation } from 'react-i18next';
import { CartPage } from './pages/CartPage';
import { LeadFormModal } from './components/common/LeadFormModal';
import { HeroSection } from './components/layout/HeroSection';
import { TestimonialsSection } from './components/trust/TestimonialsSection';
import { CatalogSection } from './features/catalog/CatalogSection';
import { OrdersPage } from './features/account/pages/OrdersPage';
import { ShippingPage } from './features/account/pages/ShippingPage';
import { ReturnsPage } from './features/account/pages/ReturnsPage';
import { ProfilePage } from './features/account/pages/ProfilePage';
import { PresupuestoPage } from './pages/contacto/PresupuestoPage';
import { GuiaPage } from './pages/contacto/GuiaPage';
import { FormularioPage } from './pages/contacto/FormularioPage';
import { LlamarPage } from './pages/contacto/LlamarPage';
import { FaqPage } from './pages/contacto/FaqPage';

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

      <div className="container mx-auto px-4 py-12 space-y-12">
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
  const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl max-w-lg w-full border border-red-500/20 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Setup Required</h1>
          <p className="text-slate-400 mb-6">The application is deployed but needs configuration to connect to the database.</p>

          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Missing Environment Variables</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex items-center gap-2 text-red-400">
                <span className="w-4 h-4 flex items-center justify-center">×</span> VITE_SUPABASE_URL
              </li>
              <li className="flex items-center gap-2 text-red-400">
                <span className="w-4 h-4 flex items-center justify-center">×</span> VITE_SUPABASE_ANON_KEY
              </li>
            </ul>
          </div>

          <div className="text-sm text-slate-500">
            Go to <span className="text-white font-medium">Vercel Dashboard &gt; Settings &gt; Environment Variables</span> to add them.
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/categoria/:categorySlug" element={
              <Layout>
                <div className="container mx-auto px-4 py-24 min-h-screen">
                  <CatalogSection />
                </div>
              </Layout>
            } />
            <Route path="/categoria/:categorySlug/:subcategorySlug" element={
              <Layout>
                <div className="container mx-auto px-4 py-24 min-h-screen">
                  <CatalogSection />
                </div>
              </Layout>
            } />

            {/* Contacto Routes */}
            <Route path="/contacto/presupuesto" element={<Layout><PresupuestoPage /></Layout>} />
            <Route path="/contacto/guia" element={<Layout><GuiaPage /></Layout>} />
            <Route path="/contacto/formulario" element={<Layout><FormularioPage /></Layout>} />
            <Route path="/contacto/llamar" element={<Layout><LlamarPage /></Layout>} />
            <Route path="/contacto/faq" element={<Layout><FaqPage /></Layout>} />

            {/* Protected Routes Example */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

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
