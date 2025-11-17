'use client';

import type React from 'react';
import { useState } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(6, 'Tên người dùng phải có ít nhất 6 ký tự'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const registerSchema = z.object({
  username: z.string().min(6, 'Tên người dùng phải có ít nhất 6 ký tự'),
  full_name: z.string().min(5, 'Họ và tên phải có ít nhất 5 ký tự'),
  email: z.email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  address: z.string().min(4, 'Địa chỉ phải có ít nhất 4 ký tự'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirmPassword: z.string().min(8, 'Xác nhận mật khẩu phải có ít nhất 8 ký tự'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});


type RegisterFormData = {
  username: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
};

type AuthModalProps = {
  user: any;
  onSetUser: (user: any) => void;
  onClose: () => void;
};

export default function AuthModal({ onSetUser, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const dataToValidate = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const schema = isLogin ? loginSchema : registerSchema;
      const validation = schema.safeParse(dataToValidate);

      if (!validation.success) {
        const errors: Record<string, string> = {};
        if (validation.error?.issues) {
          validation.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
        }
        setFieldErrors(errors);
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            password: formData.password,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.error_message) {

          if (data.error_message.toLowerCase().includes('username already exists')
            || data.error_message.toLowerCase().includes('username đã tồn tại')) {
            setFieldErrors({ username: 'Tên người dùng đã tồn tại' });
          } else if (data.error_message.toLowerCase().includes('email already exists')
            || data.error_message.toLowerCase().includes('email đã tồn tại')) {
            setFieldErrors({ email: 'Email đã được sử dụng' });
          } else {
            setError(data.error_message || 'Có lỗi xảy ra');
          }
        } else {
          setError(data.error_message || 'Thông tin đăng nhập chưa chính xác!');
        }
        return;
      }

      onSetUser(data.user || data.data);
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
      <div className="bg-background p-8 rounded-lg w-full max-w-md border border-border max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-primary">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Tên người dùng</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => updateField('username', e.target.value)}
              className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                fieldErrors.username ? 'border-red-500' : 'border-border'
              }`}
              disabled={loading}
            />
            {fieldErrors.username && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Họ và tên</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                    fieldErrors.full_name ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.full_name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                    fieldErrors.email ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                    fieldErrors.phone ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                    fieldErrors.address ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Mật khẩu</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => updateField('password', e.target.value)}
              className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                fieldErrors.password ? 'border-red-500' : 'border-border'
              }`}
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => updateField('confirmPassword', e.target.value)}
                className={`w-full px-4 py-2 border rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-border'
                }`}
                disabled={loading}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          )}

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
            setFieldErrors({});
            setFormData({
              username: '',
              password: '',
              confirmPassword: '',
              full_name: '',
              email: '',
              phone: '',
              address: '',
            });
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
