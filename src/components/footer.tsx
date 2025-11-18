import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-serif font-bold text-primary mb-4">WoodCraft Premium</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We specialize in providing premium handcrafted wooden furniture with the highest quality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* eslint-disable-next-line next/no-html-link-for-pages */}
                <a href="/" className="text-muted-foreground hover:text-accent transition">
                  Products
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line next/no-html-link-for-pages */}
                <a href="/about" className="text-muted-foreground hover:text-accent transition">
                  About Us
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line next/no-html-link-for-pages */}
                <a href="/contact" className="text-muted-foreground hover:text-accent transition">
                  Contact
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Wood Street, Ho Chi Minh City, Vietnam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-accent" />
                <a href="tel:+84982775131" className="text-muted-foreground hover:text-accent transition">
                  0982775131
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-accent" />
                <a href="mailto:nguyenndt@mynavitechtus.com" className="text-muted-foreground hover:text-accent transition">
                  nguyenndt@mynavitechtus.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">&copy; 2025 WoodCraft Premium. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="text-muted-foreground hover:text-accent transition text-xs">
              Facebook
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="text-muted-foreground hover:text-accent transition text-xs">
              Instagram
            </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="text-muted-foreground hover:text-accent transition text-xs">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
