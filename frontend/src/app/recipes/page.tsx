'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { getProductCategoryLabel } from '@/lib/utils';

interface Recipe {
  id: string;
  name: string;
  flourType: string;
  category: string;
  hydrationPct: number;
  fermentHours: number;
  bakeTemp: number;
  bakeMinutes: number;
  description?: string;
}

const emptyForm = {
  name: '',
  flourType: '',
  category: 'white_bread',
  hydrationPct: '65',
  fermentHours: '12',
  bakeTemp: '220',
  bakeMinutes: '35',
  description: '',
};

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadRecipes = () => {
    setLoading(true);
    api.getRecipes()
      .then(setRecipes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadRecipes(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createRecipe({
        name: form.name,
        flourType: form.flourType || undefined,
        category: form.category,
        hydrationPct: parseInt(form.hydrationPct, 10) || 65,
        fermentHours: parseInt(form.fermentHours, 10) || 12,
        bakeTemp: parseInt(form.bakeTemp, 10) || 220,
        bakeMinutes: parseInt(form.bakeMinutes, 10) || 35,
        description: form.description || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadRecipes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = recipes.filter((r) =>
    `${r.name} ${r.flourType} ${getProductCategoryLabel(r.category)}`.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Tarifler</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{recipes.length} kayıtlı tarif</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? 'İptal' : 'Yeni Tarif'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(166, 61, 47, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Tarif</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Tarif adı *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <input type="text" placeholder="Un tipi" value={form.flourType} onChange={(e) => setForm({ ...form, flourType: e.target.value })} className="input-field" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              <option value="sourdough">Ekşi Mayalı</option>
              <option value="white_bread">Beyaz Ekmek</option>
              <option value="pastry">Pastane</option>
              <option value="viennoiserie">Viennoiserie</option>
              <option value="special">Özel Ürün</option>
            </select>
            <input type="number" placeholder="Hidrasyon (%)" value={form.hydrationPct} onChange={(e) => setForm({ ...form, hydrationPct: e.target.value })} className="input-field" />
            <input type="number" placeholder="Fermantasyon (saat)" value={form.fermentHours} onChange={(e) => setForm({ ...form, fermentHours: e.target.value })} className="input-field" />
            <input type="number" placeholder="Pişirme sıcaklığı (°C)" value={form.bakeTemp} onChange={(e) => setForm({ ...form, bakeTemp: e.target.value })} className="input-field" />
            <input type="number" placeholder="Pişirme süresi (dk)" value={form.bakeMinutes} onChange={(e) => setForm({ ...form, bakeMinutes: e.target.value })} className="input-field" />
            <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-2 min-h-[80px]" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input type="search" placeholder="Tarif ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field mb-4 max-w-md" aria-label="Tarif ara" />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen tarif bulunamadı' : 'Henüz tarif bulunmuyor'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((recipe) => (
            <div key={recipe.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{recipe.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{recipe.flourType || '—'}</p>
                </div>
                <span className="badge-gold text-xs shrink-0">{getProductCategoryLabel(recipe.category)}</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div><span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Hidrasyon</span><span className="font-medium">%{recipe.hydrationPct}</span></div>
                <div><span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Fermantasyon</span><span className="font-medium">{recipe.fermentHours}s</span></div>
                <div><span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Sıcaklık</span><span className="font-medium">{recipe.bakeTemp}°C</span></div>
                <div><span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Süre</span><span className="font-medium">{recipe.bakeMinutes} dk</span></div>
              </div>
              {recipe.description && (
                <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{recipe.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </BottomNavLayout>
  );
}
