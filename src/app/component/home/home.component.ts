import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { EncuestaSatisfaccionService } from '../../service/encuesta-satisfaccion.service';
import { EncuestaSatisfaccionResponse } from '../../model/encuesta-satisfaccion-response';

function shuffleArray<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [CommonModule, DecimalPipe]
})
export class HomeComponent implements OnInit {
  testimoniosFiltrados: any[] = [];
  testimoniosMostrados: any[] = [];
  mostrarTodos: boolean = false;
  loading: boolean = false;

  constructor(
    private encuestaService: EncuestaSatisfaccionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.encuestaService.obtenerTodasLasEncuestas().subscribe({
      next: (encuestas) => {
        this.testimoniosFiltrados = (encuestas || [])
          .filter(e => e.mensaje && e.mensaje.trim() !== '' && e.promedioSatisfaccion >= 4)
          .map(e => ({
            nombreCliente: e.idCliente ? 'Cliente ' + e.idCliente : 'Cliente',
            promedio: e.promedioSatisfaccion,
            comentario: e.mensaje,
            puntaje: e.promedioSatisfaccion
          }));
        this.setTestimoniosAleatorios();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setTestimoniosAleatorios(): void {
    if (this.testimoniosFiltrados.length <= 3) {
      this.testimoniosMostrados = this.testimoniosFiltrados;
    } else {
      this.testimoniosMostrados = shuffleArray(this.testimoniosFiltrados).slice(0, 3);
    }
    this.mostrarTodos = false;
  }

  verMasTestimonios(): void {
    this.testimoniosMostrados = this.testimoniosFiltrados;
    this.mostrarTodos = true;
  }

  verMenosTestimonios(): void {
    this.setTestimoniosAleatorios();
  }

  estrellas(puntaje: number): number[] {
    return Array(Math.round(puntaje)).fill(0);
  }

  // Métodos para funcionalidades adicionales
  scrollToServicios(): void {
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  irARegistro(): void {
    this.router.navigate(['/registrar-cliente']);
  }

  enviarEmail(): void {
    const email = 'contacto@autoseguro.com';
    const asunto = 'Consulta - AutoSeguro';
    const cuerpo = 'Hola, me gustaría obtener más información sobre sus servicios.';
    
    // Detectar si es un dispositivo móvil
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (esMobile) {
      // En móviles, usar mailto: protocol
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
      window.location.href = mailtoLink;
    } else {
      // En desktop, intentar abrir cliente de correo o copiar email
      try {
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.open(mailtoLink, '_self');
      } catch (error) {
        // Fallback: copiar email al portapapeles
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            alert(`Email ${email} copiado al portapapeles. Puedes pegarlo en tu cliente de correo.`);
          }).catch(() => {
            this.mostrarEmail(email);
          });
        } else {
          this.mostrarEmail(email);
        }
      }
    }
  }

  private mostrarEmail(email: string): void {
    alert(`Email: ${email}\n\nPuedes copiarlo manualmente y usarlo en tu cliente de correo.`);
  }

  abrirMaps(): void {
    const direccion = 'Av. Central 123, Lima, Perú';
    
    // Detectar si es un dispositivo móvil
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (esMobile) {
      // En móviles, intentar abrir Google Maps app o navegador
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(direccion)}`;
      window.location.href = mapsUrl;
    } else {
      // En desktop, abrir en nueva pestaña
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(direccion)}`;
      window.open(mapsUrl, '_blank');
    }
  }
}
 