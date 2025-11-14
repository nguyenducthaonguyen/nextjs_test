'use client';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/auth-modal';
import Cart from '@/components/cart';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useCart } from '@/contexts/cart-context';

export default function AboutPage() {
  const { cart, removeFromCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Về WoodCraft Premium</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hành trình của chúng tôi bắt đầu từ đam mê với gỗ và cô công thủ công truyền thống
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-foreground leading-relaxed mb-4">
                WoodCraft Premium được thành lập vào năm 2010 với mong muốn mang những sản phẩm đồ gỗ cao cấp đến tay
                khách hàng Việt Nam. Chúng tôi tin rằng gỗ không chỉ là vật liệu, mà là tác phẩm nghệ thuật.
              </p>
              <p className="text-foreground leading-relaxed">
                Mỗi sản phẩm được chế tác bởi các thợ mộc lành nghề với kinh nghiệm hơn 20 năm, sử dụng những loại gỗ
                tốt nhất từ các vùng miền khác nhau.
              </p>
            </div>
            <div className="bg-secondary rounded-lg h-80 flex items-center justify-center border border-border">
              <img
                src="/wooden-furniture-workshop.jpg"
                alt="Workshop"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-border">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <p className="text-foreground font-medium">Năm Kinh Nghiệm</p>
              <p className="text-muted-foreground text-sm mt-2">Chúng tôi luôn nỗ lực mang đến sản phẩm tốt nhất</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">5000+</div>
              <p className="text-foreground font-medium">Khách Hàng Hài Lòng</p>
              <p className="text-muted-foreground text-sm mt-2">Tin tưởng chúng tôi trên khắp cả nước</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-foreground font-medium">Chất Lượng</p>
              <p className="text-muted-foreground text-sm mt-2">Cam kết với từng sản phẩm</p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Tại Sao Chọn WoodCraft?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Gỗ Nguyên Liệu Cao Cấp</h3>
                <p className="text-muted-foreground">
                  Chúng tôi chỉ sử dụng những loại gỗ tốt nhất từ các nhà cung cấp đáng tin cây
                </p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Thợ Mộc Lành Nghề</h3>
                <p className="text-muted-foreground">Đội ngũ thợ mộc có kinh nghiệm hơn 20 năm trong lĩnh vực này</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Thiết Kế Hiện Đại</h3>
                <p className="text-muted-foreground">Kết hợp truyền thống với những xu hướng thiết kế hiện đại</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Bảo Hành Dài Hạn</h3>
                <p className="text-muted-foreground">Tất cả sản phẩm được bảo hành 5 năm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
