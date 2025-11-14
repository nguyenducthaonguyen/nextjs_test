'use client';
import { Trash2, X } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartProps = {
  items: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
};

export default function Cart({ items, onRemove, onClose }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border shadow-lg max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-2xl font-serif font-bold text-primary">Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {items.length === 0
          ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            )
          : (
              <>
                <div className="p-6 space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          $
                          {item.price}
                          {' '}
                          x
                          {item.quantity}
                        </p>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="p-2 hover:bg-accent rounded transition">
                        <Trash2 size={18} className="text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-6 sticky bottom-0 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-foreground">Total:</span>
                    <span className="text-2xl font-bold text-accent">
                      $
                      {total.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => (window.location.href = '/checkout')}
                    className="w-full py-3 bg-primary text-primary-foreground rounded hover:opacity-90 transition font-semibold"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
