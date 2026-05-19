'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { Product } from '@/types';
import { productImages } from '@/utils/productImages';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={
            productImages[product.name] ||
            'https://via.placeholder.com/300x300?text=Producto'
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          crossOrigin="anonymous"
        />
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-warning/90 text-warning-foreground text-xs px-2 py-1 rounded-full">
            Stock bajo
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">No hay productos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No se encontraron productos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
