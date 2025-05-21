import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';
import { IModelo } from '@model/modelo';
import { IMarca } from '@model/marca';
import { OstService} from '@service/ost.service';
import { PersonaService} from '@service/persona.service';
import { IPregunta } from '@model/pregunta';
declare var bootstrap: any; // Añade esta línea arriba del `@Component`

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
  guardarOST(): void {
    const formValue = this.formOST.value;

  console.log('Formulario:', formValue);


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
      idPersona: this.personaEncontrada ? this.personaEncontrada.idPersona : null,
      idEstado: 1, // o el valor que uses por defecto
      idAuto: this.autoSeleccionado ? this.autoSeleccionado.idAuto : null,
      idRecepcionista: 23, // lo puedes obtener del token de sesión si tienes auth
      preguntas: preguntasSeleccionadas
    };

    console.log('Datos a enviar al backend:', ostPayload);

  this.ostService.registrarOst(ostPayload).subscribe({
    next: (respuesta) => {
      console.log('OST registrada con éxito', respuesta);
    },
    error: (err) => {
      console.error('Error al registrar la OST:', err);
      console.log('Datos a error enviar al backend:', ostPayload);
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