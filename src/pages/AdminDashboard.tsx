import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Package,
  Mail,
  BookOpen,
  TrendingUp,
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  FileText,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import type { Enquiry, FarmingTip, Product } from '@db/schema';
import { siteConfig } from '@/config/site';

type TabType = 'overview' | 'products' | 'enquiries' | 'tips';
type ProductCategory = Product['category'];
type ProductForm = {
  name: string;
  category: ProductCategory;
  price: string;
  description: string;
  imageUrl: string;
  featured: boolean;
};

const sidebarItems: { id: TabType; label: string; icon: typeof Package }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'tips', label: 'Farming Tips', icon: FileText },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTip, setEditingTip] = useState<FarmingTip | null>(null);

  const [productForm, setProductForm] = useState<ProductForm>({
    name: '', category: 'fertilizers' as const, price: '', description: '', imageUrl: '', featured: false,
  });
  const [tipForm, setTipForm] = useState({ title: '', content: '', excerpt: '', imageUrl: '', date: '' });

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      navigate('/admin');
      return;
    }
    try {
      const parsed = JSON.parse(auth);
      const now = Date.now();
      if (!parsed.authenticated || now - parsed.timestamp >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem('admin_auth');
        navigate('/admin');
      }
    } catch {
      localStorage.removeItem('admin_auth');
      navigate('/admin');
    }
  }, [navigate]);

  const { data: products } = trpc.product.list.useQuery();
  const { data: enquiries } = trpc.enquiry.demoList.useQuery(undefined, {
    retry: false,
  });
  const { data: tips } = trpc.tip.list.useQuery();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    toast.success('Logged out');
    navigate('/admin');
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        featured: product.featured,
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', category: 'fertilizers', price: '', description: '', imageUrl: '', featured: false });
    }
    setShowProductModal(true);
  };

  const openTipModal = (tip?: FarmingTip) => {
    if (tip) {
      setEditingTip(tip);
      setTipForm({
        title: tip.title,
        content: tip.content,
        excerpt: tip.excerpt || '',
        imageUrl: tip.imageUrl,
        date: tip.date,
      });
    } else {
      setEditingTip(null);
      setTipForm({ title: '', content: '', excerpt: '', imageUrl: '', date: '' });
    }
    setShowTipModal(true);
  };

  const totalProducts = products?.length || 0;
  const totalEnquiries = enquiries?.length || 0;
  const totalTips = tips?.length || 0;
  const newEnquiries = enquiries?.filter((e) => e.status === 'new').length || 0;

  const categoryColors: Record<string, string> = {
    fertilizers: '#5c7a4a',
    pesticides: '#c75c2e',
    manure: '#8b7d6b',
    farm_inputs: '#1a3a2f',
    crop_protection: '#4a7c59',
  };

  const categoryLabels: Record<string, string> = {
    fertilizers: 'Fertilizers',
    pesticides: 'Pesticides',
    manure: 'Manure',
    farm_inputs: 'Farm Inputs',
    crop_protection: 'Crop Protection',
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col" style={{ backgroundColor: '#1a3a2f' }}>
        <div className="p-6">
          <Link to="/" className="text-[#f5f0e8] font-bold text-sm tracking-[3px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {siteConfig.name.toUpperCase()}
          </Link>
        </div>
        <nav className="flex-1 px-4 mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200"
              style={{
                color: activeTab === item.id ? '#f5f0e8' : 'rgba(245, 240, 232, 0.7)',
                borderLeft: activeTab === item.id ? '3px solid #c75c2e' : '3px solid transparent',
                backgroundColor: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: 'rgba(245, 240, 232, 0.7)' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] p-10">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {[
                { label: 'Total Products', value: totalProducts, icon: Package, color: '#1a3a2f' },
                { label: 'Total Enquiries', value: totalEnquiries, icon: Mail, color: '#c75c2e' },
                { label: 'Farming Tips', value: totalTips, icon: BookOpen, color: '#5c7a4a' },
                { label: 'New Enquiries', value: newEnquiries, icon: TrendingUp, color: '#4a7c59' },
              ].map((stat, i) => (
                <div key={i} className="p-6" style={{ backgroundColor: '#e8dfd1', border: '1px solid #d4c9b8' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-sm mt-1" style={{ color: '#8b7d6b' }}>{stat.label}</p>
                    </div>
                    <stat.icon size={24} style={{ color: stat.color, opacity: 0.5 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Enquiries */}
            <div className="mt-10">
              <h2 className="font-display text-xl mb-4" style={{ color: '#1a3a2f' }}>Recent Enquiries</h2>
              <div className="overflow-x-auto" style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #d4c9b8' }}>
                      {['Name', 'Email', 'Phone', 'Date', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries?.slice(0, 5).map((e) => (
                      <tr key={e.id} className="transition-colors hover:bg-[#e8dfd1]/50" style={{ borderBottom: '1px solid #d4c9b8' }}>
                        <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{e.name}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{e.email}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{e.phone || '-'}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: '#8b7d6b' }}>
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-0.5 text-white"
                            style={{ backgroundColor: e.status === 'new' ? '#c75c2e' : '#5c7a4a' }}
                          >
                            {e.status === 'new' ? 'New' : 'Replied'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!enquiries || enquiries.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#8b7d6b' }}>
                          No enquiries yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Products</h1>
              <button
                onClick={() => openProductModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#c75c2e' }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto" style={{ border: '1px solid #d4c9b8' }}>
              <table className="w-full" style={{ backgroundColor: '#f5f0e8' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #d4c9b8' }}>
                    {['Image', 'Name', 'Category', 'Price', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-[#e8dfd1]" style={{ borderBottom: '1px solid #d4c9b8' }}>
                      <td className="px-4 py-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover" />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1a3a2f' }}>{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 text-white" style={{ backgroundColor: categoryColors[p.category] || '#5c7a4a' }}>
                          {categoryLabels[p.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#c75c2e' }}>{p.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openProductModal(p)} className="p-1 transition-colors hover:opacity-70" style={{ color: '#5c7a4a' }} aria-label={`Edit ${p.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button className="p-1 transition-colors hover:opacity-70" style={{ color: '#c75c2e' }} aria-label={`Delete ${p.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!products || products.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#8b7d6b' }}>No products</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Enquiries</h1>
            <div className="overflow-x-auto mt-6" style={{ border: '1px solid #d4c9b8' }}>
              <table className="w-full" style={{ backgroundColor: '#f5f0e8' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #d4c9b8' }}>
                    {['Name', 'Email', 'Phone', 'Message', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enquiries?.map((e) => (
                    <tr key={e.id} className="transition-colors hover:bg-[#e8dfd1]" style={{ borderBottom: '1px solid #d4c9b8' }}>
                      <td className="px-4 py-3 text-sm" style={{ color: '#1a3a2f' }}>{e.name}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{e.email}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{e.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-[200px] truncate" style={{ color: '#3d3d3d' }}>{e.message}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: '#8b7d6b' }}>
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 text-white" style={{ backgroundColor: e.status === 'new' ? '#c75c2e' : '#5c7a4a' }}>
                          {e.status === 'new' ? 'New' : 'Replied'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedEnquiry(e); setShowEnquiryModal(true); }}
                            className="p-1 transition-colors hover:opacity-70"
                            style={{ color: '#5c7a4a' }}
                            aria-label={`View enquiry from ${e.name}`}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!enquiries || enquiries.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#8b7d6b' }}>No enquiries</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Farming Tips</h1>
              <button
                onClick={() => openTipModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#c75c2e' }}
              >
                <Plus size={16} /> Add Tip
              </button>
            </div>
            <div className="overflow-x-auto" style={{ border: '1px solid #d4c9b8' }}>
              <table className="w-full" style={{ backgroundColor: '#f5f0e8' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #d4c9b8' }}>
                    {['Title', 'Date', 'Excerpt', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tips?.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-[#e8dfd1]" style={{ borderBottom: '1px solid #d4c9b8' }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1a3a2f' }}>{t.title}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#8b7d6b' }}>{t.date}</td>
                      <td className="px-4 py-3 text-sm max-w-[300px] truncate" style={{ color: '#3d3d3d' }}>{t.excerpt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openTipModal(t)} className="p-1 transition-colors hover:opacity-70" style={{ color: '#5c7a4a' }} aria-label={`Edit ${t.title}`}>
                            <Pencil size={16} />
                          </button>
                          <button className="p-1 transition-colors hover:opacity-70" style={{ color: '#c75c2e' }} aria-label={`Delete ${t.title}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!tips || tips.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: '#8b7d6b' }}>No tips</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-8 md:p-10"
            style={{ backgroundColor: '#f5f0e8' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} style={{ color: '#8b7d6b' }} aria-label="Close product form">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Price</label>
                <input
                  type="text"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  placeholder="KSh 1,200"
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Image URL</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  placeholder="/images/product-name.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm" style={{ color: '#1a3a2f' }}>Featured product</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 text-sm font-semibold transition-all"
                  style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: '#c75c2e' }}
                  onClick={() => { toast.success('Product saved (demo mode)'); setShowProductModal(false); }}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-8 md:p-10"
            style={{ backgroundColor: '#f5f0e8' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>
                {editingTip ? 'Edit Tip' : 'Add Tip'}
              </h2>
              <button onClick={() => setShowTipModal(false)} style={{ color: '#8b7d6b' }} aria-label="Close tip form">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Title</label>
                <input
                  type="text"
                  value={tipForm.title}
                  onChange={(e) => setTipForm({ ...tipForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Content</label>
                <textarea
                  value={tipForm.content}
                  onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Image URL</label>
                <input
                  type="text"
                  value={tipForm.imageUrl}
                  onChange={(e) => setTipForm({ ...tipForm, imageUrl: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Date</label>
                <input
                  type="text"
                  value={tipForm.date}
                  onChange={(e) => setTipForm({ ...tipForm, date: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  placeholder="May 15, 2025"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTipModal(false)}
                  className="flex-1 py-3 text-sm font-semibold transition-all"
                  style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: '#c75c2e' }}
                  onClick={() => { toast.success('Tip saved (demo mode)'); setShowTipModal(false); }}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {showEnquiryModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[500px] p-8"
            style={{ backgroundColor: '#f5f0e8' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl" style={{ color: '#1a3a2f' }}>Enquiry Details</h2>
              <button onClick={() => setShowEnquiryModal(false)} style={{ color: '#8b7d6b' }} aria-label="Close enquiry details">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Name</p>
                <p className="text-sm mt-0.5" style={{ color: '#1a3a2f' }}>{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Email</p>
                <p className="text-sm mt-0.5" style={{ color: '#1a3a2f' }}>{selectedEnquiry.email}</p>
              </div>
              {selectedEnquiry.phone && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Phone</p>
                  <p className="text-sm mt-0.5" style={{ color: '#1a3a2f' }}>{selectedEnquiry.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Message</p>
                <p className="text-sm mt-0.5 leading-relaxed" style={{ color: '#3d3d3d' }}>{selectedEnquiry.message}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Date</p>
                <p className="text-sm mt-0.5" style={{ color: '#3d3d3d' }}>
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8b7d6b' }}>Status</p>
                <span
                  className="inline-block mt-0.5 text-xs px-2 py-0.5 text-white"
                  style={{ backgroundColor: selectedEnquiry.status === 'new' ? '#c75c2e' : '#5c7a4a' }}
                >
                  {selectedEnquiry.status === 'new' ? 'New' : 'Replied'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="w-full mt-6 py-3 text-sm font-semibold transition-all"
              style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
