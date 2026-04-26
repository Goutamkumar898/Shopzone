import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Package, ArrowLeft, Shield, Truck } from 'lucide-react';
import productApi from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, imgFallback } from '../utils/helpers';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty,     setQty]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);

  useEffect(() => {
    productApi.getById(id)
      .then((r) => setProduct(r.data.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      toast.success(`Added ${qty} item(s) to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    } finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    await handleAdd();
    navigate('/cart');
  };

  if (loading) return <Loader fullPage />;
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* ── Image ── */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <img
            src={product.imageUrl || imgFallback(product.name)}
            alt={product.name}
            onError={(e) => { e.target.src = imgFallback(product.name); }}
            style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', objectFit: 'cover', maxHeight: '480px' }}
          />
        </div>

        {/* ── Info ── */}
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.5rem' }}>
            {product.category?.name}
          </p>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
            {product.name}
          </h1>

          <div className="flex gap-2 mb-2">
            <span style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--primary)' }}>
              {formatPrice(product.price)}
            </span>
            <span className="flex gap-1" style={{ color: 'var(--warning)', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
              ))}
              <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>({product.rating?.toFixed(1)})</span>
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.5rem', fontSize: '.95rem' }}>
            {product.description || 'No description available.'}
          </p>

          {/* Stock */}
          <div className="flex gap-1 mb-2" style={{ alignItems: 'center' }}>
            <Package size={17} color={inStock ? 'var(--success)' : 'var(--error)'} />
            <span style={{ fontWeight: 700, color: inStock ? 'var(--success)' : 'var(--error)' }}>
              {inStock ? `${product.stock} units in stock` : 'Out of Stock'}
            </span>
          </div>

          {inStock && (
            <>
              {/* Qty selector */}
              <div className="flex gap-2 mb-2" style={{ alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Quantity:</span>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="qty-num">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-lg" onClick={handleAdd} disabled={adding}>
                  <ShoppingCart size={18} />
                  {adding ? 'Adding…' : 'Add to Cart'}
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={adding}>
                  Buy Now
                </button>
              </div>
            </>
          )}

          {/* Perks */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {[
              { icon: <Truck size={16} />, text: 'Free delivery on orders above ₹999' },
              { icon: <Shield size={16} />, text: '1-year warranty & 30-day returns' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex gap-1" style={{ color: 'var(--text-muted)', fontSize: '.87rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--primary)' }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
