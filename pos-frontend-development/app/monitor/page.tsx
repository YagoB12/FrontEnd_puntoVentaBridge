'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getRelativeTime } from '@/utils/formatters';
import { mockPhoneMonitor } from '@/data/mockData';
import {
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Server,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PhoneStatus } from '@/types';
import Swal from 'sweetalert2';

const statusConfig: Record<PhoneStatus, { label: string; color: string; icon: React.ReactNode }> = {
  online: {
    label: 'En línea',
    color: 'text-success',
    icon: <CheckCircle className="h-5 w-5" />,
  },
  offline: {
    label: 'Desconectado',
    color: 'text-muted-foreground',
    icon: <WifiOff className="h-5 w-5" />,
  },
  error: {
    label: 'Error',
    color: 'text-destructive',
    icon: <XCircle className="h-5 w-5" />,
  },
  processing: {
    label: 'Procesando',
    color: 'text-info',
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
  },
};

export default function MonitorPage() {
  const [phoneData, setPhoneData] = useState(mockPhoneMonitor);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPhoneData((prev) => ({
        ...prev,
        lastConnection: new Date().toISOString(),
        smsCount: prev.smsCount + Math.floor(Math.random() * 2),
        processedCount: prev.processedCount + Math.floor(Math.random() * 2),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPhoneData({
      ...mockPhoneMonitor,
      lastConnection: new Date().toISOString(),
      smsCount: mockPhoneMonitor.smsCount + Math.floor(Math.random() * 5),
      processedCount: mockPhoneMonitor.processedCount + Math.floor(Math.random() * 5),
    });
    setIsRefreshing(false);
  };

  const handleRestartService = (service: 'ocr' | 'parser' | 'all') => {
    const serviceNames = {
      ocr: 'Servicio OCR',
      parser: 'Parser',
      all: 'Todos los servicios',
    };

    Swal.fire({
      title: `Reiniciar ${serviceNames[service]}`,
      text: '¿Está seguro de que desea reiniciar este servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(var(--primary))',
      cancelButtonColor: 'hsl(var(--muted))',
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Reiniciando...',
          text: 'Por favor espere mientras se reinicia el servicio.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const getStatusIndicator = (status: PhoneStatus) => {
    const config = statusConfig[status];
    return (
      <div className={cn('flex items-center gap-2', config.color)}>
        {config.icon}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  };

  return (
    <MainLayout title="Monitor del Sistema">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Monitoreo en tiempo real del sistema de recepción de pagos SINPE
          </p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
            Actualizar
          </Button>
        </div>

        {/* Main Status Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span>Teléfono Receptor</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  ID: {phoneData.phoneId}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Connection Status */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Estado de Conexión</span>
                </div>
                {getStatusIndicator(phoneData.status)}
                <p className="text-xs text-muted-foreground mt-2">
                  Última conexión: {getRelativeTime(phoneData.lastConnection)}
                </p>
              </div>

              {/* Last SMS */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Último SMS</span>
                </div>
                <p className="font-medium">
                  {phoneData.lastSmsReceived
                    ? getRelativeTime(phoneData.lastSmsReceived)
                    : 'N/A'}
                </p>
              </div>

              {/* SMS Count */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">SMS Recibidos</span>
                </div>
                <p className="text-2xl font-bold">{phoneData.smsCount}</p>
              </div>

              {/* Processed Count */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Procesados</span>
                </div>
                <p className="text-2xl font-bold text-success">{phoneData.processedCount}</p>
                <p className="text-xs text-muted-foreground">
                  {phoneData.errorCount} errores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OCR Service */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Servicio OCR</span>
                </div>
                {getStatusIndicator(phoneData.ocrStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Reconocimiento óptico de caracteres para extraer información de los SMS de SINPE.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precisión</span>
                  <span className="font-medium">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo promedio</span>
                  <span className="font-medium">1.2s</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleRestartService('ocr')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </CardContent>
          </Card>

          {/* Parser Service */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span>Parser</span>
                </div>
                {getStatusIndicator(phoneData.parserStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analiza y extrae los datos estructurados de los mensajes SINPE procesados.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tasa de éxito</span>
                  <span className="font-medium">99.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensajes en cola</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleRestartService('parser')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </CardContent>
          </Card>

          {/* Backend Service */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <span>Backend API</span>
                </div>
                {getStatusIndicator(phoneData.backendStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Servidor ASP.NET Core que procesa las validaciones y gestiona las órdenes.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latencia</span>
                  <span className="font-medium">45ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleRestartService('all')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Todo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Logs (Simplified) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Logs del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
              <p className="text-muted-foreground">
                <span className="text-success">[INFO]</span>{' '}
                {formatDate(new Date())} - Sistema iniciado correctamente
              </p>
              <p className="text-muted-foreground">
                <span className="text-success">[INFO]</span>{' '}
                {formatDate(new Date(Date.now() - 1000 * 60 * 2))} - Conexión con teléfono establecida
              </p>
              <p className="text-muted-foreground">
                <span className="text-success">[INFO]</span>{' '}
                {formatDate(new Date(Date.now() - 1000 * 60 * 5))} - SMS recibido y procesado: SINPE-88881234
              </p>
              <p className="text-muted-foreground">
                <span className="text-success">[INFO]</span>{' '}
                {formatDate(new Date(Date.now() - 1000 * 60 * 10))} - Pago validado exitosamente
              </p>
              <p className="text-muted-foreground">
                <span className="text-warning">[WARN]</span>{' '}
                {formatDate(new Date(Date.now() - 1000 * 60 * 45))} - Pago requiere revisión manual
              </p>
              <p className="text-muted-foreground">
                <span className="text-success">[INFO]</span>{' '}
                {formatDate(new Date(Date.now() - 1000 * 60 * 60))} - Servicio OCR reiniciado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
