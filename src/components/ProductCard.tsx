import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stockStatus < 10 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-colors"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="mt-1 font-semibold text-dark truncate">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-dark">${product.price.toFixed(2)}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.stockStatus > 0
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-600'
          }`}>
            {product.stockStatus > 0 ? `${product.stockStatus} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
