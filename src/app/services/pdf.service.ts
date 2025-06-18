// pdf.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ICotizacionResponse } from '@model/cotizacion-response';
import { ICotizacionServicioResponse } from '@model/cotizacion-servicio-response';
import { IMaterialConCantidadResponse } from '@model/material-con-cantidad-response';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generateCotizacionPDF(
    cotizacion: ICotizacionResponse,
    servicios: ICotizacionServicioResponse[] = [],
    materiales: IMaterialConCantidadResponse[] = []
  ): void {
    const doc = new jsPDF();
    
    // Configuración inicial
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('COTIZACIÓN', 105, 20, { align: 'center' });
    
    // Logo 
    // doc.addImage(logoData, 'PNG', 15, 10, 30, 15);
    
    // Información de la empresa
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Taller Mecánico XYZ', 15, 30);
    doc.text('Av. Principal 123 - Lima', 15, 35);
    doc.text('Teléfono: (01) 123-4567', 15, 40);
    doc.text('RUC: 20123456789', 15, 45);
    
    // Información de la cotización
    doc.setFont('helvetica', 'bold');
    doc.text(`N° Cotización: ${cotizacion.id}`, 150, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${this.formatDate(cotizacion.fecha)}`, 150, 35);
    doc.text(`Estado: ${cotizacion.ost.estado.estado}`, 150, 40);
    
    // Datos del cliente
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', 15, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${cotizacion.ost.auto.persona.apellidoPaterno} ${cotizacion.ost.auto.persona.apellidoMaterno}, ${cotizacion.ost.auto.persona.nombres}`, 15, 65);
    doc.text(`Documento: ${cotizacion.ost.auto.persona.tipoDocumento.tipoDoc} ${cotizacion.ost.auto.persona.nroDocumento}`, 15, 70);
    doc.text(`Teléfono: ${cotizacion.ost.auto.persona.telefono}`, 15, 75);
    
    // Datos del vehículo
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL VEHÍCULO', 15, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Placa: ${cotizacion.ost.auto.placa}`, 15, 90);
    doc.text(`Marca/Modelo: ${cotizacion.ost.auto.modelo.marca.nombre} ${cotizacion.ost.auto.modelo.nombre}`, 15, 95);
    doc.text(`Año: ${cotizacion.ost.auto.anio}`, 15, 100);
    doc.text(`Color: ${cotizacion.ost.auto.color}`, 15, 105);
    
    // Tabla de servicios
    if (servicios.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('SERVICIOS', 15, 115);
      
      const serviciosData = servicios.map(serv => [
        serv.nombre,
        `S/ ${serv.precio.toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: 120,
        head: [['Descripción', 'Precio']],
        body: serviciosData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { left: 15 }
      });
    }
    
    // Tabla de materiales
    if (materiales.length > 0) {
      const startY = servicios.length > 0 ? (doc as any).lastAutoTable.finalY + 10 : 120;
      
      doc.setFont('helvetica', 'bold');
      doc.text('MATERIALES', 15, startY);
      
      const materialesData = materiales.map(mat => [
        mat.nombre,
        mat.cantidad,
        `S/ ${mat.precio.toFixed(2)}`,
        `S/ ${(mat.cantidad * mat.precio).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: startY + 5,
        head: [['Descripción', 'Cantidad', 'P. Unitario', 'Subtotal']],
        body: materialesData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { left: 15 }
      });
    }
    
    // Total
    const finalY = materiales.length > 0 ? (doc as any).lastAutoTable.finalY + 15 : (servicios.length > 0 ? (doc as any).lastAutoTable.finalY + 15 : 120);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: S/ ${cotizacion.total.toFixed(2)}`, 150, finalY);
    
    // Pie de página
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por su preferencia', 105, 280, { align: 'center' });
    doc.text('Válido por 15 días', 105, 285, { align: 'center' });
    
    // Guardar el PDF
    doc.save(`cotizacion_${cotizacion.id}.pdf`);
  }
  
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
