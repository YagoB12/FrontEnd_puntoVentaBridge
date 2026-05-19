'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { mockUser, mockAdmin } from '@/data/mockData';
import { ShoppingCart, Eye, EyeOff, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    if (email === 'admin@tienda.com' && password === 'admin123') {
      setUser(mockAdmin, 'mock-jwt-token-admin');
      router.push('/dashboard');
    } else if (email === 'cajero@tienda.com' && password === 'cajero123') {
      setUser(mockUser, 'mock-jwt-token-cashier');
      router.push('/pos');
    } else if (email && password) {
      // Accept any email/password for demo
      setUser(mockUser, 'mock-jwt-token');
      router.push('/dashboard');
    } else {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Por favor ingrese sus credenciales.',
        confirmButtonColor: 'hsl(var(--primary))',
      });
      return;
    }
  };

  const handleQuickLogin = (role: 'admin' | 'cashier') => {
    if (role === 'admin') {
      setEmail('admin@tienda.com');
      setPassword('admin123');
    } else {
      setEmail('cajero@tienda.com');
      setPassword('cajero123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <ShoppingCart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SINPE POS</h1>
          <p className="text-muted-foreground mt-1">Sistema de Punto de Venta</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@tienda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>

            {/* Quick Login Options (Demo) */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Acceso rápido (Demo)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('admin')}
                >
                  Administrador
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('cashier')}
                >
                  Cajero
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Admin: admin@tienda.com / admin123
                <br />
                Cajero: cajero@tienda.com / cajero123
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Sistema de Punto de Venta con SINPE Móvil
        </p>
      </div>
    </div>
  );
}
