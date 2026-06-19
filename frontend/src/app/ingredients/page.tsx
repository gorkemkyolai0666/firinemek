'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { formatCurrency, getIngredientCategoryLabel, getStorageLabel } from '@/lib/utils';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  storage: string;
  stockKg: number;
  unitCost?: number;
  supplier?: string;
  batchYear?: number;
}

const emptyForm = {
  name: '',
  category: 'other',
  storage: 'dry',
  stockKg: '',
  unitCost: '',
  supplier: '',
  batchYear: String(new Date().getFullYear()),
};

export default function IngredientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [beans, setBeans] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadBeans = () => {
    setLoading(true);
    api.getIngredients()
      .then(setBeans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadBeans(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createIngredient({
        name: form.name,
        category: form.category,
        storage: form.storage,
        stockKg: parseFloat(form.stockKg) || 0,
        unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined,
        supplier: form.supplier || undefined,
        batchYear: form.batchYear ? parseInt(form.batchYear, 10) : undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadBeans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hammaddeleri silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteIngredient(id);
      loadBeans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = beans.filter((b) =>
    `${b.name} ${getIngredientCategoryLabel(b.category)} ${getStorageLabel(b.storage)} ${b.supplier || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <BottomNavLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Hammadde</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{beans.length} kayıtlı hammadde</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? 'İptal' : 'Yeni Hammadde'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Hammadde</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Hammadde adı *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              <option value="flour">Un</option>
              <option value="dairy">Süt Ürünü</option>
              <option value="yeast">Maya</option>
              <option value="sugar">Şeker</option>
              <option value="grain">Tahıl</option>
              <option value="other">Diğer</option>
            </select>
            <select value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className="input-field">
              <option value="dry">Kuru Depo</option>
              <option value="refrigerated">Soğutmalı</option>
              <option value="frozen">Dondurulmuş</option>
              <option value="ambient">Oda Sıcaklığı</option>
            </select>
            <input type="number" step="0.1" min="0" placeholder="Stok (kg) *" value={form.stockKg} onChange={(e) => setForm({ ...form, stockKg: e.target.value })} className="input-field" required />
            <input type="number" step="0.01" min="0" placeholder="Birim maliyet (₺/kg)" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} className="input-field" />
            <input type="text" placeholder="Tedarikçi" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field" />
            <input type="number" placeholder="Parti yılı" value={form.batchYear} onChange={(e) => setForm({ ...form, batchYear: e.target.value })} className="input-field" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Hammadde ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Hammadde ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen hammadde bulunamadı' : 'Henüz hammadde kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Ad</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Kategori</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Depolama</th>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Stok</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Maliyet</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Tedarikçi</th>
                  <th className="text-right p-4 font-medium" style={{ color: 'var(--text-muted)' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bean) => (
                  <tr key={bean.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="p-4">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{bean.name}</div>
                      {bean.batchYear && (
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{bean.batchYear} parti</div>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{getIngredientCategoryLabel(bean.category)}</td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{getStorageLabel(bean.storage)}</td>
                    <td className="p-4">
                      <span className={bean.stockKg < 20 ? 'badge-danger' : 'badge-success'}>
                        {bean.stockKg} kg
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {bean.unitCost ? formatCurrency(bean.unitCost) : '—'}
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{bean.supplier || '—'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(bean.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </BottomNavLayout>
  );
}
