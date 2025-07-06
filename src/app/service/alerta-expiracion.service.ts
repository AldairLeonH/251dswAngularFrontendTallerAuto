import { Injectable } from '@angular/core';
import { interval, Observable, Subscription, catchError, of } from 'rxjs';
import { ToastService } from './toast.service';
import { CotizacionService } from './cotizacion.service';
import { ICotizacionResponse } from '@model/cotizacion-response';

@Injectable({
  providedIn: 'root'
})
export class AlertaExpiracionService {
  private timerSubscription?: Subscription;
  private cotizacionesVigentes: ICotizacionResponse[] = [];
  private alertasMostradas = new Set<number>();
  private isChecking = false; // Flag para evitar verificaciones concurrentes

  constructor(
    private cotizacionService: CotizacionService,
    private toastService: ToastService
  ) {}

  iniciarMonitoreo(cotizaciones: ICotizacionResponse[]): void {
    this.detenerMonitoreo();
    this.cotizacionesVigentes = cotizaciones;
    this.alertasMostradas.clear();

    // Verificar cada 60 segundos en lugar de 30 para reducir carga
    this.timerSubscription = interval(60000).subscribe(() => {
      this.verificarExpiraciones();
    });

    // Verificación inicial después de 5 segundos
    setTimeout(() => {
      this.verificarExpiraciones();
    }, 5000);
  }

  detenerMonitoreo(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
    this.isChecking = false;
  }

  private verificarExpiraciones(): void {
    // Evitar verificaciones concurrentes
    if (this.isChecking || this.cotizacionesVigentes.length === 0) {
      return;
    }

    this.isChecking = true;
    let completedChecks = 0;
    const totalChecks = this.cotizacionesVigentes.length;

    this.cotizacionesVigentes.forEach(cotizacion => {
      this.cotizacionService.getEstadoCotizacion(cotizacion.id)
        .pipe(
          catchError(err => {
            console.error('Error verificando expiración de cotización:', err);
            return of(null);
          })
        )
        .subscribe({
          next: (estado) => {
            if (estado?.tiempoExpiracion) {
              const tiempo = estado.tiempoExpiracion;
              
              // Alerta cuando está próxima a expirar (5 minutos o menos)
              if (tiempo.proximaAExpirar && !tiempo.expirada && !this.alertasMostradas.has(cotizacion.id)) {
                this.mostrarAlertaProximaExpiracion(cotizacion, tiempo.minutosRestantes);
                this.alertasMostradas.add(cotizacion.id);
              }
              
              // Alerta cuando expira
              if (tiempo.expirada && !this.alertasMostradas.has(cotizacion.id * -1)) {
                this.mostrarAlertaExpiracion(cotizacion);
                this.alertasMostradas.add(cotizacion.id * -1);
              }
            }
            
            completedChecks++;
            if (completedChecks === totalChecks) {
              this.isChecking = false;
            }
          },
          error: (err) => {
            console.error('Error verificando expiración de cotización:', err);
            completedChecks++;
            if (completedChecks === totalChecks) {
              this.isChecking = false;
            }
          }
        });
    });
  }

  private mostrarAlertaProximaExpiracion(cotizacion: ICotizacionResponse, minutosRestantes: number): void {
    const mensaje = `⚠️ Cotización #${cotizacion.id} expira en ${minutosRestantes} minutos`;
    this.toastService.show(mensaje, 'warning', 5000);
    
    // También mostrar notificación del navegador si está disponible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cotización próxima a expirar', {
        body: `La cotización #${cotizacion.id} expira en ${minutosRestantes} minutos`,
        icon: '/favicon.ico'
      });
    }
  }

  private mostrarAlertaExpiracion(cotizacion: ICotizacionResponse): void {
    const mensaje = `❌ Cotización #${cotizacion.id} ha expirado`;
    this.toastService.show(mensaje, 'danger', 5000);
    
    // Notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cotización expirada', {
        body: `La cotización #${cotizacion.id} ha expirado`,
        icon: '/favicon.ico'
      });
    }
  }

  solicitarPermisosNotificacion(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.toastService.show('Notificaciones habilitadas', 'success');
        }
      });
    }
  }

  actualizarCotizaciones(cotizaciones: ICotizacionResponse[]): void {
    this.cotizacionesVigentes = cotizaciones;
    this.alertasMostradas.clear();
  }

  limpiarAlertas(): void {
    this.alertasMostradas.clear();
  }
} 