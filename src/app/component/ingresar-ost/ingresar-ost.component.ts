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
import { IUsuarioResponse } from '@model/usuario-response';
import { UsuarioService } from '@service/usuario.service';
import { IPersonaResponse } from '@model/persona-response';
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
  
  supervisorArray: IUsuarioResponse[] = [];
  marcasArray: IMarca[] = [];
  modelosArray: IModelo[] = [];
  preguntasArray: IPregunta[] = [];
  preguntasSeleccionadas: number[] = [];
  
  anioActual = new Date().getFullYear();
  minAnio = 1900;

  fechaActual!: string;
  horaActual!: string;

  constructor(private fb: FormBuilder, private ostService: OstService,
    private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.abrirWizard();
    this.formOST = this.fb.group({
      fecha: ['', Validators.required],
      fechaRevison: ['', Validators.required],
      hora: ['', Validators.required],
      idDireccion: ['', Validators.required],
      idMarca: ['', Validators.required], // se usará solo para filtrar
      idModelo: ['', Validators.required], // se enviará idModelo
      placa: ['', Validators.required],
      color: ['',],
      anio: [''],
      preguntas: this.fb.array([]) // se llenará al cargar
    });

    this.getSupervisores();
        this.formOST.get('anio')?.setValue(this.anioActual);
    const hoy = new Date();
    this.fechaActual = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.formOST.get('fecha')?.setValue(this.fechaActual);
    this.formOST.get('fechaRevison')?.setValue(this.fechaActual);
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
  personaEncontrada!: IPersonaResponse;
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
        this.personaEncontrada;
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
    this.botonesActivos =true;

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
      idDireccion: formValue.idDireccion,
      idModelo: formValue.idModelo,
      placa: formValue.placa,
      anio: formValue.anio,
      color: formValue.color,
      idPersona: this.personaEncontrada.idPersona,
      idEstado: 1, // Estado por defecto
      idAuto: this.autoSeleccionado ? this.autoSeleccionado.idAuto : null,
      idRecepcionista: Number(localStorage.getItem('idUsuario')) || 23, // Reemplazar por ID dinámico si usas auth
      idSupervisor: this.supervisorSeleccionado? this.supervisorSeleccionado.idUsuario: null,
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
        localStorage.setItem('idOst', respuesta.idOst.toString());
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
      const form = this.formOST.value;

      // Datos de persona
    const datosCliente = {
      nombreCompleto: `${this.personaEncontrada.nombres} ${this.personaEncontrada.apellidoPaterno} ${this.personaEncontrada.apellidoMaterno}`,
      direccion: this.personaEncontrada.direccion,
      telefono: this.personaEncontrada.telefono,
      nroDocumento: this.personaEncontrada.nroDocumento
    };
const marcaSeleccionada = this.marcasArray.find(m => m.idMarca === form.idMarca);
const modeloSeleccionado = this.modelosArray.find(m => m.idModelo === form.idModelo);
    const datosVehiculo = this.autoSeleccionado ? {
      placa: this.autoSeleccionado.placa,
      color: this.autoSeleccionado.color,
      anio: this.autoSeleccionado.anio,
      marca: this.autoSeleccionado.modelo.marca.nombre,
      modelo: this.autoSeleccionado.modelo.nombre,
      fecha: form.fecha,
      hora: form.hora
    } : {
      placa: form.placa,
      color: form.color,
      anio: form.anio,
      marca: marcaSeleccionada?.nombre || '',
      modelo: modeloSeleccionado?.nombre || '',
      fecha: form.fecha,
      hora: form.hora
    };

      // Guardar en localStorage
      localStorage.setItem('datosCliente', JSON.stringify(datosCliente));
      localStorage.setItem('datosVehiculo', JSON.stringify(datosVehiculo));
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
  if (this.pasoActual === 1 && !this.personaEncontrada) {
    Swal.fire('Debes seleccionar una persona antes de continuar');
    return;
  }
  if (this.pasoActual === 2 && !this.autoSeleccionado) {
    // Puede continuar si desea registrar nuevo auto
    // Agrega validaciones aquí si quieres forzar selección
  }
  if (this.pasoActual < 5) {this.pasoActual++};
}

retroceder() {
  if (this.pasoActual > 1) this.pasoActual--;
}

getFormControl(index: number): FormControl {
  return this.preguntasFormArray.at(index) as FormControl;
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
nombreSupervisor: string = '';
supervisorSeleccionado:  any = null;
  supervisorArrayOriginal: IUsuarioResponse[] = [];
  getSupervisores(): void {
    this.usuarioService.getUsuarios().subscribe((result: any) => {
      // Filtrar solo los usuarios cuyo id_rol = 3
      this.supervisorArray = result.filter((usuario: IUsuarioResponse) => 
        usuario.rol?.idRol === 5
      );
      this.supervisorArrayOriginal = result.filter((usuario: IUsuarioResponse) => 
        usuario.rol?.idRol === 5
      );
    });
  }

  filtrarSupervisores() {
  const filtro = this.nombreSupervisor.toLowerCase();
  this.supervisorArray = this.supervisorArrayOriginal.filter(sup =>
    (sup.persona.nombres + ' ' + sup.persona.apellidoPaterno + ' ' + sup.persona.apellidoMaterno).toLowerCase().includes(filtro)
  );
}

seleccionarSupervisor(supervisor: any) {
  this.supervisorSeleccionado = supervisor;
  console.log(supervisor+' dfdfd');
}

}