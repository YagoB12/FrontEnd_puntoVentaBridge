import { cn } from '@/lib/utils';
import type { PaymentStatus, OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: PaymentStatus | OrderStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-warning/15 text-warning border-warning/30',
  },
  approved: {
    label: 'Aprobado',
    className: 'bg-success/15 text-success border-success/30',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  manual_review: {
    label: 'Revisión Manual',
    className: 'bg-info/15 text-info border-info/30',
  },
  processing: {
    label: 'Procesando',
    className: 'bg-info/15 text-info border-info/30',
  },
  completed: {
    label: 'Completado',
    className: 'bg-success/15 text-success border-success/30',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-muted text-muted-foreground border-border',
  },
  refunded: {
    label: 'Reembolsado',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
