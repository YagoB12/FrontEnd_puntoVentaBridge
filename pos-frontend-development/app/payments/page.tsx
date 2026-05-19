'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import { mockPayments } from '@/data/mockData';
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaymentStatus } from '@/types';
import Swal from 'sweetalert2';

const statusFilters: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'manual_review', label: 'En Revisión' },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      !searchQuery ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerPhone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (paymentId: string) => {
    Swal.fire({
      title: 'Aprobar Pago',
      text: '¿Está seguro de que desea aprobar este pago?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--success))',
      cancelButtonColor: 'hsl(var(--muted))',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Aprobado', 'El pago ha sido aprobado exitosamente.', 'success');
      }
    });
  };

  const handleReject = (paymentId: string) => {
    Swal.fire({
      title: 'Rechazar Pago',
      text: 'Por favor, ingrese el motivo del rechazo:',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Motivo del rechazo...',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--destructive))',
      cancelButtonColor: 'hsl(var(--muted))',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un motivo';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Rechazado', 'El pago ha sido rechazado.', 'info');
      }
    });
  };

  return (
    <MainLayout title="Gestión de Pagos SINPE">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-warning">
                {mockPayments.filter((p) => p.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Aprobados</p>
              <p className="text-2xl font-bold text-success">
                {mockPayments.filter((p) => p.status === 'approved').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Rechazados</p>
              <p className="text-2xl font-bold text-destructive">
                {mockPayments.filter((p) => p.status === 'rejected').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">En Revisión</p>
              <p className="text-2xl font-bold text-info">
                {mockPayments.filter((p) => p.status === 'manual_review').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por referencia, nombre o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={statusFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pagos SINPE ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Referencia
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Pagador
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Monto
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Validación
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm">{payment.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{payment.payerName || 'N/A'}</p>
                          {payment.payerPhone && (
                            <p className="text-sm text-muted-foreground">
                              {formatPhoneNumber(payment.payerPhone)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {payment.validationResult || 'Pendiente'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === 'manual_review' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(payment.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(payment.id)}
                                className="text-success hover:text-success"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredPayments.length)} de{' '}
                  {filteredPayments.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
