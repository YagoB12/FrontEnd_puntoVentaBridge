'use client';

import { useState, useMemo, useEffect } from 'react';

import { MainLayout } from '@/components/layout';

import {
  CategoryFilter,
  ProductGrid,
  CartPanel,
  PaymentModal
} from '@/components/pos';

import { useCartStore } from '@/store/cartStore';

import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';

import type { Product } from '@/types';

import Swal from 'sweetalert2';

export default function POSPage() {

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [currentOrderNumber, setCurrentOrderNumber] = useState('');

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const { addItem, items } = useCartStore();

  // =========================
  // CARGAR PRODUCTOS
  // =========================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    setLoading(true);

    const response = await productService.getProducts();

    if (response.success && response.data) {

      setProducts(response.data);

    } else {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'No se pudieron cargar los productos',
        confirmButtonColor: 'hsl(var(--primary))',
      });
    }

    setLoading(false);
  };

  // =========================
  // FILTRAR PRODUCTOS
  // =========================

  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const matchesCategory =
        !selectedCategory ||
        product.category === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;

    });

  }, [products, selectedCategory, searchQuery]);

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const handleAddToCart = (product: Product) => {

    addItem(product);

    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: `${product.name} agregado`,
    });
  };

  // =========================
  // CHECKOUT REAL
  // =========================

  const handleCheckout = async () => {

    if (items.length === 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agregue productos al carrito antes de generar el cobro.',
        confirmButtonColor: 'hsl(var(--primary))',
      });

      return;
    }

    const result = await Swal.fire({

      title: 'Datos del Cliente',

      html: `
        <input
          id="customerName"
          class="swal2-input"
          placeholder="Nombre del cliente"
        />

        <input
          id="customerPhone"
          class="swal2-input"
          placeholder="Teléfono"
        />
      `,

      confirmButtonText: 'Crear Orden',

      focusConfirm: false,

      preConfirm: () => {

        const customerNameInput =
          document.getElementById('customerName') as HTMLInputElement | null;

        const customerPhoneInput =
          document.getElementById('customerPhone') as HTMLInputElement | null;

        const customerName = customerNameInput?.value || '';

        const customerPhone = customerPhoneInput?.value || '';

        if (!customerName || !customerPhone) {

          Swal.showValidationMessage(
            'Todos los campos son obligatorios'
          );

          return;
        }

        return {
          customerName,
          customerPhone,
        };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const orderData = {

      customerName: result.value.customerName,

      phone: result.value.customerPhone,

      details: items.map(item => ({

        productId: item.product.id,

        quantity: item.quantity,

      })),
    };

    const response = await orderService.createOrder(orderData);

    if (!response.success || !response.data) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'No se pudo crear la orden',
      });

      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Orden Creada',
      text: `Orden #${response.data.id} creada correctamente`,
      timer: 2000,
      showConfirmButton: false,
    });

    // ORDEN REAL
    setCurrentOrderNumber(response.data.id.toString());

    // ABRIR MODAL
    setShowPaymentModal(true);

    // RECARGAR PRODUCTOS
    loadProducts();
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <MainLayout title="Punto de Venta">

        <div className="flex items-center justify-center h-full">

          <p className="text-lg font-medium">
            Cargando productos...
          </p>

        </div>

      </MainLayout>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <MainLayout title="Punto de Venta">

      <div className="flex gap-6 h-[calc(100vh-8rem)]">

        {/* LEFT PANEL */}

        <div className="flex-1 flex flex-col overflow-hidden">

          <div className="mb-4">

            <CategoryFilter
              categories={[]}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

          </div>

          <div className="flex-1 overflow-y-auto pr-2">

            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="w-96 flex-shrink-0">

          <CartPanel onCheckout={handleCheckout} />

        </div>

      </div>

      {/* PAYMENT MODAL */}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderNumber={currentOrderNumber}
      />

    </MainLayout>
  );
}