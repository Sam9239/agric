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
  X,
  Upload,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';
import { productCategories, type CatalogueProduct, type ProductCategory } from '@contracts/product-catalog';
import type { FarmingTip } from '@db/schema';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import EnquiriesView from '@/components/admin/EnquiriesView';

type TabType = 'overview' | 'products' | 'enquiries' | 'tips' | 'siteContent' | 'security';
type ProductForm = {
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  specs: string;
  bestSuitedFor: string;
  usageTip: string;
  safetyNote: string;
  packSizes: string;
  imageUrl: string;
  featured: boolean;
  activeIngredient: string;
  formulation: string;
  targetUse: string;
  registeredCropUse: string;
  pcpbStatus: string;
  phi: string;
  rei: string;
  ppe: string;
  storageWarning: string;
};

const emptyProductForm: ProductForm = {
  name: '',
  category: 'crop_nutrition',
  shortDescription: '',
  description: '',
  specs: '',
  bestSuitedFor: '',
  usageTip: '',
  safetyNote: '',
  packSizes: '',
  imageUrl: '',
  featured: false,
  activeIngredient: '',
  formulation: '',
  targetUse: '',
  registeredCropUse: '',
  pcpbStatus: '',
  phi: '',
  rei: '',
  ppe: '',
  storageWarning: '',
};

const sidebarItems: { id: TabType; label: string; icon: typeof Package }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'tips', label: 'Farming Tips', icon: FileText },
  { id: 'siteContent', label: 'Site Content', icon: Settings },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogueProduct | null>(null);
  const [editingTip, setEditingTip] = useState<FarmingTip | null>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<'product' | 'tip' | null>(null);
  const [totpSetup, setTotpSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [totpEnableCode, setTotpEnableCode] = useState('');
  const [totpDisableCode, setTotpDisableCode] = useState('');

  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [tipForm, setTipForm] = useState({ title: '', content: '', excerpt: '', imageUrl: '', date: '' });

  const { data: adminSession, isLoading: isCheckingAdmin } = trpc.auth.adminMe.useQuery();

  const productUtils = trpc.useUtils();
  const { data: products } = trpc.product.list.useQuery();
  const { data: enquiries } = trpc.enquiry.list.useQuery(undefined, {
    retry: false,
    enabled: adminSession?.authenticated === true,
  });
  const { data: tips } = trpc.tip.list.useQuery();
  const { data: totpStatus } = trpc.adminSecurity.status.useQuery(undefined, {
    enabled: adminSession?.authenticated === true,
  });
  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      productUtils.product.list.invalidate();
      productUtils.product.featured.invalidate();
      toast.success('Product saved');
      setShowProductModal(false);
    },
  });
  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      productUtils.product.list.invalidate();
      productUtils.product.featured.invalidate();
      toast.success('Product updated');
      setShowProductModal(false);
    },
  });
  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      productUtils.product.list.invalidate();
      productUtils.product.featured.invalidate();
      toast.success('Product deleted');
    },
  });
  const createTip = trpc.tip.create.useMutation({
    onSuccess: () => {
      productUtils.tip.list.invalidate();
      productUtils.tip.recent.invalidate();
      toast.success('Tip saved');
      setShowTipModal(false);
    },
  });
  const updateTip = trpc.tip.update.useMutation({
    onSuccess: () => {
      productUtils.tip.list.invalidate();
      productUtils.tip.recent.invalidate();
      toast.success('Tip updated');
      setShowTipModal(false);
    },
  });
  const deleteTip = trpc.tip.delete.useMutation({
    onSuccess: () => {
      productUtils.tip.list.invalidate();
      productUtils.tip.recent.invalidate();
      toast.success('Tip deleted');
    },
  });
  const adminLogout = trpc.auth.adminLogout.useMutation({
    onSuccess: () => {
      toast.success('Logged out');
      navigate('/admin');
    },
  });
  const setupTotp = trpc.adminSecurity.setupTotp.useMutation({
    onSuccess: (data) => {
      setTotpSetup(data);
      setTotpEnableCode('');
    },
  });
  const enableTotp = trpc.adminSecurity.enableTotp.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast.error('Invalid authenticator code');
        return;
      }
      productUtils.adminSecurity.status.invalidate();
      setTotpSetup(null);
      setTotpEnableCode('');
      toast.success('Authenticator enabled');
    },
  });
  const disableTotp = trpc.adminSecurity.disableTotp.useMutation({
    onSuccess: (result) => {
      if (result.managedByEnv) {
        toast.error('Authenticator is controlled by the server environment');
        return;
      }
      if (!result.success) {
        toast.error('Invalid authenticator code');
        return;
      }
      productUtils.adminSecurity.status.invalidate();
      setTotpDisableCode('');
      toast.success('Authenticator disabled');
    },
  });

  useEffect(() => {
    if (!isCheckingAdmin && adminSession?.authenticated === false) {
      navigate('/admin');
    }
  }, [adminSession?.authenticated, isCheckingAdmin, navigate]);

  const handleLogout = () => {
    adminLogout.mutate();
  };

  const uploadImage = async (file: File, target: 'product' | 'tip') => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImageFor(target);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const payload = await response.json() as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Image upload failed');
      }

      if (target === 'product') {
        setProductForm((current) => ({ ...current, imageUrl: payload.url || current.imageUrl }));
      } else {
        setTipForm((current) => ({ ...current, imageUrl: payload.url || current.imageUrl }));
      }

      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploadingImageFor(null);
    }
  };

  const openProductModal = (product?: CatalogueProduct) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.description,
        specs: product.specs,
        bestSuitedFor: product.bestSuitedFor,
        usageTip: product.usageTip,
        safetyNote: product.safetyNote,
        packSizes: product.packSizes,
        imageUrl: product.imageUrl,
        featured: product.featured,
        activeIngredient: product.activeIngredient || '',
        formulation: product.formulation || '',
        targetUse: product.targetUse || '',
        registeredCropUse: product.registeredCropUse || '',
        pcpbStatus: product.pcpbStatus || '',
        phi: product.phi || '',
        rei: product.rei || '',
        ppe: product.ppe || '',
        storageWarning: product.storageWarning || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm(emptyProductForm);
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
    crop_nutrition: '#5c7a4a',
    seeds: '#4a7c59',
    soil_health: '#8b7d6b',
    crop_protection: '#4a7c59',
    irrigation: '#2f6f73',
    tools: '#1a3a2f',
    nursery: '#6f8d45',
    safety: '#c75c2e',
    post_harvest: '#78624d',
    livestock_feeds: '#7a5c2e',
    animal_health: '#8b3a2f',
    livestock_equipment: '#2f5f5f',
  };

  const categoryLabels = productCategories;

  const trimProductForm = (): ProductForm => ({
    ...productForm,
    name: productForm.name.trim(),
    shortDescription: productForm.shortDescription.trim(),
    description: productForm.description.trim(),
    specs: productForm.specs.trim(),
    bestSuitedFor: productForm.bestSuitedFor.trim(),
    usageTip: productForm.usageTip.trim(),
    safetyNote: productForm.safetyNote.trim(),
    packSizes: productForm.packSizes.trim(),
    imageUrl: productForm.imageUrl.trim(),
    activeIngredient: productForm.activeIngredient.trim(),
    formulation: productForm.formulation.trim(),
    targetUse: productForm.targetUse.trim(),
    registeredCropUse: productForm.registeredCropUse.trim(),
    pcpbStatus: productForm.pcpbStatus.trim(),
    phi: productForm.phi.trim(),
    rei: productForm.rei.trim(),
    ppe: productForm.ppe.trim(),
    storageWarning: productForm.storageWarning.trim(),
  });

  const saveProduct = () => {
    const values = trimProductForm();
    if (!values.name || !values.shortDescription || !values.description || !values.imageUrl) {
      toast.error('Please complete product name, short description, description, and image URL');
      return;
    }

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...values });
    } else {
      createProduct.mutate(values);
    }
  };

  const saveTip = () => {
    const values = {
      title: tipForm.title.trim(),
      content: tipForm.content.trim(),
      excerpt: tipForm.excerpt.trim(),
      imageUrl: tipForm.imageUrl.trim(),
      date: tipForm.date.trim(),
    };
    if (!values.title || !values.content || !values.excerpt || !values.imageUrl || !values.date) {
      toast.error('Please complete title, content, excerpt, image URL, and date');
      return;
    }

    if (editingTip) {
      updateTip.mutate({ id: editingTip.id, ...values });
    } else {
      createTip.mutate(values);
    }
  };

  const handleDeleteProduct = (product: CatalogueProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    deleteProduct.mutate({ id: product.id });
  };

  const handleDeleteTip = (tip: FarmingTip) => {
    if (!window.confirm(`Delete "${tip.title}"? This cannot be undone.`)) return;
    deleteTip.mutate({ id: tip.id });
  };

  if (isCheckingAdmin) {
    return <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Sidebar */}
      <aside className="sticky top-0 z-40 w-full md:fixed md:left-0 md:top-0 md:bottom-0 md:w-[240px] flex flex-col" style={{ backgroundColor: '#1a3a2f' }}>
        <div className="p-4 md:p-6">
          <Link to="/" className="text-[#f5f0e8] font-bold text-sm tracking-[3px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {siteConfig.name.toUpperCase()}
          </Link>
        </div>
        <nav className="flex md:flex-1 gap-2 overflow-x-auto px-4 pb-4 md:mt-4 md:block md:space-y-1 md:overflow-visible md:pb-0">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 md:w-full md:gap-3 md:px-4 md:py-3"
              style={{
                color: activeTab === item.id ? '#f5f0e8' : 'rgba(245, 240, 232, 0.7)',
                borderLeft: activeTab === item.id ? '3px solid #c75c2e' : '3px solid transparent',
                backgroundColor: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <item.icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 md:hidden"
            style={{ color: 'rgba(245, 240, 232, 0.7)' }}
          >
            <LogOut size={18} />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </nav>
        <div className="hidden md:block p-4">
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
      <main className="flex-1 p-4 sm:p-6 md:ml-[240px] md:p-10">
        {activeTab === 'siteContent' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <SiteContentEditor />
          </motion.div>
        )}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Security</h1>

            <div className="mt-8 max-w-[760px] p-6" style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                    Authenticator App
                  </p>
                  <h2 className="mt-2 font-display text-2xl" style={{ color: '#1a3a2f' }}>
                    Two-factor authentication
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                    When enabled, admin login requires the password and a 6-digit code from an authenticator app.
                  </p>
                </div>
                <span
                  className="inline-flex w-fit px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: totpStatus?.enabled ? '#5c7a4a' : '#8b7d6b' }}
                >
                  {totpStatus?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {totpStatus?.managedByEnv && (
                <p className="mt-5 p-3 text-sm" style={{ backgroundColor: '#e8dfd1', color: '#3d3d3d' }}>
                  Authenticator login is currently controlled by <code>ADMIN_TOTP_SECRET</code> in the server environment. Remove that env var to manage it here.
                </p>
              )}

              {!totpStatus?.enabled && !totpSetup && (
                <button
                  type="button"
                  onClick={() => setupTotp.mutate()}
                  disabled={setupTotp.isPending}
                  className="mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#c75c2e' }}
                >
                  {setupTotp.isPending ? 'Preparing...' : 'Enable authenticator'}
                </button>
              )}

              {!totpStatus?.enabled && totpSetup && (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-4">
                    {[
                      'Open Google Authenticator, Microsoft Authenticator, 1Password, or another authenticator app.',
                      'Choose to add a new login and use the setup key below.',
                      'Enter the 6-digit code from the app to finish enabling authenticator login.',
                    ].map((step, index) => (
                      <div key={step} className="flex gap-3">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#1a3a2f', color: '#f5f0e8' }}
                        >
                          {index + 1}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4" style={{ backgroundColor: '#e8dfd1', border: '1px solid #d4c9b8' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>Setup key</p>
                    <p className="mt-2 break-all font-mono text-sm" style={{ color: '#1a3a2f' }}>{totpSetup.secret}</p>
                  </div>

                  <details className="text-sm" style={{ color: '#3d3d3d' }}>
                    <summary className="cursor-pointer font-semibold" style={{ color: '#1a3a2f' }}>Advanced setup URI</summary>
                    <p className="mt-2 break-all font-mono text-xs">{totpSetup.uri}</p>
                  </details>

                  <div>
                    <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Verification code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={totpEnableCode}
                      onChange={(e) => setTotpEnableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full max-w-[260px] mt-1 px-3 py-2.5 text-sm outline-none"
                      style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                      placeholder="123456"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => enableTotp.mutate({ secret: totpSetup.secret, code: totpEnableCode })}
                      disabled={enableTotp.isPending || totpEnableCode.length !== 6}
                      className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                      style={{ backgroundColor: '#c75c2e' }}
                    >
                      {enableTotp.isPending ? 'Verifying...' : 'Verify and enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTotpSetup(null);
                        setTotpEnableCode('');
                      }}
                      className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold transition-all"
                      style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {totpStatus?.enabled && !totpStatus.managedByEnv && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                    To disable authenticator login, enter a current 6-digit code first.
                  </p>
                  <div>
                    <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Current authenticator code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={totpDisableCode}
                      onChange={(e) => setTotpDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full max-w-[260px] mt-1 px-3 py-2.5 text-sm outline-none"
                      style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                      placeholder="123456"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => disableTotp.mutate({ code: totpDisableCode })}
                    disabled={disableTotp.isPending || totpDisableCode.length !== 6}
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#c75c2e' }}
                  >
                    {disableTotp.isPending ? 'Disabling...' : 'Disable authenticator'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
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
                    {['Image', 'Name', 'Category', 'Featured', 'Actions'].map((h) => (
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
                      <td className="px-4 py-3 text-sm" style={{ color: '#3d3d3d' }}>{p.featured ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openProductModal(p)} className="p-1 transition-colors hover:opacity-70" style={{ color: '#5c7a4a' }} aria-label={`Edit ${p.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p)} className="p-1 transition-colors hover:opacity-70" style={{ color: '#c75c2e' }} aria-label={`Delete ${p.name}`}>
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
            <EnquiriesView />
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
                          <button onClick={() => handleDeleteTip(t)} className="p-1 transition-colors hover:opacity-70" style={{ color: '#c75c2e' }} aria-label={`Delete ${t.title}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Short Description</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
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
              {[
                ['specs', 'Specs'],
                ['bestSuitedFor', 'Best Suited For'],
                ['usageTip', 'Usage Tip'],
                ['safetyNote', 'Safety Note'],
                ['packSizes', 'Pack Sizes'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>{label}</label>
                  <input
                    type="text"
                    value={productForm[field as keyof ProductForm] as string}
                    onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                    style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  />
                </div>
              ))}
              {productForm.category === 'crop_protection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    ['activeIngredient', 'Active Ingredient'],
                    ['formulation', 'Formulation'],
                    ['targetUse', 'Target Pest/Disease/Weed'],
                    ['registeredCropUse', 'Registered Crop Use'],
                    ['pcpbStatus', 'PCPB Status'],
                    ['phi', 'PHI'],
                    ['rei', 'REI'],
                    ['ppe', 'PPE Required'],
                    ['storageWarning', 'Storage Warning'],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>{label}</label>
                      <input
                        type="text"
                        value={productForm[field as keyof ProductForm] as string}
                        onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                        className="w-full mt-1 px-3 py-2.5 text-sm outline-none"
                        style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                      />
                    </div>
                  ))}
                </div>
              )}
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
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label
                    className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: '#5c7a4a' }}
                  >
                    <Upload size={16} />
                    {uploadingImageFor === 'product' ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      disabled={uploadingImageFor !== null}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, 'product');
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {productForm.imageUrl && (
                    <img
                      src={productForm.imageUrl}
                      alt="Product preview"
                      className="h-14 w-14 object-cover"
                      style={{ border: '1px solid #d4c9b8' }}
                    />
                  )}
                </div>
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
                  onClick={saveProduct}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                <label className="text-sm font-medium" style={{ color: '#1a3a2f' }}>Excerpt</label>
                <textarea
                  value={tipForm.excerpt}
                  onChange={(e) => setTipForm({ ...tipForm, excerpt: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                  rows={3}
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
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label
                    className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: '#5c7a4a' }}
                  >
                    <Upload size={16} />
                    {uploadingImageFor === 'tip' ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      disabled={uploadingImageFor !== null}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadImage(file, 'tip');
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {tipForm.imageUrl && (
                    <img
                      src={tipForm.imageUrl}
                      alt="Tip preview"
                      className="h-14 w-20 object-cover"
                      style={{ border: '1px solid #d4c9b8' }}
                    />
                  )}
                </div>
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
                  onClick={saveTip}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
