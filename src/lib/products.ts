/**
 * Product data adapter — MVP reads static seed data.
 * Swap implementation to Neon when DATABASE_URL + enrichment pipeline are ready.
 */
import { products, type Product, type ProductTag } from '@/data/products';

export type { Product, ProductTag };

export function getValidatedProducts(): Product[] {
  return products.filter((p) => p.status === 'validated');
}

export function getFeaturedProducts(limit = 12): Product[] {
  return getValidatedProducts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getValidatedProducts().find((p) => p.slug === slug);
}

export function getProductsByTag(tag: ProductTag): Product[] {
  return getValidatedProducts().filter((p) => p.tags.includes(tag));
}

export function getProductsByBudget(maxCad: number): Product[] {
  return getValidatedProducts().filter((p) => p.priceCad <= maxCad);
}

export function getTopProducts(limit = 5): Product[] {
  return getValidatedProducts()
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}
