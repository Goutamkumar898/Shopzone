import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from '../components/Navbar';
import Footer          from '../components/Footer';
import ProtectedRoute  from '../components/ProtectedRoute';

import Home            from '../pages/Home';
import Products        from '../pages/Products';
import ProductDetails  from '../pages/ProductDetails';
import Cart            from '../pages/Cart';
import Checkout        from '../pages/Checkout';
import Login           from '../pages/Login';
import Register        from '../pages/Register';
import Orders          from '../pages/Orders';
import AdminDashboard  from '../pages/AdminDashboard';

export default function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Home />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetails />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />

          {/* Protected – any logged-in user */}
          <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          {/* Protected – admin only */}
          <Route path="/admin/*"  element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
