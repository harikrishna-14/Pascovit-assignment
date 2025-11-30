import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search,
        category: filters.category !== 'All' ? filters.category : undefined,
        size: filters.size,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        page: filters.page,
        limit: 12,
      };
      
      const response = await productAPI.getProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Products</h1>
        
        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select 
                name="category" 
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option>All</option>
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Size</label>
              <select 
                name="size" 
                value={filters.size}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Sizes</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <section className="products-section">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="btn-pagination"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages || 1 }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`btn-pagination ${filters.page === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= (pagination.pages || 1)}
                    className="btn-pagination"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="no-products">No products found</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;