import { Component } from '@angular/core';
import { IBitacoraRequest } from '@model/bitacora-request';
import { IBitacoraResponse } from '@model/bitacora-response';
import { ITipoSolucion } from '@model/tipo-solucion';
import { BitacoraProblemasService } from '@service/bitacora-problemas.service';
import { TipoSolucionService } from '@service/tipo-solucion.service';
import { CommonModule } from '@angular/common';
import { 
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,

} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxPaginationModule,],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.css'
})
export class BitacoraComponent {
  bitacoraArray: IBitacoraResponse[] = []; // Replace 'any' with the actual type of your bitacora items
  tipoSolucionArray: ITipoSolucion[] = []; // Replace 'any' with the actual type of your tipoSolucion items
  bitacoraRequest: IBitacoraRequest = {} as IBitacoraRequest;

  page: number = 1; // For pagination, if needed
  constructor(
    private bitacoraProblemasService:BitacoraProblemasService,
    private tipoSolucionService:TipoSolucionService
  ) {
    
  }

  ngOnInit() {
    this.getBitacora();
    this.getTipoSolucion();
  }
  getTipoSolucion() {
    this.tipoSolucionService.getTipoSolucion().subscribe({
      next: (response: ITipoSolucion[]) => {
        this.tipoSolucionArray = response;
        console.log('Contenido de tipoSolucionArray:', this.tipoSolucionArray);
      },
      error: (error) => {
        console.error('Error fetching tipo solucion:', error);
        console.log('Contenido de tipoSolucionArray:', this.tipoSolucionArray);
      }
    });
    
  }
  getBitacora() {
    this.bitacoraProblemasService.getBitacoras().subscribe({
      next: (response: IBitacoraResponse[]) => {
        this.bitacoraArray = response;
        console.log('Contenido de bitacoraArray:', this.bitacoraArray);
      },
      error: (error) => {
        console.error('Error fetching bitacora:', error);
      }
    });
  }
}
