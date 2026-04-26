import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, imgFallback } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();
  const [busy, setBusy]           = useState(false);

  const change = async (newQty) => {
    if (newQty < 1) return;
    setBusy(true);
    try { await updateQty(item.id, newQty); }
    catch { toast.error('Failed to update quantity'); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    setBusy(true);
    try { await removeItem(item.id); toast.success('Item removed'); }
    catch { toast.error('Failed to remove item'); }
    finally { setBusy(false); }
  };

  return (
    <div className="cart-item">
      <img
        src={item.product.imageUrl || imgFallback(item.product.name)}
        alt={item.product.name}
        className="cart-img"
        onError={(e) => { e.target.src = imgFallback(item.product.name); }}
      />
      <div className="cart-info">
        <p className="cart-name">{item.product.name}</p>
        <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>
          {item.product.category?.name}
        </p>
        <p className="cart-price">{formatPrice(item.product.price)}</p>
        <div className="qty-ctrl">
          <button className="qty-btn" onClick={() => change(item.quantity - 1)} disabled={busy || item.quantity <= 1}>−</button>
          <span className="qty-num">{item.quantity}</span>
          <button className="qty-btn" onClick={() => change(item.quantity + 1)} disabled={busy || item.quantity >= item.product.stock}>+</button>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem', marginBottom: '.5rem' }}>
          {formatPrice(item.product.price * item.quantity)}
        </p>
        <button className="btn btn-danger btn-sm" onClick={remove} disabled={busy}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
