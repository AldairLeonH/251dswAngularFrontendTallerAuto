import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray ,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ICategoriaItem } from '@model/categoria-item';
import { IItemInventario } from '@model/item-inventario';
import { InventarioService } from '@service/inventario.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { IItemInventarioExtendido } from '@model/item-inventario-ex';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-ingresar-inventario',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ingresar-inventario.component.html',
  styleUrl: './ingresar-inventario.component.css'
})
export class IngresarInventarioComponent implements OnInit {

  form!: FormGroup;
  items: IItemInventario[] = [];
  categorias: ICategoriaItem[] = [];
  itemsPorCategoria: { [key: number]: IItemInventarioExtendido[] } = {};
  kilometraje: number = 0;
gasolina: number = 50;
loading = true;

nivelesGasoina = [
  { valor: 0, label: 'Vacío (0%)' },
  { valor: 25, label: '1/4 (25%)' },
  { valor: 50, label: 'Medio (50%)' },
  { valor: 75, label: '3/4 (75%)' },
  { valor: 100, label: 'Lleno (100%)' }
];
  botonesActivos: boolean = false;
  constructor(private fb: FormBuilder, private invService: InventarioService) {}

  ngOnInit(): void {
    const idOst = localStorage.getItem('idOst')!;
    console.log(idOst);

          this.form = this.fb.group({
      kilometraje: [null, Validators.required],
      nivelGasolina: [0, Validators.required],
      inventario: this.fb.array([])
    });

    this.invService.getItems().subscribe(items => {
      this.categorias = this.agruparPorCategoria(items);
    this.loading = false;
    });
  }

  get inventario(): FormArray {
    return this.form.get('inventario') as FormArray;
  }

agruparPorCategoria(items: IItemInventario[]): ICategoriaItem[] {
  const map = new Map<number, ICategoriaItem>();

  items.forEach(item => {
    const cat = item.categoria;
    if (!map.has(cat.idCategoria)) {
      map.set(cat.idCategoria, { idCategoria: cat.idCategoria, nombre: cat.nombre, items: [] });
    }
    const itemExtendido: IItemInventarioExtendido = {
      ...item,
      cantidad: 0,
      estado: 'Bueno',
      seleccionado: false
    };
    map.get(cat.idCategoria)?.items.push(itemExtendido);
  });

  return Array.from(map.values());
}
  getItemGroup(idItem: number): FormGroup {
    return this.inventario.controls.find(c => c.value.idItem === idItem) as FormGroup;
  }
cargar() {
  // Aquí tu lógica para redirigir, por ejemplo:
  // this.router.navigate(['/buscar-ost']);
  // o emitir evento para que el padre maneje el redirect
  
  console.log('Botón Buscar OST pulsado'+this.form.value.kilometraje+this.form.value.nivelGasolina);
}
  onSubmit() {

    const formValue = this.form.value;
    const dto = {
      idOst: +localStorage.getItem('idOst')!,
      kilometraje: formValue.kilometraje,
      nivelGasolina: this.translateGasLevel(formValue.nivelGasolina),
      inventario: this.categorias.flatMap(cat =>
        cat.items
          .filter(item => item.seleccionado)
          .map(item => ({
            idItem: item.idItem,
            cantidad: item.cantidad,
            estado: item.estado
          }))
      )
    };
    console.log('Datos a enviar al backend:', dto);
    this.invService.registrarInventario(dto).subscribe({
      next: () => Swal.fire('¡Éxito!', 'Inventario registrado correctamente', 'success'),
      error: err => Swal.fire('Error', 'No se pudo registrar el inventario', 'error')
    });
        this.botonesActivos = true;
  }

translateGasLevel(valor: number): string {
  const niveles = ["Vacío", "1/4", "1/2", "3/4", "Lleno"];
  return niveles[valor] ?? "Desconocido";
}

  toggleSeleccion(item: any) {
  item.seleccionado = !item.seleccionado;

  if (item.seleccionado) {
    this.inventario.push(this.fb.group({
      idItem: [item.idItem],
      cantidad: [item.cantidad],
      estado: [item.estado]
    }));
  } else {
    const index = this.inventario.controls.findIndex(c => c.value.idItem === item.idItem);
    if (index !== -1) {
      this.inventario.removeAt(index);
    }
  }
}
onCantidadChange(item: any, nuevaCantidad: number) {
  item.cantidad = nuevaCantidad;
  const group = this.getItemGroup(item.idItem);
  if (group) group.get('cantidad')?.setValue(nuevaCantidad);
}

  onEstadoChange(item: any, nuevoEstado: string) {
    item.estado = nuevoEstado;
    const group = this.getItemGroup(item.idItem);
    if (group) group.get('estado')?.setValue(nuevoEstado);
  }
drawBorders(doc: jsPDF) {
  return function (data: any) {
    const { cell, row, column, table } = data;
    const isFirstRow = row.index === 0;
    const isLastRow = row.index === table.body.length - 1;
    const isFirstColumn = column.index === 0;
    const isLastColumn = column.index === table.columns.length - 1;

    doc.setDrawColor(0);
    if (isFirstRow) doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
    if (isLastRow) doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
    if (isFirstColumn) doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
    if (isLastColumn) doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
  };
}

generarPDF() {
  const doc = new jsPDF();
  const datosCliente = JSON.parse(localStorage.getItem('datosCliente') || '{}');
  const datosVehiculo = JSON.parse(localStorage.getItem('datosVehiculo') || '{}');
  const logoBase64 = 'data:image/png;base64,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';

  doc.addImage(logoBase64, 'PNG', 10, 10, 40, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('REPARA TU VEHÍCULO CON LA MEJOR', 90, 25, { align: 'center' });
  doc.text('CALIDAD Y PRECIO DEL MERCADO', 90, 30, { align: 'center' });

  doc.roundedRect(130, 12, 65, 20, 3, 3, 'S');
  doc.setFont('helvetica', 'bold');
  doc.text('RUC: 20564558478', 135, 18);
  doc.text('INVENTARIO VEHICULAR', 135, 24);
  doc.text('V101 - 00000060', 135, 30);

  // Tabla izquierda: Datos del Cliente
  autoTable(doc, {
    startY: 40,
    margin: { left: 10 },
    tableWidth: 95,
    head: [['DATOS GENERALES']],
    body: [
      [`Razón Social: ${datosCliente.nombreCompleto || ''}`],
      [`Dirección: ${datosCliente.direccion || ''}`],
      [`Placas: ${datosVehiculo.placa || ''}`],
      [`Teléfono: ${datosCliente.telefono || ''}`],
      [`Documento: ${datosCliente.nroDocumento || ''}`]
    ],
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 9, textColor: [0, 0, 0] },
    headStyles: { fillColor: [200, 200, 200], fontStyle: 'bold', halign: 'left' },
    didDrawCell: this.drawBorders(doc)
  });

  // Tabla derecha: Datos del Vehículo
  autoTable(doc, {
    startY: 40,
    margin: { left: 110 },
    tableWidth: 90,
    head: [['DATOS DEL VEHÍCULO']],
    body: [
      [`Color: ${datosVehiculo.color || ''} / Año: ${datosVehiculo.anio || ''}`],
      [`Marca: ${datosVehiculo.marca || ''} / Modelo: ${datosVehiculo.modelo || ''}`],
      [`Fecha: ${datosVehiculo.fecha || ''} / Hora: ${datosVehiculo.hora || ''}`],
      [`Kilometraje: ${this.form.value.kilometraje}`],
      [`Gasolina: ${this.translateGasLevel(this.form.value.nivelGasolina)}`]
    ],
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 9, textColor: [0, 0, 0] },
    headStyles: { fillColor: [200, 200, 200], fontStyle: 'bold', halign: 'left' },
    didDrawCell: this.drawBorders(doc)
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Tabla de inventario por categoría
  this.categorias.forEach(cat => {
    const items = cat.items.filter(i => i.seleccionado);
    if (items.length === 0) return;

    const body = items.map(i => [
      i.nombre,
      i.cantidad.toString(),
      i.estado === 'Bueno' ? '✔' : '',
      i.estado === 'Regular' ? '✔' : '',
      i.estado === 'Malo' ? '✔' : ''
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: 10 },
      tableWidth: 190,
      head: [[cat.nombre.toUpperCase(), 'Cantidad', 'Bueno', 'Regular', 'Malo']],
      body: body,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 9, textColor: [0, 0, 0] },
      headStyles: {
        fillColor: [220, 220, 220],
        fontStyle: 'bold',
        textColor: 0,
        halign: 'left'
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  });
    // Sección de firmas (al final del PDF)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Posición base
    const firmaY = (doc as any).lastAutoTable.finalY + 30;

    doc.line(30, firmaY, 90, firmaY); // Línea firma cliente
    doc.text('Firma del Cliente', 45, firmaY + 5);

    doc.line(120, firmaY, 180, firmaY); // Línea firma técnico
    doc.text('Firma del Técnico', 135, firmaY + 5);

    // Puedes agregar fecha de impresión si deseas
    const fechaHoy = new Date().toLocaleDateString();
    doc.text(`Fecha de impresión: ${fechaHoy}`, 150, firmaY + 20);
      // Abrir el PDF en una nueva pestaña
      window.open(doc.output('bloburl'), '_blank');
    }

}