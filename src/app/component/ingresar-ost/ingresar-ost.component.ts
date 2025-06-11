import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormArray, FormsModule, Validators, FormControl } from '@angular/forms';
import { IModelo } from '@model/modelo';
import { IMarca } from '@model/marca';
import { OstService} from '@service/ost.service';
import { PersonaService} from '@service/persona.service';
import Swal from 'sweetalert2';
import { IPregunta } from '@model/pregunta';
import { IDireccion } from '@model/direccion';
import { IngresarInventarioComponent } from '@component/ingresar-inventario/ingresar-inventario.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var bootstrap: any;

@Component({
  selector: 'app-ingresar-ost',
  templateUrl: './ingresar-ost.component.html',
  styleUrls: ['./ingresar-ost.component.css'],
  imports: [
    ReactiveFormsModule,CommonModule,FormsModule,IngresarInventarioComponent
  ]
})

export class IngresarOstComponent implements OnInit {
  mostrarInventario: boolean = false;
  botonesActivos: boolean = false;
  formOST!: FormGroup;
  marcasArray: IMarca[] = [];
  modelosArray: IModelo[] = [];
  preguntasArray: IPregunta[] = [];
  preguntasSeleccionadas: number[] = [];
  
  anioActual = new Date().getFullYear();
  minAnio = 1900;

  fechaActual!: string;
  horaActual!: string;

  constructor(private fb: FormBuilder, private ostService: OstService) {}

  ngOnInit(): void {
    this.abrirWizard();
    this.formOST = this.fb.group({
      fecha: ['', Validators.required],
      fechaRevison: ['', Validators.required],
      hora: ['', Validators.required],
      direccion: ['', Validators.required],
      idMarca: ['', Validators.required], // se usará solo para filtrar
      idModelo: ['', Validators.required], // se enviará idModelo
      placa: ['', Validators.required],
      color: ['',],
      anio: [''],
      preguntas: this.fb.array([]) // se llenará al cargar
    });

        this.formOST.get('anio')?.setValue(this.anioActual);
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.formOST.get('fecha')?.setValue(this.fechaActual);
    this.formOST.get('fechaRevison')?.setValue(this.fechaActual);
    
      const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    this.horaActual = `${horas}:${minutos}`;
    this.formOST.get('hora')?.setValue(this.horaActual);
    this.cargarDirecciones();
    this.ostService.getMarcas().subscribe(marcas => this.marcasArray = marcas);
    this.ostService.getModelos().subscribe(modelos => this.modelosArray = modelos);
    this.ostService.getPreguntas().subscribe(preguntas => {
    this.preguntasArray = preguntas;
    const formArray = preguntas.map(() => this.fb.control(false));
    this.formOST.setControl('preguntas', this.fb.array(formArray));
    });
  }

  selectedMarcaId: number | null = null;
  modelosFiltrados: IModelo[] = [];

  onMarcaChange(event: Event): void {
    const marcaId = +(event.target as HTMLSelectElement).value;
    this.modelosFiltrados = this.modelosArray.filter(m => m.marca.idMarca === marcaId);
  }

  get preguntasFormArray(): FormArray {
    return this.formOST.get('preguntas') as FormArray;
  }
  direcciones: IDireccion[] = [];

  cargarDirecciones() {
  this.ostService.getDirecciones().subscribe({
    next: (data) => {
      this.direcciones = data;
    },
    error: (err) => {
      console.error('Error al cargar direcciones', err);
    }
  });
}

  filtro: string = '';
  personaEncontrada: any = null;
  autosPersona: any[] = [];

  buscarPersona(): void {
    if (!this.filtro.trim()) return;
    this.ostService.buscarPersona(this.filtro).subscribe({
      next: (persona) => {
        this.personaEncontrada = persona;
          Swal.fire({
            icon: 'success',
            title: 'Persona encontrada',
            timer: 900,
            showConfirmButton: false
          });
        // Obtener autos si la persona fue encontrada
        this.ostService.getAutosPorPersona(persona.idPersona).subscribe({
          next: (autos) => {
            this.autosPersona = autos;
            this.autosFiltrados = [...autos];
          },
          error: () => {
            this.autosPersona = [];
          }
        });
      },
      error: () => {
        this.personaEncontrada = null;
        this.autosPersona = [];
        Swal.fire({
          icon: 'error',
          title: 'No se encontró la persona',
          text: 'Verifica el número de documento',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }
  mostrarAlertaSinPersona = false;

  guardarOST(): void {
    const formValue = this.formOST.value;
  this.ostGuardada = true;

    // Validación obligatoria: persona debe estar seleccionada
    if (!this.personaEncontrada) {
        Swal.fire({
          icon: 'warning',
          title: 'Falta seleccionar una persona',
          text: 'Debe seleccionar una persona antes de guardar la OST.',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'swal2-border-radius'
          }
        });
      return;
    }
    if (this.formOST.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos obligatorios',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const preguntasSeleccionadas = this.preguntasFormArray.value
      .map((checked: boolean, i: number) => checked ? this.preguntasArray[i].id : null)
      .filter((id: number | null) => id !== null);

    const ostPayload = {
      fecha: formValue.fecha,
      fechaRevision: formValue.fechaRevison,
      hora: formValue.hora,
      direccion: formValue.direccion,
      idModelo: formValue.idModelo,
      placa: formValue.placa,
      anio: formValue.anio,
      color: formValue.color,
      idPersona: this.personaEncontrada.idPersona,
      idEstado: 1, // Estado por defecto
      idAuto: this.autoSeleccionado ? this.autoSeleccionado.idAuto : null,
      idRecepcionista: Number(localStorage.getItem('idUsuario')) || 23, // Reemplazar por ID dinámico si usas auth
      preguntas: preguntasSeleccionadas
    };

    console.log('Datos a enviar al backend:', ostPayload);


  this.ostService.registrarOst(ostPayload).subscribe({
    next: (respuesta) => {
      Swal.fire({
        icon: 'success',
        title: 'OST registrada',
        text: 'La orden de servicio fue registrada correctamente.'
      });
      this.modalWizard.hide();  // <- cerrar el modal
        this.pasoActual = 1;
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrar la OST.'
      });
      console.error('Error al registrar la OST:', err);
    }
  });
      //this.botonesActivos = true;
  }

  autoSeleccionado: any =null;
  camposAutoBloqueados: boolean = false;
    seleccionarAuto(auto: any) {
      console.log('Auto recibido:', auto);
      this.autoSeleccionado = auto;

      const idMarca = auto.modelo.marca.idMarca;
      console.log('idMarca:', idMarca);
      const idModelo = auto.modelo.idModelo;

      // Filtrar modelos de esa marca
      this.modelosFiltrados = this.modelosArray.filter(
        modelo => modelo.marca.idMarca === idMarca
      );

      // Establecer los valores en el formulario
      this.formOST.patchValue({
        idMarca: idMarca,
        placa: auto.placa,
        color: auto.color,
        anio: auto.anio,
        idModelo: idModelo
      });

      // Bloquear campos
      this.camposAutoBloqueados = true;
      this.formOST.get('idModelo')?.disable();
      this.formOST.get('idMarca')?.disable();
        this.formOST.get('placa')?.disable();
        this.formOST.get('color')?.disable();
        this.formOST.get('anio')?.disable();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalAutos')!);
      if (modal) modal.hide();
    }

    autosFiltrados: any[] = [];
    abrirModaAutos() {
      // Aquí podrías cargar los autos desde el backend si no los tienes aún
      this.autosFiltrados = [...this.autosPersona]; // copia para filtro
      const modalElement = new bootstrap.Modal(document.getElementById('modalAutos')!);
      modalElement.show();
    }

    filtroPlaca: string = '';

    filtrarAutos() {
      this.autosFiltrados = this.autosPersona.filter(auto =>
        auto.placa.toLowerCase().includes(this.filtroPlaca.toLowerCase())
      );
    }
    quitarAutoSeleccionado() {
        this.camposAutoBloqueados = false;

      this.formOST.get('idMarca')?.enable();
      this.formOST.get('idModelo')?.enable();
      this.formOST.get('placa')?.enable();
      this.formOST.get('color')?.enable();
      this.formOST.get('anio')?.enable();
      this.autoSeleccionado = null;
      this.formOST.patchValue({
        idModelo: null,
        placa: '',
        anio: '',
        color: '',
        idAuto: null,
        idMarca: null
      });
      this.modelosFiltrados = [];
    }
    /////////////
    step = 1;
ostGuardada = false;

pasoActual = 1;

modalWizard: any;

abrirWizard() {
  this.pasoActual = 1;
  this.modalWizard = new bootstrap.Modal(document.getElementById('modalWizardOST')!);
  this.modalWizard.show();
}

abrirInventario() {
  this.pasoActual = 1;
  this.modalWizard = new bootstrap.Modal(document.getElementById('modalWizardOST')!);
  this.modalWizard.show();
}

avanzar() {
  console.log('Nadadadada');
  if (this.pasoActual === 1 && !this.personaEncontrada) {
    Swal.fire('Debes seleccionar una persona antes de continuar');
    return;
  }
  if (this.pasoActual === 2 && !this.autoSeleccionado) {
    // Puede continuar si desea registrar nuevo auto
    // Agrega validaciones aquí si quieres forzar selección
  }
  if (this.pasoActual < 4) {this.pasoActual++};
}

retroceder() {
  if (this.pasoActual > 1) this.pasoActual--;
}

getFormControl(index: number): FormControl {
  return this.preguntasFormArray.at(index) as FormControl;
}

  generarPDF() {
    this.botonesActivos = true;
    const doc = new jsPDF();
  // Logo genérico en base64 (puedes reemplazarlo luego)
const logoBase64 = 'data:image/png;base64,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';
  //this.convertImageToBase64(logoUrl).then((logoBase64) => {
    // Imagen del logo (x, y, width, height)
    doc.addImage(logoBase64, 'PNG', 10, 10, 40, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('REPARA TU VEHÍCULO CON LA MEJOR', 90, 25, { align: 'center' });
    doc.text('CALIDAD Y PRECIO DEL MERCADO', 90, 30, { align: 'center' });


    // 🔹 Recuadro con RUC a la derecha
    const rucX = 130;
    const rucY = 12;
    const rucWidth = 65;
    const rucHeight = 20;

    doc.roundedRect(rucX, rucY, rucWidth, rucHeight, 3, 3, 'S');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RUC: 20564558478', rucX + 5, rucY + 6);
    doc.text('INVENTARIO VEHICULAR', rucX + 5, rucY + 12);
    doc.text('V101 - 00000060', rucX + 5, rucY + 17);

    // Tabla 1: Datos Generales

        const yStart = 60;

    autoTable(doc, {
      startY: 40,
      margin: { left: 10 },
      tableWidth: 95,
      head: [['DATOS GENERALES']],
      body: [
        ['Razón Social: Javier Franco Vargas Perales'],
        ['Dirección: Moche'],
        ['Placas: F5T-221'],
        ['Asesor Comercial: Jean - Demo Automotriz'],
        ['Nro Ficha / Kilometraje: 100000']
      ],
      theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        headStyles: {
        fillColor: [200, 200, 200], // gris claro
        textColor: 0,
        fontStyle: 'bold',
        halign: 'left',
      },
  didDrawCell: function (data) {
    const { cell, row, column, table } = data;
    const isFirstRow = row.index === 0;
    const isLastRow = row.index === table.body.length - 1;
    const isFirstColumn = column.index === 0;
    const isLastColumn = column.index === table.columns.length - 1;

    doc.setDrawColor(0); // negro

    // Dibuja bordes solo si es borde externo
    if (isFirstRow) {
      doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
    }
    if (isLastRow) {
      doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // bottom
    }
    if (isFirstColumn) {
      doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // left
    }
    if (isLastColumn) {
      doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // right
    }
  }
    });

    const y1 = (doc as any).lastAutoTable.finalY + 5;

    // Tabla 2: Datos del Vehículo
    autoTable(doc, {
            startY: 40,
          margin: { left: 105 },
    tableWidth: 95,
      head: [['DATOS DEL VEHÍCULO']],
      body: [
        ['Color: AZUL / Año: 2014'],
        ['Chasis / VIN: M2L...', 'Venc. SOAT: 2025-02-20'],
        ['Fecha: 2024-12-16 / Hora: 17:14 PM']
      ],
      theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        headStyles: {
        fillColor: [200, 200, 200], // gris claro
        textColor: 0,
        fontStyle: 'bold',
        halign: 'left',
      },
  didDrawCell: function (data) {
    const { cell, row, column, table } = data;
    const isFirstRow = row.index === 0;
    const isLastRow = row.index === table.body.length - 1;
    const isFirstColumn = column.index === 0;
    const isLastColumn = column.index === table.columns.length - 1;

    doc.setDrawColor(0); // negro

    // Dibuja bordes solo si es borde externo
    if (isFirstRow) {
      doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
    }
    if (isLastRow) {
      doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // bottom
    }
    if (isFirstColumn) {
      doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // left
    }
    if (isLastColumn) {
      doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // right
    }
  }
    });

    const y2 = (doc as any).lastAutoTable.finalY + 20;

    // Tabla 3: Accesorios Externos
    autoTable(doc, {
     startY: y2,
     margin: { left: 10 },
     tableWidth: 88,
      head: [['ACCESORIOS EXTERNOS', 'Bueno', 'Regular', 'Malo']],
      body: [
        ['Faros Delanteros', '✔', '', ''],
        ['Luces Direccionales Delanteras', '', '✔', ''],
        ['Parachoque Delantero', '', '', '✔']
      ],
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        font: 'helvetica',
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      headStyles: {
        lineColor: [0, 0, 0],
        fillColor: [200, 200, 200], // 🔸 gris claro
        textColor: 0,
        lineWidth: 0.2,
        fontStyle: 'bold',
        halign: 'left',
      },
    });

    const y3 = (doc as any).lastAutoTable.finalY + 10;

    // Tabla 4: Documentos del Vehículo
    autoTable(doc, {
      startY: y2,
           margin: { left: 105 },
     tableWidth: 88,
      head: [['DOCUMENTOS DEL VEHÍCULO', 'Cantidad']],
      body: [
        ['Tarjeta de Propiedad', '1'],
        ['SOAT', '1'],
        ['Rev. Técnica', '']
      ],
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        font: 'helvetica',
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      headStyles: {
        lineColor: [0, 0, 0],
        fillColor: [200, 200, 200], // 🔸 gris claro
        lineWidth: 0.2,
        textColor: 0,
        //fontStyle: 'bold',
        halign: 'left',
      }
    });
    window.open(doc.output('bloburl'), '_blank');
  }

// Convertir imagen a base64 desde URL
convertImageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = () => reject('No se pudo cargar la imagen');
  });
}

}