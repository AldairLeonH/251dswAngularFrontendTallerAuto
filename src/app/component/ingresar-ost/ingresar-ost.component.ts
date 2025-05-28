import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';
import { IModelo } from '@model/modelo';
import { IMarca } from '@model/marca';
import { OstService} from '@service/ost.service';
import { PersonaService} from '@service/persona.service';
import Swal from 'sweetalert2';
import { IPregunta } from '@model/pregunta';
declare var bootstrap: any;

@Component({
  selector: 'app-ingresar-ost',
  templateUrl: './ingresar-ost.component.html',
  styleUrls: ['./ingresar-ost.component.css'],
  imports: [
    ReactiveFormsModule,CommonModule,FormsModule
  ]
})
export class IngresarOstComponent implements OnInit {

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
    this.formOST = this.fb.group({
      fecha: ['', Validators.required],
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
    
      const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    this.horaActual = `${horas}:${minutos}`;
    this.formOST.get('hora')?.setValue(this.horaActual);

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

  filtro: string = '';
  personaEncontrada: any = null;
  autosPersona: any[] = [];

  buscarPersona(): void {
    if (!this.filtro.trim()) return;
    this.ostService.buscarPersona(this.filtro).subscribe({
      next: (persona) => {
        this.personaEncontrada = persona;
        alert('persona encontrada');
        // Obtener autos si la persona fue encontrada
        this.ostService.getAutosPorPersona(persona.idPersona).subscribe({
          next: (autos) => {
            this.autosPersona = autos;
          },
          error: () => {
            this.autosPersona = [];
          }
        });
      },
      error: () => {
        this.personaEncontrada = null;
        this.autosPersona = [];
        alert('No se encontró persona con ese dato');
      }
    });
  }
  mostrarAlertaSinPersona = false;

  guardarOST(): void {
    const formValue = this.formOST.value;

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
      hora: formValue.hora,
      direccion: formValue.direccion,
      idModelo: formValue.idModelo,
      placa: formValue.placa,
      anio: formValue.anio,
      color: formValue.color,
      idPersona: this.personaEncontrada.idPersona,
      idEstado: 1, // Estado por defecto
      idAuto: this.autoSeleccionado ? this.autoSeleccionado.idAuto : null,
      idRecepcionista: Number(localStorage.getItem('idUsuario')), // Reemplazar por ID dinámico si usas auth
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
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalAutos')!);
      if (modal) modal.hide();
    }

    autosFiltrados: any[] = [];
    abrirModalAutos() {
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
}