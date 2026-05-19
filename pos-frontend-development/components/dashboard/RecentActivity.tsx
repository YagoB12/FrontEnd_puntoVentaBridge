'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common';
import { formatCurrency, getRelativeTime } from '@/utils/formatters';
import { ShoppingBag, CreditCard, RefreshCcw } from 'lucide-react';
import type { RecentActivity } from '@/types';

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'refund':
        return <RefreshCcw className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getIconBg = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order':
        return 'bg-info/10 text-info';
      case 'payment':
        return 'bg-success/10 text-success';
      case 'refund':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-full ${getIconBg(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                  {activity.amount && (
                    <span className="text-xs font-medium text-foreground">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={activity.status as 'pending' | 'approved' | 'rejected' | 'manual_review'} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
