'use client';

import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  const currentDate = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
        )}
        <span className="text-sm text-muted-foreground capitalize hidden md:block">
          {currentDate}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-card-foreground">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Cajero'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
