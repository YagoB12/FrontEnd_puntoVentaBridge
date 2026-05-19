'use client';

import { use } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import { mockOrders, mockPayments } from '@/data/mockData';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  CreditCard,
  Package,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const payment = mockPayments.find((p) => p.orderId === order.id);

  return (
    <MainLayout title={`Orden ${order.orderNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/orders">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Órdenes
            </Button>
          </Link>
          <div className="flex gap-2">
            {order.paymentStatus === 'pending' && (
              <>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="h-4 w-4" />
                  Cancelar
                </Button>
              </>
            )}
            {order.paymentStatus === 'manual_review' && (
              <>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </Button>
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Aprobar
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información de la Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estado de Orden</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="border-l border-border pl-4">
                  <p className="text-sm text-muted-foreground mb-1">Estado de Pago</p>
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{order.customerName || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">
                      {order.customerPhone ? formatPhoneNumber(order.customerPhone) : 'No especificado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pago</p>
                    <p className="font-medium uppercase">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-medium mb-3">Productos</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                          Producto
                        </th>
                        <th className="text-center py-2 px-4 text-sm font-medium text-muted-foreground">
                          Cantidad
                        </th>
                        <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">
                          Precio Unit.
                        </th>
                        <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-3 px-4 font-medium">{item.productName}</td>
                          <td className="py-3 px-4 text-center">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-muted-foreground">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/30">
                        <td colSpan={3} className="py-2 px-4 text-right text-sm text-muted-foreground">
                          Subtotal
                        </td>
                        <td className="py-2 px-4 text-right">{formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td colSpan={3} className="py-2 px-4 text-right text-sm text-muted-foreground">
                          IVA (13%)
                        </td>
                        <td className="py-2 px-4 text-right">{formatCurrency(order.tax)}</td>
                      </tr>
                      <tr className="border-t bg-muted/50">
                        <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                          Total
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-lg text-primary">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Referencia SINPE</p>
                      <p className="font-mono font-medium">{payment.reference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monto</p>
                      <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                    </div>
                    {payment.payerName && (
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre del Pagador</p>
                        <p className="font-medium">{payment.payerName}</p>
                      </div>
                    )}
                    {payment.payerPhone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Teléfono del Pagador</p>
                        <p className="font-medium">{formatPhoneNumber(payment.payerPhone)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Pago</p>
                      <p className="font-medium">{formatDate(payment.createdAt)}</p>
                    </div>
                    {payment.validatedAt && (
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de Validación</p>
                        <p className="font-medium">{formatDate(payment.validatedAt)}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">No hay información de pago disponible.</p>
                )}
              </CardContent>
            </Card>

            {/* Validation History */}
            {payment && (payment.ocrResult || payment.validationResult) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Historial de Validación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payment.ocrResult && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Resultado OCR</p>
                      <p className="text-sm font-medium">{payment.ocrResult}</p>
                    </div>
                  )}
                  {payment.validationResult && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Resultado de Validación</p>
                      <p className="text-sm font-medium">{payment.validationResult}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
