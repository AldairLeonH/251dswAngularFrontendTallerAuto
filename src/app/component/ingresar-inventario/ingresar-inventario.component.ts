import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray ,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ICategoriaItem } from '@model/categoria-item';
import { IItemInventario } from '@model/item-inventario';
import { InventarioService } from '@service/inventario.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { IItemInventarioExtendido } from '@model/item-inventario-ex';

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

nivelesGasolina = [
  { valor: 0, label: 'Vacío (0%)' },
  { valor: 25, label: '1/4 (25%)' },
  { valor: 50, label: 'Medio (50%)' },
  { valor: 75, label: '3/4 (75%)' },
  { valor: 100, label: 'Lleno (100%)' }
];
  constructor(private fb: FormBuilder, private invService: InventarioService) {}

  ngOnInit(): void {
    const idOst = +localStorage.getItem('idOst')!;

    this.form = this.fb.group({
      kilometraje: [null],
      nivelGasolina: [0],
      inventario: this.fb.array([])
    });

    this.invService.getItems().subscribe(items => {
      this.categorias = this.agruparPorCategoria(items);
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
buscarOst() {
  // Aquí tu lógica para redirigir, por ejemplo:
  // this.router.navigate(['/buscar-ost']);
  // o emitir evento para que el padre maneje el redirect
  console.log('Botón Buscar OST pulsado');
}
  onSubmit() {
    const dto = {
      idOst: +localStorage.getItem('idOst')!,
      kilometraje: this.form.value.kilometraje,
      nivelGasolina: this.translateGasLevel(this.form.value.nivelGasolina),
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

    this.invService.registrarInventario(dto).subscribe({
      next: () => Swal.fire('¡Éxito!', 'Inventario registrado correctamente', 'success'),
      error: err => Swal.fire('Error', 'No se pudo registrar el inventario', 'error')
    });
  }

  translateGasLevel(nivel: number): string {
    return ['Vacío', '1/4', '1/2', '3/4', 'Lleno'][nivel] || 'Vacío';
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
}