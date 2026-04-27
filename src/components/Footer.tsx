import { Link } from 'react-router-dom';
import { Heart, Globe, MessageCircle, Send, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">Mumtaz Store</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium cosmetics and baby care products for you and your little ones. Quality you can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Cosmetics" className="hover:text-white transition-colors">Cosmetics</Link></li>
              <li><Link to="/products?category=Baby+Products" className="hover:text-white transition-colors">Baby Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Returns</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Connect</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Send size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Mail size={16} />
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Subscribe for exclusive offers and updates.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Mumtaz Store. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for you
          </p>
        </div>
      </div>
    </footer>
  );
}
