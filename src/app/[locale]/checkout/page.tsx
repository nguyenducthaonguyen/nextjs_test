'use client';

import type React from 'react';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/auth-modal';
import Cart from '@/components/cart';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useCart } from '@/contexts/cart-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, removeFromCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleUserLogin = async (userData: any) => {
    setUser(userData);
    setShowAuth(false);

    // Re-fetch full user data from backend to ensure we have complete info
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData(prev => ({
          ...prev,
          fullName: data.user.full_name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
        }));
      }
    } catch (error) {
      console.error('Failed to refetch user data:', error);
    }
  };

  const checkUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData(prev => ({
          ...prev,
          fullName: data.user.full_name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
        }));
      } else {
        setShowAuth(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          delivery_info: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            ward: formData.ward,
            district: formData.district,
            province: formData.province,
            notes: formData.notes,
          },
          total,
        }),
      });

      if (response.ok) {
        setOrderPlaced(true);
        clearCart();
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else { /* empty */ }
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Đang tải...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setCartOpen(!cartOpen)}
          user={user}
          onAuthClick={() => setShowAuth(!showAuth)}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-4">Đặt hàng thành công!</h1>
            <p className="text-foreground mb-2">Cảm ơn bạn đã mua hàng</p>
            <p className="text-muted-foreground">Quay lại trang chủ trong 2 giây...</p>
          </div>
        </main>
        <Footer />
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
      {showAuth && <AuthModal user={user} onSetUser={handleUserLogin} onClose={() => setShowAuth(false)} />}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:opacity-75 mb-8 transition"
          >
            <ChevronLeft size={20} />
            Quay lại
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-serif font-bold text-primary mb-8">Thông tin giao hàng</h1>

              {!user && (
                <div className="bg-accent/10 border border-accent p-4 rounded mb-6">
                  <p className="text-foreground">Vui lòng đăng nhập để tiếp tục thanh toán</p>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Họ và tên
                    {' '}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Số điện thoại
                    {' '}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Địa chỉ
                    {' '}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="block text-sm font-semibold text-foreground mb-2">Phường/Xã</label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="block text-sm font-semibold text-foreground mb-2">Quận/Huyện</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="block text-sm font-semibold text-foreground mb-2">Tỉnh/TP</label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="block text-sm font-semibold text-foreground mb-2">Ghi chú đơn hàng</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
                    placeholder="Ghi chú cho shop..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !user}
                  className="w-full py-3 bg-primary text-primary-foreground rounded hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-serif font-bold text-primary mb-6">Đơn hàng của bạn</h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.name}
                        {' '}
                        x
                        {item.quantity}
                      </span>
                      <span className="font-semibold text-foreground">
                        $
                        {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-foreground">Tạm tính:</span>
                    <span className="font-semibold text-foreground">
                      $
                      {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-foreground">Phí vận chuyển:</span>
                    <span className="font-semibold text-foreground">Miễn phí</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-lg font-bold text-primary">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-accent">
                      $
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
