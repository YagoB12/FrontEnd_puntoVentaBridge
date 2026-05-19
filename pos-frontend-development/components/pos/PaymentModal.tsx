'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPhoneNumber } from '@/utils/formatters';
import { useCartStore } from '@/store/cartStore';
import { sinpeConfig } from '@/data/mockData';
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import type { PaymentStatus } from '@/types';
import Swal from 'sweetalert2';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export function PaymentModal({ isOpen, onClose, orderNumber }: PaymentModalProps) {
  const { getTotal, clearCart } = useCartStore();
  const total = getTotal();
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [copied, setCopied] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

  const reference = `${orderNumber}-${Date.now().toString().slice(-6)}`;

  // Simulate payment status polling
  useEffect(() => {
    if (!isOpen || paymentStatus !== 'pending') return;

    const interval = setInterval(() => {
      setPollingCount((prev) => {
        const newCount = prev + 1;
        
        // Simulate random payment detection after some polls
        if (newCount > 5 && Math.random() > 0.7) {
          const statuses: PaymentStatus[] = ['approved', 'rejected', 'manual_review'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          setPaymentStatus(randomStatus);
        }
        
        return newCount;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, paymentStatus]);

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(sinpeConfig.phoneNumber.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    if (paymentStatus === 'approved') {
      clearCart();
      Swal.fire({
        icon: 'success',
        title: 'Pago Completado',
        text: 'La orden ha sido procesada exitosamente.',
        confirmButtonColor: 'hsl(var(--primary))',
      });
    }
    onClose();
  };

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-warning animate-pulse" />,
          title: 'Esperando Pago',
          description: 'Realice la transferencia SINPE Móvil y el sistema detectará el pago automáticamente.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-8 w-8 text-success" />,
          title: 'Pago Aprobado',
          description: 'El pago ha sido verificado y aprobado exitosamente.',
          color: 'text-success',
          bgColor: 'bg-success/10',
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-8 w-8 text-destructive" />,
          title: 'Pago Rechazado',
          description: 'No se pudo verificar el pago. Por favor, intente nuevamente.',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
        };
      case 'manual_review':
        return {
          icon: <AlertTriangle className="h-8 w-8 text-info" />,
          title: 'En Revisión Manual',
          description: 'El pago requiere verificación adicional. Un administrador lo revisará pronto.',
          color: 'text-info',
          bgColor: 'bg-info/10',
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="relative w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Pago SINPE Móvil</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Amount Display */}
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Monto a pagar</p>
            <p className="text-4xl font-bold text-primary">{formatCurrency(total)}</p>
          </div>

          {/* SINPE Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número SINPE</p>
                  <p className="font-semibold text-lg">{formatPhoneNumber(sinpeConfig.phoneNumber)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyNumber}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Titular</p>
                <p className="font-medium">{sinpeConfig.accountHolder}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Banco</p>
                <p className="font-medium">{sinpeConfig.bankName}</p>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">Referencia</p>
              <p className="font-mono font-medium">{reference}</p>
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-xl ${statusInfo.bgColor}`}>
            <div className="flex items-center gap-3">
              {statusInfo.icon}
              <div>
                <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.title}</p>
                <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>
            {paymentStatus === 'pending' && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verificando pago... ({pollingCount} intentos)</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {paymentStatus === 'pending' && (
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
            )}
            {paymentStatus !== 'pending' && (
              <Button className="flex-1" onClick={handleComplete}>
                {paymentStatus === 'approved' ? 'Finalizar' : 'Cerrar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
