'use client';

import { useState } from 'react';

import Swal from 'sweetalert2';

import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';

import { smsService } from '@/services/smsService';

export default function SmsPage() {

  const [sender, setSender] = useState('BN SINPE MOVIL');

  const [customerPhone, setCustomerPhone] = useState('');

  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSendSms = async () => {

    if (!sender.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Remitente requerido',
      });

      return;
    }

    if (!message.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Mensaje requerido',
      });

      return;
    }

    setLoading(true);

    const response = await smsService.sendSms({

      sender,

      customerPhone,

      message,

    });

    setLoading(false);

    if (response.success) {

      Swal.fire({
        icon: 'success',
        title: 'SMS procesado',
        text: 'El mensaje fue enviado correctamente al backend.',
      });

    } else {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.error || 'No se pudo procesar el SMS',
      });

    }
  };

  const generateExample = () => {

    setMessage(
      'Ha recibido 10.000,00 colones por BN SINPE MOVIL de HELLEN DAYANA CHEVEZ. plata -62976730. Referencia 2026061215183010902773853'
    );

  };

  return (

    <MainLayout title="Simulador SMS">

      <div className="max-w-4xl mx-auto">

        <div className="bg-card rounded-xl border p-6 space-y-6">

          <div>

            <h1 className="text-2xl font-bold">
              Simulador de SMS SINPE
            </h1>

            <p className="text-muted-foreground">
              Permite enviar manualmente mensajes SMS al backend para pruebas.
            </p>

          </div>

          {/* Sender */}

          <div className="space-y-2">

            <label className="font-medium">
              Remitente
            </label>

            <input
              className="w-full border rounded-md p-3"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />

          </div>

          {/* Customer Phone */}

          <div className="space-y-2">

            <label className="font-medium">
              Teléfono del Cliente
            </label>

            <input
              className="w-full border rounded-md p-3"
              placeholder="84090925"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
            />

          </div>

          {/* SMS */}

          <div className="space-y-2">

            <label className="font-medium">
              Mensaje SMS
            </label>

            <textarea
              rows={8}
              className="w-full border rounded-md p-3"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

          </div>

          {/* Buttons */}

          <div className="flex gap-3">

            <Button
              variant="outline"
              onClick={generateExample}
            >
              Generar Ejemplo
            </Button>

            <Button
              onClick={handleSendSms}
              disabled={loading}
            >
              {
                loading
                  ? 'Procesando...'
                  : 'Enviar SMS'
              }
            </Button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}