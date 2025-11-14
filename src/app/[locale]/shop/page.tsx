'use client';

import { useEffect, useState } from 'react';
import AuthModal from '@/components/auth-modal';
import Cart from '@/components/cart';
import Footer from '@/components/footer';
import Header from '@/components/header';
import ProductGrid from '@/components/product-grid';
import { useCart } from '@/contexts/cart-context';

export default function ShopPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(!cartOpen)}
        user={user}
        onAuthClick={() => setShowAuth(!showAuth)}
        onLogout={handleLogout}
      />
      {cartOpen && <Cart items={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />}
      {showAuth && <AuthModal user={user} onSetUser={setUser} onClose={() => setShowAuth(false)} />}
      <main className="flex-1">
        <section className="py-16 bg-secondary border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Cửa Hàng</h1>
            <p className="text-foreground text-lg">Khám phá bộ sưu tập đồ gỗ cao cấp của chúng tôi</p>
          </div>
        </section>
        <ProductGrid onAddToCart={addToCart} />
      </main>
      <Footer />
    </div>
  );
}
