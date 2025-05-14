import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ingresar-ost',
  templateUrl: './ingresar-ost.component.html',
  styleUrls: ['./ingresar-ost.component.css'],
  imports: [
    ReactiveFormsModule,CommonModule
  ]
})
export class IngresarOstComponent implements OnInit {

  formOST!: FormGroup;

  marcas = [
    { id: 1, nombre: 'Toyota' },
    { id: 2, nombre: 'Nissan' },
    { id: 3, nombre: 'Chevrolet' }
  ];

  modelos = [
    { id: 1, nombre: 'Corolla', marcaId: 1 },
    { id: 2, nombre: 'Hilux', marcaId: 1 },
    { id: 3, nombre: 'Sentra', marcaId: 2 },
    { id: 4, nombre: 'Frontier', marcaId: 2 },
    { id: 5, nombre: 'Sail', marcaId: 3 }
  ];

  preguntas = [
    { id: 1, pregunta: '¿Tiene rayones?' },
    { id: 2, pregunta: '¿Falta alguna pieza?' },
    { id: 3, pregunta: '¿Requiere cambio de aceite?' },
    { id: 4, pregunta: '¿Luces funcionando?' }
  ];

  constructor(private fb: FormBuilder) {
  this.formOST = this.fb.group({
    marca: new FormControl(''),
    modelo: new FormControl(''),
    persona: new FormControl(''),
    placa: new FormControl(''),
    anio: new FormControl(''),
    fecha: new FormControl(''),
    hora: new FormControl(''),
    direccion: new FormControl(''),
    preguntas: new FormControl([]),
  });
  }

  ngOnInit(): void {
    this.formOST = this.fb.group({
      fecha: [''],
      hora: [''],
      direccion: [''],
      idModelo: [''],
      placa: [''],
      anio: [''],
      preguntas: this.fb.array(this.preguntas.map(() => this.fb.control(false)))
    });

      this.preguntas.forEach(() => {
    this.preguntasFormArray.push(new FormControl(false));
  });
  }

  get preguntasFormArray(): FormArray {
    return this.formOST.get('preguntas') as FormArray;
  }

    obtenerValorModelo() {
    const modelo = this.formOST.get('modelo') as FormControl;
    console.log('Modelo seleccionado:', modelo.value);
  }

  // sin lógica todavía
  onMarcaChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selected = target.value;
    console.log('Marca seleccionada:', selected);
  }

  buscarPersona(): void {
    // No implementado aún
  }

  guardarOST(): void {
    // No implementado aún
    console.log(this.formOST.value);
  }
    seleccionadas: number[] = [];

    onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const id = Number(checkbox.value);

    if (checkbox.checked) {
      this.seleccionadas.push(id);
    } else {
      this.seleccionadas = this.seleccionadas.filter(p => p !== id);
    }
  }
}