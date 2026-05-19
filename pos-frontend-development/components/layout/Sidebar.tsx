'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  CreditCard,
  Smartphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Dashboard',
  },
  {
    href: '/pos',
    icon: <ShoppingCart className="h-5 w-5" />,
    label: 'Punto de Venta',
  },
  {
    href: '/orders',
    icon: <ClipboardList className="h-5 w-5" />,
    label: 'Órdenes',
  },
  {
    href: '/payments',
    icon: <CreditCard className="h-5 w-5" />,
    label: 'Pagos',
  },
  {
    href: '/monitor',
    icon: <Smartphone className="h-5 w-5" />,
    label: 'Monitor',
    adminOnly: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">SINPE POS</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {user && (
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Cajero'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className={cn('mt-4 flex', collapsed ? 'justify-center' : 'gap-2')}>
          {!collapsed && (
            <Link
              href="/settings"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Ajustes</span>
            </Link>
          )}
          <button
            onClick={logout}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors',
              collapsed ? 'w-full' : ''
            )}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Salir</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
