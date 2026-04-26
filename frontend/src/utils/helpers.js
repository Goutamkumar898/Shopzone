export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const statusColor = (status) => ({
  PENDING    : 'badge-pending',
  PROCESSING : 'badge-processing',
  SHIPPED    : 'badge-shipped',
  DELIVERED  : 'badge-delivered',
  CANCELLED  : 'badge-cancelled',
  SUCCESS    : 'badge-delivered',
  FAILED     : 'badge-cancelled',
  REFUNDED   : 'badge-processing',
}[status] || 'badge-pending');

export const truncate = (str, n = 60) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

export const imgFallback = (name) =>
  `https://via.placeholder.com/400x300/6c63ff/ffffff?text=${encodeURIComponent(name)}`;
