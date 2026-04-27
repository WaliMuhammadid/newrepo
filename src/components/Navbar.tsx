import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-dark tracking-tight">
              Mumtaz <span className="text-primary">Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Shop
            </Link>
            <Link to="/products?category=Cosmetics" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Cosmetics
            </Link>
            <Link to="/products?category=Baby+Products" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Baby
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin */}
            {admin ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <User size={14} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-primary text-sm font-medium transition-colors"
              >
                <User size={16} />
                Admin
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              Shop
            </Link>
            <Link to="/products?category=Cosmetics" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              Cosmetics
            </Link>
            <Link to="/products?category=Baby+Products" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              Baby Products
            </Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              Cart ({totalItems})
            </Link>
            {admin ? (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-primary font-medium">
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block py-2 text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
