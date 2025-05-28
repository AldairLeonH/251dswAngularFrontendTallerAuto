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
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxPaginationModule,],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.css'
})
export class BitacoraComponent {
  modalEditarBitacoraInstance: any;

  bitacoraArray: IBitacoraResponse[] = []; // Replace 'any' with the actual type of your bitacora items
  tipoSolucionArray: ITipoSolucion[] = []; // Replace 'any' with the actual type of your tipoSolucion items
  bitacoraRequest: IBitacoraRequest = {} as IBitacoraRequest;
  bitacoraForm: FormGroup;
  page: number = 1;
  constructor(
    private bitacoraProblemasService:BitacoraProblemasService,
    private tipoSolucionService:TipoSolucionService
  ) {
    this.bitacoraForm = new FormGroup({
      idProblema: new FormControl(''),
      descripcionProblema: new FormControl('', [Validators.required]),
      solucion: new FormControl('', [Validators.required]),
      fechaRegistro: new FormControl('', [Validators.required]),
      idTipoSolucion: new FormControl('', [Validators.required]),
    });


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
  confirmarEdicion():void {
        Swal.fire({ 
          title: '¿Está seguro de de editar los datos de la bitacora?',
          showCancelButton: true,
          cancelButtonText: 'NO',
          confirmButtonText: 'Sí',
          focusCancel: true,
          text: 'Por favor espere',
          allowOutsideClick: false,
        }).then((result) => {
          if(result.isConfirmed) {
            this.setBitacoraRequest();
            this.actualizarBitacora();
          } 
        });   

  }
  actualizarBitacora() {
      this.bitacoraProblemasService.actualizarBitacora(this.bitacoraRequest).subscribe(
      (result: any) => {
        this.ngOnInit();
          Swal.fire({
          icon: 'success',
          title: 'Editar Bitacora',
          text: '¡Se edito exitosamente la bitacora !',

        });
        console.log('Bitacora actualizado con éxito', result);
        if (this.modalEditarBitacoraInstance) {
            this.modalEditarBitacoraInstance.hide();
        }

      },
      (error) => {
          Swal.fire({
          icon: 'error',
          title:'Advertencia',
          text: 'No se pudo editar la bitacora',
        });
        console.error('Error al actualizar la bitacora:', error);

      }
    );
  }
  setBitacoraRequest():void {
    this.bitacoraRequest.idProblema = this.bitacoraForm.get('idProblema')?.value;
    this.bitacoraRequest.descripcionProblema = this.bitacoraForm.get('descripcionProblema')?.value;
    this.bitacoraRequest.solucion = this.bitacoraForm.get('solucion')?.value;
    this.bitacoraRequest.fechaRegistro = this.bitacoraForm.get('fechaRegistro')?.value;
    this.bitacoraRequest.idTipoSolucion = this.bitacoraForm.get('idTipoSolucion')?.value;

 
  }
  eliminarBitacora(bitacoraResponse: IBitacoraResponse) {
    this.bitacoraRequest.idProblema = bitacoraResponse.idProblema;
    Swal.fire({
      title: '¿Está seguro de eliminar la bitácora?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'Sí',
      focusCancel: true,
      text: 'Por favor espere',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.bitacoraProblemasService.eliminarBitacora(this.bitacoraRequest).subscribe({
          next: (response) => {
            this.ngOnInit();
            Swal.fire({
              icon: 'success',
              title: 'Eliminar Bitacora',
              text: '¡Se eliminó exitosamente  de la bitácora!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Advertencia',
              text: 'No se pudo eliminar de la bitácora',
            });
            console.error('Error al eliminar  de la bitácora:', error);
          }
        });
      }
    });

  }
  mostrarEditarBitacora(bitacotaResponse: IBitacoraResponse) {
    const modalElement = document.getElementById('modalEditarBitacora')!;
    this.modalEditarBitacoraInstance = new bootstrap.Modal(modalElement);
    this.modalEditarBitacoraInstance.show();
    this.bitacoraForm.patchValue({
      idProblema: bitacotaResponse.idProblema,
      descripcionProblema: bitacotaResponse.descripcionProblema,
      solucion: bitacotaResponse.solucion,
      fechaRegistro: bitacotaResponse.fechaRegistro,
      idTipoSolucion: bitacotaResponse.tipoSolucion.idTipoSolucion,

    });
  }

}
