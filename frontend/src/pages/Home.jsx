import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping',   sub: 'On all orders above ₹999'   },
  { icon: '🔒', title: 'Secure Checkout', sub: '256-bit SSL encryption'      },
  { icon: '↩️', title: 'Easy Returns',   sub: '30-day hassle-free returns'   },
  { icon: '💬', title: '24/7 Support',   sub: 'Always here to help you'       },
];

export default function Home() {
  const navigate = useNavigate();
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([productApi.getTopRated(), productApi.getCategories()])
      .then(([pRes, cRes]) => {
        setFeatured(pRes.data.data   || []);
        setCategories(cRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ───────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <h1>Shop Smart,<br />Live Better 🛍️</h1>
          <p>Discover thousands of products at unbeatable prices — delivered right to your door.</p>
          <div className="hero-btns">
            <button className="btn-hero" onClick={() => navigate('/products')}>Shop Now</button>
            <button className="btn-hero-ghost" onClick={() => navigate('/register')}>Join Free</button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── Categories ─────────────────── */}
        <section className="section" style={{ paddingBottom: '1rem' }}>
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
          </div>
          <div className="cat-row">
            <div className="cat-chip" onClick={() => navigate('/products')}>🏪 All Products</div>
            {categories.map((c) => (
              <div key={c.id} className="cat-chip" onClick={() => navigate(`/products?categoryId=${c.id}`)}>
                {c.name}
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Rated ──────────────────── */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">⭐ Top Rated Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? <Loader fullPage /> : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* ── Feature Banners ─────────────── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>{f.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '.2rem' }}>{f.title}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.83rem' }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ──────────────────── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
            borderRadius: 'var(--radius)', padding: '3rem 2rem',
            textAlign: 'center', color: '#fff',
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '.75rem' }}>
              Get 20% Off Your First Order!
            </h2>
            <p style={{ opacity: .9, marginBottom: '1.5rem' }}>
              Sign up today and unlock exclusive deals and discounts.
            </p>
            <button className="btn-hero" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
