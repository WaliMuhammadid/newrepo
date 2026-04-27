import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Baby } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-secondary via-white to-accent/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={14} />
              New Collection Available
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-dark leading-tight">
              Beauty & Care for{' '}
              <span className="text-primary">Everyone</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              Discover our curated collection of premium cosmetics and gentle baby care products. 
              Quality ingredients, trusted results.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?category=Baby+Products"
                className="inline-flex items-center gap-2 bg-white text-dark border border-gray-200 px-6 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                <Baby size={18} />
                Baby Care
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-dark">500+</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark">10k+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-dark">4.9</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=60"
                  alt="Cosmetics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square bg-primary/10 flex items-center justify-center">
                <div className="text-center p-6">
                  <Sparkles className="mx-auto text-primary mb-2" size={32} />
                  <p className="font-bold text-dark">Premium Quality</p>
                  <p className="text-sm text-gray-500">Guaranteed</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1555252333-9f8e92e65df4?w=400&auto=format&fit=crop&q=60"
                  alt="Baby Products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=60"
                  alt="Skincare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
