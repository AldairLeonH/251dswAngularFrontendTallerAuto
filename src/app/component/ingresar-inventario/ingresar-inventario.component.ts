import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { ICategoriaItem } from '@model/categoria-item';
import { IItemInventario } from '@model/item-inventario';
import { InventarioService } from '@service/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-inventario',
  imports: [ReactiveFormsModule ],
  templateUrl: './ingresar-inventario.component.html',
  styleUrl: './ingresar-inventario.component.css'
})
export class IngresarInventarioComponent {
  formInventario!: FormGroup;
  categorias: ICategoriaItem[] = [];
  itemsPorCategoria: { [categoria: string]: IItemInventario[] } = {};

  constructor(private fb: FormBuilder, private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.formInventario = this.fb.group({
      idOst: ['', Validators.required],
      items: this.fb.array([]),
      kilometraje: ['', Validators.required],
      gasolina: ['', Validators.required],
      autorizacionConduccion: [false]
    });

    //this.cargarCategoriasEItems();
  }


  guardarInventario() {
    if (this.formInventario.invalid) {
      Swal.fire('Formulario incompleto', 'Llena todos los campos', 'warning');
      return;
    }

    const payload = this.formInventario.value;
    this.inventarioService.registrarInventario(payload).subscribe({
      next: () => Swal.fire('Inventario registrado correctamente', '', 'success'),
      error: () => Swal.fire('Error al registrar inventario', '', 'error')
    });
  }


}
