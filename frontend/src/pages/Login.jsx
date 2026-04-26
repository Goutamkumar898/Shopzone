import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate            = useNavigate();
  const location            = useLocation();
  const { login }           = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [busy, setBusy]     = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🛒</div>
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-sub">Sign in to your ShopZone account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={show ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg mt-2" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--text-muted)' }}>
          🔑 Demo Admin: <strong>admin@ecommerce.com</strong> / <strong>Admin@123</strong>
        </p>
      </div>
    </div>
  );
}
