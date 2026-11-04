import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Volume2, VolumeX, X, Plus, Minus, Search, Eye, Check } from 'lucide-react';
import { PRODUCTS } from './data/products';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [notification, setNotification] = useState("");

  // Звуковой синтезатор интерфейса (без внешних аудиофайлов)
  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'add') {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      // Игнорируем ошибки аудио если контекст заблокирован браузером
    }
  };

  const showNotification = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(""), 3000);
  };

  const toggleFavorite = (productId) => {
    playSound('click');
    setFavorites(prev => {
      const isFav = prev.includes(productId);
      showNotification(isFav ? "Удалено из избранного" : "Добавлено в избранное");
      return isFav ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  };

  const addToCart = (product, size) => {
    playSound('add');
    const itemSize = size || product.sizes[0];
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === itemSize);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === itemSize 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size: itemSize, quantity: 1 }];
    });
    showNotification(`${product.name} (${itemSize}) добавлен в корзину`);
  };

  const updateQuantity = (id, size, delta) => {
    playSound('click');
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const categories = ["All", "Outerwear", "Hoodies", "Pants", "Footwear"];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', position: 'relative' }}>
      
      {/* Уведомление */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '90px',
              right: '40px',
              zIndex: 1000,
              background: 'var(--accent-blue)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 8px 30px rgba(23, 107, 255, 0.3)'
            }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Шапка */}
      <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '2px', color: '#fff' }}>
            NEXUS <span style={{ color: 'var(--accent-cyan)' }}>//</span> LABS
          </h1>

          <nav style={{ display: 'flex', gap: '25px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { playSound('click'); setSelectedCategory(cat); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  transition: '0.3s'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          {/* Поиск */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                padding: '8px 12px 8px 36px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          {/* Звук */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{ background: 'none', border: 'none', color: soundEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Избранное */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Heart size={20} color={favorites.length > 0 ? 'var(--accent-cyan)' : '#fff'} fill={favorites.length > 0 ? 'var(--accent-cyan)' : 'none'} />
            {favorites.length > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--accent-cyan)', color: '#000', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {favorites.length}
              </span>
            )}
          </div>

          {/* Корзина клик */}
          <button 
            onClick={() => { playSound('click'); setIsCartOpen(true); }}
            style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer', color: '#fff' }}
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--accent-blue)', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Главный Баннер */}
      <section style={{ height: '65vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(circle at 50% 30%, #080F20 0%, #050609 80%)', padding: '0 20px' }}>
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 700, letterSpacing: '3px', marginBottom: '15px' }}
        >
          HIGH-TECH APPAREL / COLLECTION 2026
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '52px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px', maxWidth: '800px' }}
        >
          ИНЖЕНЕРНЫЙ МИНИМАЛИЗМ И ТЕХНОЛОГИИ
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-muted)', maxWidth: '560px', marginBottom: '35px', fontSize: '15px', lineHeight: '1.6' }}
        >
          Премиальные материалы, модульная функциональность и безупречный крой для городской среды нового поколения.
        </motion.p>
      </section>

      {/* Каталог */}
      <main style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>
            КАТАЛОГ // {selectedCategory.toUpperCase()}
          </h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Показано: {filteredProducts.length} элементов</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card" 
              style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ position: 'relative', height: '320px', overflow: 'hidden', background: '#07090E' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                />
                
                {/* Кнопка быстрой информации */}
                <button
                  onClick={() => { playSound('click'); setActiveProductModal(product); setSelectedSize(product.sizes[0]); }}
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(5,6,9,0.85)',
                    color: '#fff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Eye size={14} /> Обзор
                </button>

                {/* Избранное */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(5,6,9,0.7)', border: 'none', borderRadius: '50%', padding: '8px', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                >
                  <Heart size={16} fill={favorites.includes(product.id) ? 'var(--accent-cyan)' : 'none'} color={favorites.includes(product.id) ? 'var(--accent-cyan)' : '#fff'} />
                </button>
              </div>

              <div style={{ padding: '22px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>{product.category.toUpperCase()}</div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{product.name}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-cyan)' }}>${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                  >
                    В КОРЗИНУ
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Выдвижная Корзина (Side Drawer) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '440px',
                background: '#07090E',
                borderLeft: '1px solid var(--border-light)',
                zIndex: 201,
                padding: '30px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>КОРЗИНА ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '80px', fontSize: '14px' }}>
                    Корзина пуста
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{item.name}</h5>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>Размер: {item.size}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-cyan)' }}>${item.price}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <button onClick={() => updateQuantity(item.id, item.size, -item.quantity)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                          <button onClick={() => updateQuantity(item.id, item.size, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={12} /></button>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 800 }}>
                    <span>ИТОГО:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>${cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => { playSound('add'); alert("Заказ успешно оформлен (демо-режим)!"); setCart([]); setIsCartOpen(false); }}
                    style={{ width: '100%', background: 'var(--accent-cyan)', color: '#050609', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
                  >
                    ОФОРМИТЬ ЗАКАЗ
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Модальное окно просмотра товара (Quick View) */}
      <AnimatePresence>
        {activeProductModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveProductModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, backdropFilter: 'blur(6px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px', background: '#0A0D14', border: '1px solid var(--border-light)', borderRadius: '16px', zIndex: 301, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <img src={activeProductModal.image} alt={activeProductModal.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }} />
              <div style={{ padding: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>{activeProductModal.category.toUpperCase()}</span>
                    <button onClick={() => setActiveProductModal(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 15px' }}>{activeProductModal.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>{activeProductModal.description}</p>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>ВЫБЕРИТЕ РАЗМЕР:</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {activeProductModal.sizes.map(size => (
                        <button key={size} onClick={() => setSelectedSize(size)} style={{ background: selectedSize === size ? 'var(--accent-cyan)' : 'transparent', color: selectedSize === size ? '#000' : '#fff', border: '1px solid var(--border-light)', width: '40px', height: '40px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '20px' }}>${activeProductModal.price}</div>
                  <button 
                    onClick={() => { addToCart(activeProductModal, selectedSize); setActiveProductModal(null); }}
                    style={{ width: '100%', background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    ДОБАВИТЬ В КОРЗИНУ
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}