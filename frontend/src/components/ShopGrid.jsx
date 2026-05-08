import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function ShopGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Map backend data to frontend structure
        const formattedProducts = data.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category.name,
          price: p.price,
          image: p.image // Django returns full or relative URL depending on setup
        }));

        setProducts(formattedProducts);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(formattedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setError('Could not load products. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div id="shop" className="max-w-7xl mx-auto px-6 py-16">
      
      {/* Horizontal Category Filters */}
      <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-black dark:text-white">Shop by Category</h2>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-rtm-light-surface text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full">
        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading exquisite furniture...</div>
        ) : error ? (
          <div className="text-center py-20 text-rtm-coral">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">No products found. Add some in the Django Admin panel!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group relative bg-rtm-light-bg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col rounded-sm overflow-hidden transition-colors">
                <div className="aspect-square w-full overflow-hidden bg-rtm-light-surface dark:bg-gray-900 relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x400/eeeeee/aaaaaa?text=Product+Image';
                    }}
                  />
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-rtm-teal text-white px-6 py-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-rtm-teal/90 rounded-sm shadow-lg"
                    >
                      <ShoppingBag size={18} />
                      <span className="text-sm font-medium tracking-wide">Add to Quote</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 text-center border-t border-gray-50 dark:border-gray-700/50">
                  <h3 className="text-black dark:text-gray-100 font-medium tracking-wide">{product.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.category}</p>
                  <p className="text-sm font-bold text-rtm-teal mt-2">KES {parseFloat(product.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
