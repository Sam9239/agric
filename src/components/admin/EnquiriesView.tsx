import { useMemo, useState } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  CheckCircle2,
  RefreshCcw,
  Paperclip,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import type { Enquiry } from '@db/schema';

type StatusFilter = 'all' | 'new' | 'replied';
type Sort = 'newest' | 'oldest';

function parseImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === 'string') : [];
  } catch {
    return [];
  }
}

function whatsappLink(phone: string | null, name: string) {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return null;
  const message = `Hello ${name.split(' ')[0]}, this is Jaosef Agro Supplies replying to your enquiry.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function mailtoLink(email: string, name: string) {
  const subject = encodeURIComponent('Re: Your enquiry with Jaosef Agro Supplies');
  const body = encodeURIComponent(`Hello ${name.split(' ')[0]},\n\nThank you for your enquiry. `);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export default function EnquiriesView() {
  const utils = trpc.useUtils();
  const { data: enquiries } = trpc.enquiry.list.useQuery();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const updateStatus = trpc.enquiry.updateStatus.useMutation({
    onSuccess: () => {
      utils.enquiry.list.invalidate();
      utils.enquiry.stats.invalidate();
    },
    onError: () => toast.error('Could not update status'),
  });

  const deleteEnquiry = trpc.enquiry.delete.useMutation({
    onSuccess: () => {
      utils.enquiry.list.invalidate();
      utils.enquiry.stats.invalidate();
      setSelectedId(null);
      setShowMobileDetail(false);
      toast.success('Enquiry deleted');
    },
    onError: () => toast.error('Could not delete enquiry'),
  });

  const filteredAndSorted = useMemo(() => {
    const items = enquiries ?? [];
    const q = query.trim().toLowerCase();
    const filtered = items.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.phone ?? '').toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    });
    filtered.sort((a, b) => {
      const aTs = new Date(a.createdAt).getTime();
      const bTs = new Date(b.createdAt).getTime();
      return sort === 'newest' ? bTs - aTs : aTs - bTs;
    });
    return filtered;
  }, [enquiries, query, statusFilter, sort]);

  const selected =
    filteredAndSorted.find((e) => e.id === selectedId) ??
    filteredAndSorted[0] ??
    null;
  const activeSelectedId = selected?.id ?? null;

  function openOnMobile(e: Enquiry) {
    setSelectedId(e.id);
    setShowMobileDetail(true);
  }

  function handleDelete(e: Enquiry) {
    if (!window.confirm(`Delete enquiry from ${e.name}? This cannot be undone.`)) return;
    deleteEnquiry.mutate({ id: e.id });
  }

  function toggleStatus(e: Enquiry) {
    updateStatus.mutate({
      id: e.id,
      status: e.status === 'new' ? 'replied' : 'new',
    });
  }

  const newCount = (enquiries ?? []).filter((e) => e.status === 'new').length;
  const totalCount = (enquiries ?? []).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>Enquiries</h1>
          <p className="mt-1 text-sm" style={{ color: '#8b7d6b' }}>
            {totalCount} total · {newCount} new
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3" style={{ color: '#1a3a2f' }}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8b7d6b' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-white outline-none transition-colors focus:border-[#c75c2e]"
            style={{ border: '1px solid #d4c9b8' }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2.5 text-sm bg-white outline-none focus:border-[#c75c2e]"
            style={{ border: '1px solid #d4c9b8' }}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="px-3 py-2.5 text-sm bg-white outline-none focus:border-[#c75c2e]"
            style={{ border: '1px solid #d4c9b8' }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Split view */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 lg:gap-5"
        style={{ minHeight: '60vh' }}
      >
        {/* List panel */}
        <div
          className={`${showMobileDetail ? 'hidden lg:block' : 'block'} overflow-hidden`}
          style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}
        >
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredAndSorted.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: '#8b7d6b' }}>
                {query || statusFilter !== 'all'
                  ? 'No matching enquiries.'
                  : 'No enquiries yet.'}
              </div>
            )}
            {filteredAndSorted.map((e) => {
              const isSelected = e.id === activeSelectedId;
              const images = parseImageUrls(e.imageUrls);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => (window.innerWidth < 1024 ? openOnMobile(e) : setSelectedId(e.id))}
                  className="w-full text-left p-4 transition-colors block"
                  style={{
                    backgroundColor: isSelected ? '#e8dfd1' : 'transparent',
                    borderBottom: '1px solid #d4c9b8',
                    borderLeft: isSelected ? '3px solid #c75c2e' : '3px solid transparent',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm truncate" style={{ color: '#1a3a2f' }}>
                      {e.name}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 text-white flex-shrink-0"
                      style={{ backgroundColor: e.status === 'new' ? '#c75c2e' : '#5c7a4a' }}
                    >
                      {e.status === 'new' ? 'NEW' : 'REPLIED'}
                    </span>
                  </div>
                  <p className="text-xs truncate mb-1.5" style={{ color: '#8b7d6b' }}>{e.email}</p>
                  <p className="text-xs leading-snug line-clamp-2" style={{ color: '#3d3d3d' }}>
                    {e.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px]" style={{ color: '#8b7d6b' }}>
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                    {images.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Paperclip size={11} />
                        {images.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div
          className={`${showMobileDetail ? 'block' : 'hidden lg:block'}`}
          style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}
        >
          {!selected ? (
            <div className="p-10 text-center text-sm h-full flex flex-col items-center justify-center" style={{ color: '#8b7d6b' }}>
              <MessageSquare size={32} className="mb-3 opacity-50" />
              Select an enquiry to view details.
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setShowMobileDetail(false)}
                className="lg:hidden mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: '#c75c2e' }}
              >
                ← Back to list
              </button>

              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#1a3a2f' }}>
                    {selected.name}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: '#8b7d6b' }}>
                    Received {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 text-white flex-shrink-0"
                  style={{ backgroundColor: selected.status === 'new' ? '#c75c2e' : '#5c7a4a' }}
                >
                  {selected.status === 'new' ? 'NEW' : 'REPLIED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 p-3 text-sm transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                >
                  <Mail size={14} style={{ color: '#5c7a4a' }} />
                  <span className="truncate">{selected.email}</span>
                </a>
                {selected.phone ? (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 p-3 text-sm transition-colors hover:opacity-80"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                  >
                    <Phone size={14} style={{ color: '#5c7a4a' }} />
                    <span>{selected.phone}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 p-3 text-sm" style={{ backgroundColor: '#ffffff', border: '1px dashed #d4c9b8', color: '#8b7d6b' }}>
                    <Phone size={14} />
                    <span>No phone</span>
                  </div>
                )}
              </div>

              {/* Quick reply actions */}
              <div className="mb-6 flex flex-wrap gap-2">
                {whatsappLink(selected.phone, selected.name) && (
                  <a
                    href={whatsappLink(selected.phone, selected.name) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: '#25d366' }}
                  >
                    <MessageCircle size={14} />
                    Reply via WhatsApp
                  </a>
                )}
                <a
                  href={mailtoLink(selected.email, selected.name)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: '#1a3a2f' }}
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => toggleStatus(selected)}
                  disabled={updateStatus.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: '#e8dfd1',
                    color: '#1a3a2f',
                    border: '1px solid #d4c9b8',
                  }}
                >
                  {selected.status === 'new' ? (
                    <>
                      <CheckCircle2 size={14} /> Mark Replied
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={14} /> Mark New
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selected)}
                  disabled={deleteEnquiry.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'transparent', color: '#c75c2e', border: '1px solid #c75c2e' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8b7d6b' }}>
                  Message
                </p>
                <div
                  className="p-4 sm:p-5 text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8', color: '#3d3d3d' }}
                >
                  {selected.message}
                </div>
              </div>

              {/* Attached images */}
              {(() => {
                const images = parseImageUrls(selected.imageUrls);
                if (images.length === 0) return null;
                return (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: '#8b7d6b' }}>
                      <ImageIcon size={13} />
                      Attached images ({images.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {images.map((url, i) => (
                        <button
                          key={`${url}-${i}`}
                          type="button"
                          onClick={() => setLightboxUrl(url)}
                          className="block aspect-square overflow-hidden transition-transform hover:scale-[1.03]"
                          style={{ border: '1px solid #d4c9b8', backgroundColor: '#e8dfd1' }}
                        >
                          <img
                            src={url}
                            alt={`Enquiry attachment ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(245, 240, 232, 0.15)', color: '#f5f0e8' }}
            aria-label="Close image"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxUrl}
            alt="Enquiry attachment full size"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
