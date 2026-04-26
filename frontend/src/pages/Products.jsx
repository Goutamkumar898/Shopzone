import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import { fetchProducts, fetchCategories, setActiveCategory, setSearchQuery } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Products() {
  const dispatch                      = useDispatch();
  const { items, categories, loading, activeCategory } = useSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const load = useCallback(() => {
    const params = {};
    const cat    = searchParams.get('categoryId');
    const search = searchParams.get('search');
    if (cat)    params.categoryId = cat;
    if (search) params.search     = search;
    dispatch(fetchProducts(params));
    if (cat) dispatch(setActiveCategory(Number(cat)));
  }, [searchParams, dispatch]);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (localSearch.trim()) p.search = localSearch.trim();
    setSearchParams(p);
    dispatch(setActiveCategory(null));
  };

  const handleCategory = (id) => {
    dispatch(setActiveCategory(id));
    setLocalSearch('');
    setSearchParams(id ? { categoryId: id } : {});
  };

  return (
    <div className="container section">
      {/* ── Header ── */}
      <div className="page-title">All Products</div>
      <p className="page-sub">{items.length} item{items.length !== 1 ? 's' : ''} found</p>

      {/* ── Search ── */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', maxWidth: 480 }}>
        <input
          className="input"
          placeholder="Search products…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
          <SlidersHorizontal size={15} /> Search
        </button>
      </form>

      {/* ── Category chips ── */}
      <div className="cat-row">
        <div className={`cat-chip ${!activeCategory ? 'active' : ''}`} onClick={() => handleCategory(null)}>
          All
        </div>
        {categories.map((c) => (
          <div
            key={c.id}
            className={`cat-chip ${activeCategory === c.id ? 'active' : ''}`}
            onClick={() => handleCategory(c.id)}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <Loader fullPage />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search or browse another category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
