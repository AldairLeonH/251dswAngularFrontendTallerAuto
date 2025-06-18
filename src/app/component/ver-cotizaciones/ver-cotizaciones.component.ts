import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICotizacionResponse } from '@model/cotizacion-response';
import { ICotizacionServicioResponse } from '@model/cotizacion-servicio-response';
import { IMaterialConCantidadResponse } from '@model/material-con-cantidad-response';
import { CotizacionService } from '@service/cotizacion.service';
import jsPDF from 'jspdf';
import { PdfService } from 'src/app/services/pdf.service';
declare var bootstrap: any;

@Component({
  selector: 'app-ver-cotizaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-cotizaciones.component.html',
  styleUrl: './ver-cotizaciones.component.css'
})
export class VerCotizacionesComponent {
  cotizaciones: ICotizacionResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  servicios: ICotizacionServicioResponse[] = [];
  materiales: IMaterialConCantidadResponse[] = [];
  cotizacionSeleccionadaId: number | null = null;
  
  constructor(private cotizacionService: CotizacionService,private pdfService: PdfService) {}
  ngOnInit(): void {
    this.loadCotizaciones();
  }

  loadCotizaciones(): void {
    this.loading = true;
    this.error = null;

    this.cotizacionService.getCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las cotizaciones. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error fetching cotizaciones:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  verMaterialesYServicios(idCotizacion: number): void {
    this.cotizacionSeleccionadaId = idCotizacion;
    this.servicios = [];
    this.materiales = [];

    this.cotizacionService.getMaterialesPorCotizacion(idCotizacion).subscribe({
      next: (data) => this.materiales = data,
      error: (err) => console.error('Error cargando materiales:', err)
    });

    this.cotizacionService.getServiciosPorCotizacion(idCotizacion).subscribe({
      next: (data) => this.servicios = data,
      error: (err) => console.error('Error cargando servicios:', err)
    });

    const modalElement = document.getElementById('modalDetalle');
    if (modalElement) {
      new bootstrap.Modal(modalElement).show();
    }
  }
  generarPDF(cotizacion: ICotizacionResponse): void {
    this.cotizacionService.getMaterialesPorCotizacion(cotizacion.id).subscribe({
      next: (materiales) => {
        this.cotizacionService.getServiciosPorCotizacion(cotizacion.id).subscribe({
          next: (servicios) => {
            this.pdfService.generateCotizacionPDF(cotizacion, servicios, materiales);
          },
          error: (err) => {
            console.error('Error al obtener servicios:', err);
            // Generar PDF solo con los datos básicos si falla la obtención de servicios
            this.pdfService.generateCotizacionPDF(cotizacion, [], materiales);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener materiales:', err);
        // Intentar obtener solo servicios si falla la obtención de materiales
        this.cotizacionService.getServiciosPorCotizacion(cotizacion.id).subscribe({
          next: (servicios) => {
            this.pdfService.generateCotizacionPDF(cotizacion, servicios, []);
          },
          error: (err) => {
            console.error('Error al obtener servicios:', err);
            // Generar PDF solo con los datos básicos
            this.pdfService.generateCotizacionPDF(cotizacion, [], []);
          }
        });
      }
    });
  }  

 
}
