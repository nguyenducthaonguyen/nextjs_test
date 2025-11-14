export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
            Exquisite Wooden Craftsmanship
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Each piece is meticulously handcrafted from premium quality wood, combining timeless elegance with
            contemporary design.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 transition font-medium">
            Explore Collection
          </button>
        </div>
      </div>

      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, var(--color-accent))',
        }}
      />
    </section>
  );
}
