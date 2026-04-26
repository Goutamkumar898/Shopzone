import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Loader from '../components/Loader';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const navigate                    = useNavigate();
  const { items, loading, cartTotal, cartCount, clearCart } = useCart();

  if (loading) return <Loader fullPage />;

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax      = Math.round(cartTotal * 0.18);
  const grand    = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ padding: '6rem 1rem' }}>
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p style={{ marginBottom: '1.5rem' }}>Looks like you haven't added anything yet.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            <ShoppingBag size={18} /> Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0 1rem' }}>
        <h1 className="page-title">🛒 Shopping Cart</h1>
        <p className="page-sub">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Cart Items</span>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={clearCart}>
              Clear All
            </button>
          </div>
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({cartCount} items)</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          <div className="summary-row">
            <span>GST (18%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="summary-row" style={{ borderBottom: 'none', marginTop: '.5rem' }}>
            <span className="summary-total">Total</span>
            <span className="summary-total">{formatPrice(grand)}</span>
          </div>
          {shipping === 0 && (
            <p style={{ fontSize: '.78rem', color: 'var(--success)', marginBottom: '.75rem', fontWeight: 600 }}>
              🎉 You qualify for free shipping!
            </p>
          )}
          {cartTotal < 999 && (
            <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
              Add {formatPrice(999 - cartTotal)} more for free shipping.
            </p>
          )}
          <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <button className="btn btn-ghost btn-full btn-sm mt-1" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
