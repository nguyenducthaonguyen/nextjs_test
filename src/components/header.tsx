'use client';

import { LogOut, Menu, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
  cartCount: number;
  onCartClick: () => void;
  user: any;
  onAuthClick: () => void;
  onLogout: () => void;
};

export default function Header({ cartCount, onCartClick, user, onAuthClick, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex-1">
          {/* eslint-disable-next-line next/no-html-link-for-pages */}
          <a href="/">
            <h1 className="text-2xl font-serif font-bold text-primary">WoodCraft Premium</h1>
            <p className="text-xs text-muted-foreground">Handcrafted Excellence</p>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {/* eslint-disable-next-line next/no-html-link-for-pages */}
          <a href="/shop" className="text-foreground hover:text-accent transition">
            Shop
          </a>
          {/* eslint-disable-next-line next/no-html-link-for-pages */}
          <a href="/about" className="text-foreground hover:text-accent transition">
            About
          </a>
          {/* eslint-disable-next-line next/no-html-link-for-pages */}
          <a href="/contact" className="text-foreground hover:text-accent transition">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onCartClick} className="relative p-2 hover:bg-secondary rounded transition">
            <ShoppingCart size={24} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user
            ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded">
                    <User size={18} className="text-accent" />
                    <span className="text-sm text-foreground">{user.username}</span>

                  </div>

                  <button onClick={onLogout} className="p-2 hover:bg-secondary rounded transition" title="Đăng xuất">
                    <LogOut size={20} className="text-foreground" />
                  </button>
                </div>
              )
            : (
                <button
                  onClick={onAuthClick}
                  className="hidden sm:inline px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-opacity-90 transition font-medium text-sm"
                >
                  Đăng Nhập
                </button>
              )}

          <button
            className="md:hidden p-2 hover:bg-secondary rounded transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} className="text-foreground" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-secondary p-4 space-y-3">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="block text-foreground hover:text-accent">
            Shop
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="block text-foreground hover:text-accent">
            About
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="block text-foreground hover:text-accent">
            Contact
          </a>
          {!user && (
            <button
              onClick={onAuthClick}
              className="w-full mt-4 px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-opacity-90 transition font-medium"
            >
              Đăng Nhập
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
