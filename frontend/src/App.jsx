import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ShoppingBag, Search, Menu, X, Sun, Moon, Phone, Mail, MessageCircle } from 'lucide-react';
import HeroCarousel from './components/HeroCarousel';
import ShopGrid from './components/ShopGrid';

function Header({ siteSettings, searchQuery, setSearchQuery, products }) {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-rtm-light-bg/90 backdrop-blur-md dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {siteSettings?.logo ? (
            <img src={siteSettings.logo} alt="Royal Timber Maker Logo" className="h-12 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-rtm-mustard flex items-center justify-center text-white text-sm font-bold rounded-sm shadow-sm">RTM</div>
          )}
          <div className="flex flex-col">
            <Link to="/" className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase leading-tight">
              Royal Timber Maker
            </Link>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-gradient mt-0.5">
              Authentic Locally Made Furniture
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-sm font-medium text-black dark:text-gray-200 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">Home</Link>
          <Link to="/#shop" className="text-sm font-medium text-black dark:text-gray-200 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">Shop</Link>
          <Link to="/#about" className="text-sm font-medium text-black dark:text-gray-200 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">About</Link>
          <Link to="/#contact" className="text-sm font-medium text-black dark:text-gray-200 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">Contact</Link>
        </nav>

        {/* Utilities */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-rtm-mustard dark:hover:text-rtm-mustard transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 border-b border-gray-300 dark:border-gray-700 py-1 pl-2 pr-8 text-sm bg-transparent focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            <Search size={16} className="absolute right-2 top-2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white" />
            
            {/* Search Recommendations */}
            {searchQuery && products && products.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-sm overflow-hidden z-50">
                {products
                  .filter(p => 
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.categorySlug && p.categorySlug.toLowerCase() === searchQuery.toLowerCase().trim())
                  )
                  .slice(0, 5)
                  .map(product => (
                    <Link 
                      key={product.id} 
                      to="/#shop"
                      onClick={() => {
                        setSearchQuery(product.title);
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                    >
                      <img src={product.image} alt={product.title} className="w-12 h-12 object-cover bg-gray-100 dark:bg-gray-900 rounded-sm" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium text-black dark:text-white truncate">{product.title}</h4>
                        <p className="text-[10px] text-rtm-coral dark:text-rtm-mustard font-bold uppercase">{product.category}</p>
                      </div>
                    </Link>
                  ))}
                  {products.filter(p => 
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.categorySlug && p.categorySlug.toLowerCase() === searchQuery.toLowerCase().trim())
                  ).length === 0 && (
                    <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      No matching products found.
                    </div>
                  )}
              </div>
            )}
          </div>
          
          <Link to="/quote" className="relative text-black dark:text-white hover:text-rtm-teal dark:hover:text-rtm-teal transition-colors">
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rtm-coral text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-black dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-rtm-light-bg dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 transition-colors">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/#shop" className="text-sm font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/#about" className="text-sm font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/#contact" className="text-sm font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/quote" className="text-sm font-medium dark:text-white flex justify-between" onClick={() => setIsMenuOpen(false)}>
              Quote Cart <span className="bg-rtm-coral text-white text-xs px-2 py-1 rounded-full">{itemCount}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-rtm-light-surface dark:bg-black text-black dark:text-white pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex flex-col">
            <Link to="/" className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase leading-tight">
              Royal Timber Maker
            </Link>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-gradient mt-0.5">
              Authentic Locally Made Furniture
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 tracking-wider text-sm uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link to="/" className="hover:text-rtm-coral dark:hover:text-rtm-mustard transition-colors">Home</Link></li>
            <li><Link to="/#shop" className="hover:text-rtm-coral dark:hover:text-rtm-mustard transition-colors">Shop</Link></li>
            <li><Link to="/#about" className="hover:text-rtm-coral dark:hover:text-rtm-mustard transition-colors">About Us</Link></li>
            <li><Link to="/#contact" className="hover:text-rtm-coral dark:hover:text-rtm-mustard transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 tracking-wider text-sm uppercase">Visit Us</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Komarock, Nairobi<br />
            Opposite Komarock Primary School
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Royal Timber Maker. All rights reserved.</p>
        <p>
          created by <a href="https://gift-portfolio.web.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 dark:text-gray-300 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">Giftson</a>
        </p>
      </div>
    </footer>
  );
}

function Home({ searchQuery, products, categories, loadingProducts, productsError }) {
  return (
    <main>
      <HeroCarousel />
      <div id="shop">
        <ShopGrid searchQuery={searchQuery} products={products} categories={categories} loading={loadingProducts} error={productsError} />
      </div>
      <div id="about">
        <AboutPage />
      </div>
      <div id="contact">
        <ContactPage />
      </div>
    </main>
  );
}

function QuotePage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', message: '' });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Your quote cart is empty!');
    
    // Validate phone number length
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return alert('Please enter a valid phone number with at least 10 digits.');
    }
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('location', formData.location);
      data.append('message', formData.message);
      data.append('items', JSON.stringify(
        cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      ));

      images.forEach((img) => {
        data.append('images', img);
      });

      const response = await fetch('http://127.0.0.1:8000/api/quote-request/', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      alert('Quote Request Submitted Successfully! We will contact you soon.');
      clearCart();
      setFormData({ name: '', email: '', phone: '', location: '', message: '' });
      setImages([]);
    } catch (err) {
      console.error("Error submitting quote:", err);
      alert('There was an error submitting your quote. Please try again later.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-10 text-center dark:text-white">Request a Quote</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <h2 className="text-lg font-medium border-b dark:border-gray-800 pb-4 mb-6 dark:text-gray-200">Your Selected Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your quote cart is empty. Please add items from the shop.</p>
          ) : (
            <ul className="space-y-6">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center gap-4 border border-gray-100 dark:border-gray-800 p-4 bg-rtm-light-bg dark:bg-gray-800 rounded-sm">
                  <div className="w-20 h-20 bg-rtm-light-surface dark:bg-gray-700 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" 
                         onError={e => e.target.src='https://placehold.co/100'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm dark:text-gray-100">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-transparent border-b border-gray-300 dark:border-gray-600 text-sm focus:outline-none dark:text-white"
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-rtm-coral transition-colors"
                  >
                    <X size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-96 bg-rtm-light-surface dark:bg-gray-800 p-8 h-fit rounded-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-6 dark:text-white">Contact Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 text-sm focus:outline-none focus:border-rtm-teal transition-colors dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Email</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 text-sm focus:outline-none focus:border-rtm-teal transition-colors dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Phone</label>
              <input 
                required
                type="tel" 
                placeholder="e.g. 0723049842"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/[^0-9+]/g, '')})}
                className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 text-sm focus:outline-none focus:border-rtm-teal transition-colors dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Location</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Nairobi, Kilimani"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-2 text-sm focus:outline-none focus:border-rtm-teal transition-colors dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Additional Notes</label>
              <textarea 
                rows="3"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:outline-none focus:border-rtm-teal transition-colors resize-none mt-1 dark:text-white rounded-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Inspiration Images (Optional)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={e => setImages(Array.from(e.target.files))}
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rtm-light-surface file:text-rtm-teal hover:file:bg-gray-100 dark:file:bg-gray-700 dark:hover:file:bg-gray-600 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-black dark:bg-rtm-teal text-white py-3 mt-6 text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-rtm-teal/90 transition-colors rounded-sm"
            >
              Submit Quote Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-8 dark:text-white">Contact Us</h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-lg leading-relaxed">
        We're here to help you bring your vision to life. Reach out to us through any of the channels below.
      </p>

      <div className="bg-rtm-light-surface dark:bg-gray-800 p-8 rounded-sm border border-gray-100 dark:border-gray-700 w-full mb-12 max-w-md mx-auto">
        <h2 className="text-lg font-medium mb-6 dark:text-white uppercase tracking-wider">Get In Touch</h2>
        <div className="flex flex-col space-y-6 items-center">
          <a href="tel:+254723049842" className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 hover:text-rtm-teal dark:hover:text-rtm-teal transition-colors">
            <Phone size={24} className="text-rtm-coral" /> <span>+254 723 049 842</span>
          </a>
          <a href="mailto:RoyalTimbermaker@gmail.com" className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 hover:text-rtm-coral dark:hover:text-rtm-coral transition-colors">
            <Mail size={24} className="text-rtm-teal" /> <span>RoyalTimbermaker@gmail.com</span>
          </a>
          <a href="https://wa.me/254723049842" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors">
            <MessageCircle size={24} className="text-[#25D366]" /> <span>WhatsApp Us</span>
          </a>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-lg font-medium mb-6 dark:text-white uppercase tracking-wider">Connect With Us</h2>
        <div className="flex justify-center space-x-8">
          <a href="https://instagram.com/Royaltimbermaker" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-rtm-teal dark:hover:text-rtm-teal transition-colors">Instagram</a>
          <a href="https://tiktok.com/@Royaltimbermaker" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-rtm-teal dark:hover:text-rtm-teal transition-colors">TikTok</a>
          <a href="https://facebook.com/Royaltimbermaker" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-rtm-teal dark:hover:text-rtm-teal transition-colors">Facebook</a>
        </div>
      </div>

      <div className="w-full mt-16">
        <h2 className="text-lg font-medium mb-4 dark:text-white uppercase tracking-wider">Visit Our Workshop</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Komarock, Nairobi — Opposite Komarock Primary School
        </p>
        <div className="w-full h-96 rounded-sm overflow-hidden border border-gray-100 dark:border-gray-700 shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8369790542456!2d36.90833057472441!3d-1.2708081987170987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1487f325f271%3A0xb6c9726afd6a49b6!2sRoyal%20Timber%20Maker!5e0!3m2!1sen!2ske!4v1778282970214!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

const WhatsAppIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function AboutPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-rtm-light-surface dark:bg-gray-900 opacity-50 z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rtm-mustard/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rtm-coral/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 dark:text-white uppercase tracking-[0.2em]">Who We Are</h1>
        <div className="w-24 h-1.5 bg-rtm-mustard mb-12 shadow-sm"></div>
        
        <div className="space-y-8">
          <p className="text-xl md:text-3xl font-light text-gray-800 dark:text-gray-200 leading-relaxed italic">
            "At Royal Timber Makers, we believe that true elegance is found in authenticity."
          </p>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-8"></div>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            We are a premier furniture studio dedicated to designing and building high-quality, locally made furniture. 
            Born from a passion for exceptional craftsmanship, our pieces are more than just functional—they are enduring works of art 
            built to anchor your home or workspace. 
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            We take pride in our local roots, blending traditional woodworking techniques with modern design to create furniture 
            that stands the test of time.
          </p>
        </div>

        <div className="mt-16">
          <Link to="/#shop" className="inline-block px-10 py-4 bg-black dark:bg-rtm-teal text-white text-sm font-bold tracking-[0.2em] uppercase rounded-sm hover:scale-105 transition-transform">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a 
      href="https://wa.me/254723049842" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-16 right-6 z-50 flex items-center gap-3 group drop-shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="bg-white text-black font-semibold text-sm px-5 py-3 rounded-full shadow-md whitespace-nowrap">
        Chat with us
      </div>
      <div className="bg-[#25D366] text-white w-14 h-14 rounded-full shadow-md flex items-center justify-center">
        <WhatsAppIcon size={32} />
      </div>
    </a>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash in the URL, try to scroll to that element.
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        const formattedProducts = data.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category.name,
          categorySlug: p.category.slug,
          description: p.description,
          price: p.price,
          image: p.image
        }));

        setProducts(formattedProducts);
        
        const uniqueCategories = ['All', ...new Set(formattedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setProductsError('Could not load products. Please ensure the backend is running.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/settings/')
      .then(res => res.json())
      .then(data => {
        setSiteSettings(data);
        if (data.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.favicon;
        }
      })
      .catch(err => console.error("Could not fetch site settings", err));
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-rtm-light-bg dark:bg-gray-900 transition-colors duration-300 relative">
            <ScrollToTop />
            <Header siteSettings={siteSettings} searchQuery={searchQuery} setSearchQuery={setSearchQuery} products={products} />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} products={products} categories={categories} loadingProducts={loadingProducts} productsError={productsError} />} />
                <Route path="/quote" element={<QuotePage />} />
              </Routes>
            </div>
            <Footer />
            <FloatingWhatsApp />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
