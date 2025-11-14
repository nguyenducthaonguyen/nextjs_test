'use client';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/auth-modal';
import Cart from '@/components/cart';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useCart } from '@/contexts/cart-context';

export default function ContactPage() {
  const { cart, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

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
      setIsLoadingSession(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
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

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(!cartOpen)}
        user={user}
        onAuthClick={() => setShowAuth(!showAuth)}
        onLogout={handleLogout}
      />
      {showAuth && <AuthModal user={user} onSetUser={setUser} onClose={() => setShowAuth(false)} />}
      {cartOpen && <Cart items={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />}

      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Chúng tôi luôn sẵn lòng nghe ý kiến của bạn</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <MapPin size={32} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Địa Chỉ</h3>
              <p className="text-muted-foreground text-sm">123 Đường Gỗ, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Phone size={32} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Điện Thoại</h3>
              <p className="text-muted-foreground text-sm">+84 (28) 3822 8888</p>
              <p className="text-muted-foreground text-sm">Hotline: +84 86 9999 9999</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Mail size={32} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">info@woodcraft.vn</p>
              <p className="text-muted-foreground text-sm">support@woodcraft.vn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              {submitted
                ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <p className="text-green-800 font-medium">✓ Cảm ơn bạn đã gửi tin nhắn!</p>
                      <p className="text-green-700 text-sm mt-2">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                    </div>
                  )
                : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Họ Tên</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Nhập tên của bạn"
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Số Điện Thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="+84 ..."
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Chủ Đề</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Chủ đề của tin nhắn"
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Tin Nhắn</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Nhập tin nhắn của bạn..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                      </button>
                    </form>
                  )}
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Thông Tin Khác</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Clock size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Giờ Làm Việc</h3>
                    <p className="text-muted-foreground text-sm">Thứ Hai - Thứ Sáu: 8:00 - 18:00</p>
                    <p className="text-muted-foreground text-sm">Thứ Bảy: 9:00 - 17:00</p>
                    <p className="text-muted-foreground text-sm">Chủ Nhật: Đóng cửa</p>
                  </div>
                </div>

                <div className="bg-secondary rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Phương Thức Thanh Toán</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>✓ Tiền mặt</li>
                    <li>✓ Chuyển khoản ngân hàng</li>
                    <li>✓ Thẻ tín dụng</li>
                    <li>✓ Ví điện tử</li>
                  </ul>
                </div>

                <div className="bg-secondary rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Chính Sách Giao Hàng</h3>
                  <p className="text-muted-foreground text-sm">Miễn phí giao hàng cho đơn hàng từ 5 triệu đồng</p>
                  <p className="text-muted-foreground text-sm mt-2">Giao hàng tại TP.HCM trong vòng 2-3 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
