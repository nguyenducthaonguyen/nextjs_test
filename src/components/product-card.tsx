'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
  };
  onAddToCart: (product: any) => void;
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group rounded overflow-hidden bg-card hover:shadow-lg transition duration-300">
      <div className="relative h-64 bg-muted overflow-hidden">
        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-300"
          priority
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-primary mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">
            $
            {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
