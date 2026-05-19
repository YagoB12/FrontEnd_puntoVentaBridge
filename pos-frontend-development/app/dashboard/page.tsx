'use client';

import { MainLayout } from '@/components/layout';
import { StatsCards, SalesChart, OrdersChart, RecentActivityList } from '@/components/dashboard';
import { mockDashboardStats, mockSalesData, mockRecentActivity } from '@/data/mockData';

export default function DashboardPage() {
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={mockDashboardStats} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SalesChart data={mockSalesData} />
          <OrdersChart data={mockSalesData} />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityList activities={mockRecentActivity} />
          
          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-primary/90 to-primary rounded-xl p-6 text-primary-foreground">
            <h3 className="text-xl font-semibold mb-2">Acceso Rápido</h3>
            <p className="text-primary-foreground/80 mb-6">
              Accede rápidamente a las funciones más utilizadas del sistema.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/pos"
                className="flex flex-col items-center justify-center p-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                <span className="text-sm font-medium">Nueva Venta</span>
              </a>
              
              <a
                href="/orders"
                className="flex flex-col items-center justify-center p-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/>
                  <path d="M12 11h4"/>
                  <path d="M12 16h4"/>
                  <path d="M8 11h.01"/>
                  <path d="M8 16h.01"/>
                </svg>
                <span className="text-sm font-medium">Ver Órdenes</span>
              </a>
              
              <a
                href="/payments"
                className="flex flex-col items-center justify-center p-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
                <span className="text-sm font-medium">Pagos SINPE</span>
              </a>
              
              <a
                href="/monitor"
                className="flex flex-col items-center justify-center p-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                  <path d="M12 18h.01"/>
                </svg>
                <span className="text-sm font-medium">Monitor</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
