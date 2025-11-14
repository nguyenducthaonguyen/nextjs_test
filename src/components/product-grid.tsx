'use client';

import { useEffect, useState } from 'react';
import ProductCard from './product-card';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
};

type ProductGridProps = {
  onAddToCart: (product: Product) => void;
};

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Kiểm tra format trả về
        const productList = Array.isArray(data)
          ? data
          : data.data || data.products || [];

        setProducts(productList);
      } catch (error) {
        console.error('❌ Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category || 'Uncategorized'))];
  const filtered
    = filter === 'All' ? products : products.filter(p => (p.category || 'Uncategorized') === filter);

  if (loading) {
    return (
      <div className="py-24 text-center text-lg text-muted-foreground">
        Loading products...
      </div>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-serif font-bold text-primary mb-8">Our Collection</h2>

          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded transition ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0
          ? (
              <p className="text-center text-muted-foreground text-lg">No products found.</p>
            )
          : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      image_url: product.image_url || '/placeholder.jpg',
                      description: product.description || 'No description available.',
                    }}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
      </div>
    </section>
  );
}
