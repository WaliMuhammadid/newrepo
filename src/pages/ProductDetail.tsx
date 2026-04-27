import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Minus, Plus, Loader2, Check } from 'lucide-react';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const cartItem = cart.find((item) => item._id === id);

  const handleAddToCart = () => {
    if (!product) return;
    if (cartItem) {
      updateQuantity(product._id, cartItem.quantity + quantity);
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500">Product not found.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="aspect-square md:aspect-auto bg-gray-50">
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 md:p-10 flex flex-col"
            >
              <span className="inline-block self-start px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-dark">{product.name}</h1>
              <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-dark">${product.price.toFixed(2)}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  product.stockStatus > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {product.stockStatus > 0 ? `${product.stockStatus} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockStatus, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 0 || added}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : product.stockStatus === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {cartItem && (
                <p className="mt-3 text-sm text-gray-500">
                  You have {cartItem.quantity} of this item in your cart.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
