import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, Package, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { cartCount }      = useCart();
  const navigate           = useNavigate();
  const [query,  setQuery] = useState('');
  const [open,   setOpen]  = useState(false);
  const menuRef            = useRef();

  useEffect(() => {
    const close = (e) => { if (!menuRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/products?search=${encodeURIComponent(query.trim())}`); setQuery(''); }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">🛒 ShopZone</Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
          />
        </form>

        <div className="nav-actions">
          <Link to="/products" className="nav-link">Products</Link>

          {user ? (
            <>
              <button className="cart-pill" onClick={() => navigate('/cart')}>
                <ShoppingCart size={17} />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </button>

              <div className="user-menu" ref={menuRef}>
                <div
                  className="flex gap-1"
                  onClick={() => setOpen((o) => !o)}
                  style={{ cursor: 'pointer', alignItems: 'center' }}
                >
                  <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </div>

                {open && (
                  <div className="dropdown">
                    <div style={{ padding: '.75rem 1.15rem .5rem', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '.9rem' }}>{user.name}</p>
                      <p style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                    <Link to="/orders"  className="dd-item" onClick={() => setOpen(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="dd-item" onClick={() => setOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="dd-divider" />
                    <button className="dd-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
