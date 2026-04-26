import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, PlusCircle, Pencil, Trash2, RefreshCw } from 'lucide-react';
import productApi from '../api/productApi';
import orderApi   from '../api/orderApi';
import { formatPrice, formatDate, statusColor } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

/* ─── Sidebar ─────────────────────────────────── */
function Sidebar() {
  const loc = useLocation();
  const links = [
    { to: '/admin',          icon: <LayoutDashboard size={16} />, label: 'Overview'  },
    { to: '/admin/products', icon: <Package size={16} />,         label: 'Products'  },
    { to: '/admin/orders',   icon: <ShoppingBag size={16} />,     label: 'Orders'    },
  ];
  return (
    <aside className="admin-sidebar">
      <p className="sidebar-label">Admin Panel</p>
      {links.map((l) => (
        <Link key={l.to} to={l.to} className={`sidebar-link ${loc.pathname === l.to ? 'active' : ''}`}>
          {l.icon} {l.label}
        </Link>
      ))}
    </aside>
  );
}

/* ─── Overview ────────────────────────────────── */
function Overview() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productApi.getAll(), orderApi.getAll()])
      .then(([pRes, oRes]) => {
        const products = pRes.data.data || [];
        const orders   = oRes.data.data || [];
        const revenue  = orders.filter(o => o.status !== 'CANCELLED')
          .reduce((s, o) => s + o.totalAmount, 0);
        setStats({
          products: products.length,
          orders:   orders.length,
          revenue,
          pending:  orders.filter(o => o.status === 'PENDING').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Dashboard Overview</h2>
      <div className="stat-grid">
        {[
          { icon: '📦', label: 'Total Products', value: stats.products },
          { icon: '🛒', label: 'Total Orders',   value: stats.orders   },
          { icon: '⏳', label: 'Pending Orders', value: stats.pending  },
          { icon: '💰', label: 'Total Revenue',  value: formatPrice(stats.revenue) },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Products Manager ────────────────────────── */
function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [cats,     setCats]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '', rating: '' });
  const [busy,     setBusy]     = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([productApi.getAll(), productApi.getCategories()])
      .then(([pRes, cRes]) => { setProducts(pRes.data.data || []); setCats(cRes.data.data || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm({ name:'', description:'', price:'', stock:'', categoryId:'', imageUrl:'', rating:'' }); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description||'', price: p.price, stock: p.stock, categoryId: p.category?.id||'', imageUrl: p.imageUrl||'', rating: p.rating||'' }); setModal(true); };

  const handleSave = async () => {
    setBusy(true);
    try {
      if (editing) await productApi.update(editing.id, form);
      else         await productApi.create(form);
      toast.success(editing ? 'Product updated' : 'Product created');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productApi.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <div className="section-header">
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Products ({products.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><PlusCircle size={16} /> Add Product</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><img src={p.imageUrl||''} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, background: 'var(--bg)' }} onError={(e) => { e.target.style.display='none'; }} /></td>
                <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                <td>{p.category?.name || '—'}</td>
                <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                <td><span style={{ color: p.stock < 5 ? 'var(--error)' : 'inherit', fontWeight: p.stock < 5 ? 700 : 400 }}>{p.stock}</span></td>
                <td>⭐ {p.rating}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm"  onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { key:'name',        label:'Name',        type:'text'   },
                { key:'description', label:'Description', type:'text'   },
                { key:'price',       label:'Price (₹)',   type:'number' },
                { key:'stock',       label:'Stock',       type:'number' },
                { key:'imageUrl',    label:'Image URL',   type:'url'    },
                { key:'rating',      label:'Rating (0-5)',type:'number' },
              ].map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input" type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label className="label">Category</label>
                <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">-- Select --</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Orders Manager ──────────────────────────── */
function OrdersManager() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpd]    = useState(null);

  const load = () => {
    setLoading(true);
    orderApi.getAll().then((r) => setOrders(r.data.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setUpd(id);
    try { await orderApi.updateStatus(id, status); toast.success('Status updated'); load(); }
    catch { toast.error('Update failed'); }
    finally { setUpd(null); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <div className="section-header">
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Orders ({orders.length})</h2>
        <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700 }}>{o.id}</td>
                <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{formatDate(o.createdAt)}</td>
                <td>{(o.items||[]).length} item(s)</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(o.totalAmount)}</td>
                <td style={{ fontSize: '.85rem' }}>{o.paymentMethod}</td>
                <td><span className={`badge ${statusColor(o.status)}`}>{o.status}</span></td>
                <td>
                  <select
                    className="input"
                    style={{ padding: '.3rem .6rem', fontSize: '.82rem', width: 'auto' }}
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => handleStatus(o.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard Shell ───────────────────── */
export default function AdminDashboard() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route index              element={<Overview />}         />
          <Route path="products"    element={<ProductsManager />}  />
          <Route path="orders"      element={<OrdersManager />}    />
        </Routes>
      </div>
    </div>
  );
}
