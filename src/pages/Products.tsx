import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { api } from '@/services/api';
import type { Product } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Cosmetics', 'Baby Products'];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const data = await api.getProducts(
          category === 'Baby Products' ? category : category,
          search
        );
        setProducts(data);
        setSelectedCategory(category || 'All');
        setSearchQuery(search || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark">All Products</h1>
          <p className="mt-1 text-gray-500">Browse our collection of cosmetics and baby care</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>

            {/* Category Filter Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg font-medium"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 md:hidden flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { handleCategoryChange(cat); setShowFilters(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Active Filters */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange('All')}><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => { setSearchQuery(''); handleSearch({ preventDefault: () => {} } as any); }}><X size={12} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-sm text-red-500 hover:underline ml-auto">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500">No products found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
