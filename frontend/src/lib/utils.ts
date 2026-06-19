import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-success',
    delivered: 'badge-success',
    confirmed: 'badge-success',
    packed: 'badge-gold',
    planned: 'badge-info',
    quoted: 'badge-info',
    baking: 'badge-warning',
    in_progress: 'badge-warning',
    cooling: 'badge-warning',
    cancelled: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    planned: 'Planlandı',
    confirmed: 'Onaylandı',
    in_progress: 'Fırında',
    cooling: 'Soğutuluyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
    quoted: 'Teklif',
    baking: 'Pişiriliyor',
    packed: 'Paketlendi',
    delivered: 'Teslim Edildi',
  };
  return labels[status] || status;
}

export function getProductionBatchTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    daily_bread: 'Günlük Ekmek',
    pastry_batch: 'Pastane Partisi',
    special_order: 'Özel Sipariş',
    trial: 'Deneme',
    training: 'Eğitim',
  };
  return labels[type] || type;
}

export function getProductCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sourdough: 'Ekşi Mayalı',
    white_bread: 'Beyaz Ekmek',
    pastry: 'Pastane',
    viennoiserie: 'Viennoiserie',
    special: 'Özel Ürün',
  };
  return labels[category] || category;
}

export function getIngredientCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    flour: 'Un',
    dairy: 'Süt Ürünü',
    yeast: 'Maya',
    sugar: 'Şeker',
    grain: 'Tahıl',
    other: 'Diğer',
  };
  return labels[category] || category;
}

export function getStorageLabel(storage: string): string {
  const labels: Record<string, string> = {
    dry: 'Kuru Depo',
    refrigerated: 'Soğutmalı',
    frozen: 'Dondurulmuş',
    ambient: 'Oda Sıcaklığı',
  };
  return labels[storage] || storage;
}

export function getOrderStatusLabel(status: string): string {
  return getStatusLabel(status);
}
