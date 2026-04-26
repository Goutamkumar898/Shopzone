import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, imgFallback } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { addToCart } = useCart();

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login to add items'); navigate('/login'); return; }
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  return (
    <div className="card card-hover product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div style={{ overflow: 'hidden' }}>
        <img
          src={product.imageUrl || imgFallback(product.name)}
          alt={product.name}
          className="p-img"
          onError={(e) => { e.target.src = imgFallback(product.name); }}
        />
      </div>
      <div className="p-body">
        <p className="p-cat">{product.category?.name || 'General'}</p>
        <p className="p-name" title={product.name}>{product.name}</p>
        <div className="p-rating">
          <Star size={12} fill="currentColor" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span style={{ color: 'var(--text-muted)' }}>/ 5</span>
        </div>
        <div className="p-footer">
          <span className="p-price">{formatPrice(product.price)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={13} />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <p style={{ fontSize: '.75rem', color: 'var(--error)', marginTop: '.4rem', fontWeight: 600 }}>
            Only {product.stock} left!
          </p>
        )}
      </div>
    </div>
  );
}
