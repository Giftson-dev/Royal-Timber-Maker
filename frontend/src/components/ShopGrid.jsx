import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Check, Star } from 'lucide-react';

export default function ShopGrid({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
          categorySlug: p.category.slug,
          description: p.description,
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

  const filteredProducts = products.map(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isRecommended = searchQuery && p.categorySlug && p.categorySlug.toLowerCase() === searchQuery.toLowerCase().trim();

    return matchesCategory && matchesSearch ? { ...p, isRecommended } : null;
  }).filter(Boolean);

  // Sort recommended items to the top
  const sortedProducts = [...filteredProducts].sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

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
            {sortedProducts.map(product => (
              <div 
                key={product.id} 
                className={`group relative bg-rtm-light-bg dark:bg-gray-800 border ${product.isRecommended ? 'border-rtm-mustard ring-1 ring-rtm-mustard' : 'border-gray-100 dark:border-gray-700'} flex flex-col rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl`}
              >
                {product.isRecommended && (
                  <div className="absolute top-2 left-2 z-10 bg-rtm-mustard text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded-full shadow-sm">
                    <Star size={10} fill="currentColor" /> RECOMMENDED
                  </div>
                )}
                <div 
                  className="aspect-square w-full overflow-hidden bg-rtm-light-surface dark:bg-gray-900 relative cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-rtm-teal text-white px-6 py-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-rtm-teal/90 rounded-sm shadow-lg"
                    >
                      <ShoppingBag size={18} />
                      <span className="text-sm font-medium tracking-wide">Add to Quote</span>
                    </button>
                  </div>
                </div>
                <div 
                  className="p-4 text-center border-t border-gray-50 dark:border-gray-700/50 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <h3 className="text-black dark:text-gray-100 font-medium tracking-wide">{product.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-rtm-coral dark:text-rtm-mustard font-bold mt-1">{product.category}</p>
                  {product.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 px-2 italic">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm font-bold text-rtm-teal mt-3">
                    {product.price ? `KES ${parseFloat(product.price).toLocaleString()}` : "Price on Request"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative bg-rtm-light-bg dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-1/2 bg-rtm-light-surface dark:bg-gray-900 flex items-center justify-center min-h-[300px]">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x600/eeeeee/aaaaaa?text=Product+Image';
                }}
              />
            </div>

            {/* Modal Info */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-rtm-coral dark:text-rtm-mustard font-black">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2 leading-tight uppercase tracking-tight">
                  {selectedProduct.title}
                </h2>
                <div className="w-12 h-1 bg-rtm-teal mt-4"></div>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Product Description</h4>
                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap space-y-4">
                  {selectedProduct.description || "No description available for this exquisite piece."}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Pricing From</p>
                  <p className="text-2xl font-black text-rtm-teal">
                    {selectedProduct.price ? `KES ${parseFloat(selectedProduct.price).toLocaleString()}` : "Price on Request"}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full sm:w-auto bg-black dark:bg-rtm-teal text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:scale-105 transition-transform flex items-center justify-center gap-3 rounded-sm shadow-xl"
                >
                  <ShoppingBag size={18} />
                  Add to Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
