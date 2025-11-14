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
              Chúng tôi chuyên cung cấp các sản phẩm đồ gỗ cao cấp được chế tác thủ công với chất lượng tốt nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,next/no-html-link-for-pages */}
                <a href="/" className="text-muted-foreground hover:text-accent transition">
                  Sản Phẩm
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,next/no-html-link-for-pages */}
                <a href="/about" className="text-muted-foreground hover:text-accent transition">
                  Về chúng tôi
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line next/no-html-link-for-pages */}
                <a href="/contact" className="text-muted-foreground hover:text-accent transition">
                  Liên Hệ
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" className="text-muted-foreground hover:text-accent transition">
                  Điều Khoản Dịch Vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Đường Gỗ, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-accent" />
                <a href="tel:+84123456789" className="text-muted-foreground hover:text-accent transition">
                  +84 (123) 456-789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-accent" />
                <a href="mailto:info@woodcraft.vn" className="text-muted-foreground hover:text-accent transition">
                  info@woodcraft.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">&copy; 2025 WoodCraft Premium. Tất cả quyền được bảo lưu.</p>
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
