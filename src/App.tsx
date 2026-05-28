import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import FarmingTips from './pages/FarmingTips'
import TipDetail from './pages/TipDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsDisclaimer from './pages/TermsDisclaimer'
import RouteScrollManager from './components/RouteScrollManager'
import FloatingWhatsApp from './sections/FloatingWhatsApp'

export default function App() {
  return (
    <>
      <RouteScrollManager />
      <FloatingWhatsApp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/farming-tips" element={<FarmingTips />} />
        <Route path="/farming-tips/:id" element={<TipDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-disclaimer" element={<TermsDisclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
