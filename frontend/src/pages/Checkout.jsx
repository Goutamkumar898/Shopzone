import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import orderApi  from '../api/orderApi';
import paymentApi from '../api/paymentApi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { PAYMENT_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate                    = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep]             = useState(1);  // 1=address  2=payment  3=confirm
  const [order, setOrder]           = useState(null);
  const [busy,  setBusy]            = useState(false);
  const [form, setForm]             = useState({
    shippingAddress: '', paymentMethod: 'CARD',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax      = Math.round(cartTotal * 0.18);
  const grand    = cartTotal + shipping + tax;

  const placeOrder = async () => {
    if (!form.shippingAddress.trim()) { toast.error('Please enter a shipping address'); return; }
    setBusy(true);
    try {
      const oRes = await orderApi.checkout(form);
      const o    = oRes.data.data;
      await paymentApi.process(o.id, form.paymentMethod);
      setOrder(o);
      clearCart();
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setBusy(false); }
  };

  // ── Step 3: Success ──────────────────────
  if (step === 3 && order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <CheckCircle size={72} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.75rem' }}>Order Placed! 🎉</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your order <strong>#{order.id}</strong> has been placed and is being processed.
          </p>
          <div className="card card-body mb-2" style={{ textAlign: 'left' }}>
            <div className="summary-row"><span>Order ID</span><strong>#{order.id}</strong></div>
            <div className="summary-row"><span>Total Paid</span><strong>{formatPrice(grand)}</strong></div>
            <div className="summary-row"><span>Payment</span><strong>{form.paymentMethod}</strong></div>
            <div className="summary-row" style={{ borderBottom: 'none' }}>
              <span>Status</span>
              <span className="badge badge-processing">PROCESSING</span>
            </div>
          </div>
          <div className="flex gap-2" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
            <button className="btn btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex gap-2 mb-2" style={{ marginBottom: '2rem' }}>
        {['Shipping', 'Payment', 'Confirm'].map((s, i) => (
          <div key={s} className="flex gap-1" style={{ alignItems: 'center', color: step >= i + 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? 700 : 400 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: step >= i + 1 ? 'var(--primary)' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 700 }}>
              {i + 1}
            </span>
            <span style={{ fontSize: '.88rem' }}>{s}</span>
            {i < 2 && <span style={{ color: 'var(--border)', margin: '0 .25rem' }}>›</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div>
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card card-body">
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>📦 Shipping Address</h3>
              <div className="form-group">
                <label className="label">Full Address</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="House no., Street, City, State, PIN code"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                />
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => form.shippingAddress.trim() ? setStep(2) : toast.error('Enter shipping address')}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card card-body">
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>💳 Payment Method</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m}
                    onClick={() => setForm({ ...form, paymentMethod: m })}
                    style={{
                      padding: '1rem', border: `2px solid ${form.paymentMethod === m ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center',
                      background: form.paymentMethod === m ? 'var(--primary-light)' : 'var(--surface)',
                      fontWeight: 600, transition: 'var(--transition)',
                    }}
                  >
                    {{ CARD: '💳', UPI: '📱', NETBANKING: '🏦', COD: '💵' }[m]} {m}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ flex: 1 }}>
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && !order && (
            <div className="card card-body">
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>✅ Review & Confirm</h3>
              <div className="summary-row"><span>Shipping to</span><span style={{ maxWidth: 200, textAlign: 'right', fontSize: '.85rem' }}>{form.shippingAddress}</span></div>
              <div className="summary-row"><span>Payment</span><span>{form.paymentMethod}</span></div>
              <div className="summary-row" style={{ borderBottom: 'none' }}><span>Items</span><span>{items.length} product(s)</span></div>
              <div className="flex gap-2 mt-2">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={placeOrder} disabled={busy} style={{ flex: 1 }}>
                  {busy ? 'Placing Order…' : `Place Order · ${formatPrice(grand)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order mini-summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Summary</h3>
          {items.slice(0, 4).map((i) => (
            <div key={i.id} className="flex gap-1" style={{ marginBottom: '.75rem', alignItems: 'center' }}>
              <img src={i.product.imageUrl || ''} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: 'var(--bg)' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i.product.name}</p>
                <p style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>×{i.quantity}</p>
              </div>
              <span style={{ fontSize: '.85rem', fontWeight: 700 }}>{formatPrice(i.product.price * i.quantity)}</span>
            </div>
          ))}
          {items.length > 4 && <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>+{items.length - 4} more item(s)</p>}
          <div className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          <div className="summary-row" style={{ borderBottom: 'none' }}>
            <span className="summary-total">Total</span>
            <span className="summary-total">{formatPrice(grand)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
