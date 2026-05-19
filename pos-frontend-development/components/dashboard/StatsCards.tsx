'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Ventas del Día',
      value: formatCurrency(stats.totalSales),
      icon: <DollarSign className="h-5 w-5" />,
      trend: '+12.5%',
      trendUp: true,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Órdenes',
      value: stats.totalOrders.toString(),
      icon: <ShoppingBag className="h-5 w-5" />,
      trend: '+3',
      trendUp: true,
      bgColor: 'bg-info/10',
      iconColor: 'text-info',
    },
    {
      title: 'Pagos Pendientes',
      value: stats.pendingPayments.toString(),
      icon: <Clock className="h-5 w-5" />,
      trend: null,
      trendUp: false,
      bgColor: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      title: 'Pagos Aprobados',
      value: stats.approvedPayments.toString(),
      icon: <CheckCircle className="h-5 w-5" />,
      trend: '+2',
      trendUp: true,
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Pagos Rechazados',
      value: stats.rejectedPayments.toString(),
      icon: <XCircle className="h-5 w-5" />,
      trend: '-1',
      trendUp: false,
      bgColor: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      title: 'Ticket Promedio',
      value: formatCurrency(stats.averageOrderValue),
      icon: <TrendingUp className="h-5 w-5" />,
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-secondary/50',
      iconColor: 'text-secondary-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.trend && (
              <p
                className={`text-xs mt-1 ${
                  card.trendUp ? 'text-success' : 'text-destructive'
                }`}
              >
                {card.trend} vs ayer
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
