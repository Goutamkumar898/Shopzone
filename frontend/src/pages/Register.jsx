import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fields = [
  { key: 'name',     label: 'Full Name',    type: 'text',     placeholder: 'John Doe',          required: true },
  { key: 'email',    label: 'Email',        type: 'email',    placeholder: 'you@example.com',   required: true },
  { key: 'password', label: 'Password',     type: 'password', placeholder: '••••••••',          required: true },
  { key: 'phone',    label: 'Phone Number', type: 'tel',      placeholder: '10-digit number',   required: false },
];

export default function Register() {
  const navigate              = useNavigate();
  const { register }          = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setBusy(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to ShopZone 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🚀</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands of happy shoppers today!</p>

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div className="form-group" key={f.key}>
              <label className="label">{f.label}{f.required && <span style={{ color: 'var(--error)' }}> *</span>}</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={f.key === 'password' ? (showPwd ? 'text' : 'password') : f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={f.key === 'password' ? { paddingRight: '3rem' } : {}}
                />
                {f.key === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button className="btn btn-primary btn-full btn-lg mt-1" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
