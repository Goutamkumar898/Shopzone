import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import orderApi from '../api/orderApi';
import { formatPrice, formatDate, statusColor } from '../utils/helpers';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function Orders() {
  const navigate             = useNavigate();
  const [orders,   setOrders]= useState([]);
  const [loading,  setLoad]  = useState(true);
  const [cancelling, setC]   = useState(null);

  const load = () => {
    setLoad(true);
    orderApi.myOrders()
      .then((r) => setOrders(r.data.data || []))
      .finally(() => setLoad(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    setC(id);
    try {
      await orderApi.cancel(id);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally { setC(null); }
  };

  if (loading) return <Loader fullPage />;

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ padding: '6rem 1rem' }}>
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p style={{ marginBottom: '1.5rem' }}>Looks like you haven't placed any orders.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            <Package size={18} /> Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="page-title">My Orders</h1>
      <p className="page-sub">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map((order) => (
          <div key={order.id} className="card">
            {/* Order header */}
            <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 800 }}>Order #{order.id}</p>
                <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                {['PENDING', 'PROCESSING'].includes(order.status) && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelling === order.id}
                  >
                    {cancelling === order.id ? '…' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div style={{ padding: '1rem 1.4rem' }}>
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex gap-2" style={{ marginBottom: '.75rem', alignItems: 'center' }}>
                  <img
                    src={item.product?.imageUrl || ''}
                    alt={item.product?.name}
                    style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', background: 'var(--bg)' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product?.name}
                    </p>
                    <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '.9rem 1.4rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', borderRadius: '0 0 var(--radius) var(--radius)' }}>
              <div>
                <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>Payment: </span>
                <span style={{ fontWeight: 600, fontSize: '.88rem' }}>{order.paymentMethod}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>Total: </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
