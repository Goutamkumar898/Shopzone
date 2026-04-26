import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>🛒 ShopZone</h4>
          <p style={{ fontSize: '.87rem', lineHeight: 1.8, color: '#9ca3af' }}>
            Your one-stop destination for quality products at unbeatable prices. Shop smart, live better.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?categoryId=1">Electronics</Link>
          <Link to="/products?categoryId=2">Clothing</Link>
          <Link to="/products?categoryId=3">Books</Link>
          <Link to="/products?categoryId=5">Sports</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div>
          <h4>Help</h4>
          <a href="#">FAQ</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ShopZone. Built with Spring Boot + Hibernate + React + Vite.
        </p>
      </div>
    </footer>
  );
}
