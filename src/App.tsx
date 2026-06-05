import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import RouteScrollManager from './components/RouteScrollManager'
import FloatingWhatsApp from './sections/FloatingWhatsApp'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const FarmingTips = lazy(() => import('./pages/FarmingTips'))
const TipDetail = lazy(() => import('./pages/TipDetail'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminLostDevice = lazy(() => import('./pages/AdminLostDevice'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsDisclaimer = lazy(() => import('./pages/TermsDisclaimer'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4c9b8] border-t-[#1a3a2f]" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <RouteScrollManager />
      <FloatingWhatsApp />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/farming-tips" element={<FarmingTips />} />
          <Route path="/farming-tips/:id" element={<TipDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/lost-device" element={<AdminLostDevice />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-disclaimer" element={<TermsDisclaimer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
