'use client';

import React, { useState } from 'react';

type AuthModalProps = {
  user: any;
  onSetUser: (user: any) => void;
  onClose: () => void;
};

export default function AuthModal({ onSetUser, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFull_name] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { username, password } : { username, password, full_name, email, phone, address };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Authentication failed');
        return;
      }

      onSetUser(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-8 rounded-lg w-full max-w-md border border-border">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-2 text-foreground">
              Tên người dùng
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={full_name}
                  onChange={e => setFull_name(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  disabled={loading}
                />
              </div>

            </>
          )}

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-2 text-foreground">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground py-2 rounded font-medium hover:bg-opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="w-full mt-4 text-accent text-sm hover:underline"
          disabled={loading}
        >
          {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 text-muted-foreground text-sm hover:text-foreground"
          disabled={loading}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
