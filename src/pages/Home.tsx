import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { api } from '@/services/api';
import type { Product } from '@/types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await api.getProducts();
        setFeatured(products.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Hero />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark">Shop by Category</h2>
            <p className="mt-2 text-gray-500">Find exactly what you need</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/products?category=Cosmetics"
              className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1]"
            >
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60"
                alt="Cosmetics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Cosmetics</h3>
                <p className="text-white/80 text-sm mt-1">Makeup, skincare & beauty essentials</p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold mt-2 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
            <Link
              to="/products?category=Baby+Products"
              className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1]"
            >
              <img
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=60"
                alt="Baby Products"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Baby Products</h3>
                <p className="text-white/80 text-sm mt-1">Gentle care for your little ones</p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold mt-2 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark">Featured Products</h2>
              <p className="mt-2 text-gray-500">Handpicked favorites just for you</p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-primary font-semibold"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { title: 'Free Shipping', desc: 'On orders over $50' },
              { title: 'Secure Payment', desc: '100% secure checkout' },
              { title: 'Easy Returns', desc: '30-day return policy' },
              { title: '24/7 Support', desc: 'Dedicated support' },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="font-bold text-dark">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
