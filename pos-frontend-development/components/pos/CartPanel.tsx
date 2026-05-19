'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useCartStore } from '@/store/cartStore';
import { productImages } from '@/utils/productImages';

interface CartPanelProps {
  onCheckout: () => void;
}

export function CartPanel({ onCheckout }: CartPanelProps) {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTax, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito
            {items.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </CardTitle>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Vaciar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Carrito vacío</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Agrega productos para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <img
                  src={
                    productImages[item.product.name] ||
                    'https://via.placeholder.com/100x100?text=Producto'
                  }
                  alt={item.product.name}
                  className="w-14 h-14 rounded-md object-cover"
                  crossOrigin="anonymous"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-semibold w-20 text-right">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex-col gap-4 border-t pt-4">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA (13%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button onClick={onCheckout} className="w-full" size="lg">
            Generar Cobro SINPE
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
