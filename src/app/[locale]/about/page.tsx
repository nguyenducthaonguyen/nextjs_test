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
        <p className="text-foreground">Loading...</p>
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">About WoodCraft Premium</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our journey began with a passion for wood and traditional craftsmanship
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Story</h2>
              <p className="text-foreground leading-relaxed mb-4">
                WoodCraft Premium was founded in 2010 with the desire to bring premium wooden furniture products to Vietnamese customers. We believe that wood is not just a material, but a work of art.
              </p>
              <p className="text-foreground leading-relaxed">
                Each product is crafted by skilled carpenters with more than 20 years of experience, using the finest wood from different regions.
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
              <p className="text-foreground font-medium">Years of Experience</p>
              <p className="text-muted-foreground text-sm mt-2">We always strive to bring the best products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">5000+</div>
              <p className="text-foreground font-medium">Satisfied Customers</p>
              <p className="text-muted-foreground text-sm mt-2">Trust us across the country</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-foreground font-medium">Quality</p>
              <p className="text-muted-foreground text-sm mt-2">Committed to every product</p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Why Choose WoodCraft?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Premium Wood Materials</h3>
                <p className="text-muted-foreground">
                  We only use the best wood from trusted suppliers
                </p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Skilled Craftsmen</h3>
                <p className="text-muted-foreground">Team of carpenters with more than 20 years of experience</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Modern Design</h3>
                <p className="text-muted-foreground">Combining tradition with modern design trends</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-primary mb-3">Long-term Warranty</h3>
                <p className="text-muted-foreground">All products come with a 5-year warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
