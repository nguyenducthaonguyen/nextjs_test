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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We're always here to listen to your feedback</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <MapPin size={32} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Address</h3>
              <p className="text-muted-foreground text-sm">123 Wood Street, District 1, Ho Chi Minh City, Vietnam</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Phone size={32} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Phone</h3>
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
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send Us a Message</h2>
              {submitted
                ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <p className="text-green-800 font-medium">✓ Thank you for your message!</p>
                      <p className="text-green-700 text-sm mt-2">We will respond within 24 hours</p>
                    </div>
                  )
                : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Enter your name"
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
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
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
                        <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Message subject"
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                          placeholder="Enter your message..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">Additional Information</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Clock size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                    <p className="text-muted-foreground text-sm">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground text-sm">Saturday: 9:00 AM - 5:00 PM</p>
                    <p className="text-muted-foreground text-sm">Sunday: Closed</p>
                  </div>
                </div>

                <div className="bg-secondary rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Payment Methods</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>✓ Cash</li>
                    <li>✓ Bank Transfer</li>
                    <li>✓ Credit Card</li>
                    <li>✓ E-Wallet</li>
                  </ul>
                </div>

                <div className="bg-secondary rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Shipping Policy</h3>
                  <p className="text-muted-foreground text-sm">Free shipping for orders over 5 million VND</p>
                  <p className="text-muted-foreground text-sm mt-2">Delivery within Ho Chi Minh City in 2-3 days</p>
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
