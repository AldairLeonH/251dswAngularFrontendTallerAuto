import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EncuestaSatisfaccionService } from '../../service/encuesta-satisfaccion.service';
import { ToastService } from '../../service/toast.service';
import { 
  EncuestaSatisfaccionRequest, 
  EvaluacionRequest 
} from '../../model/encuesta-satisfaccion-request';
import { PreguntaEvaluacionResponse } from '../../model/pregunta-evaluacion';

@Component({
  selector: 'app-encuesta-satisfaccion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './encuesta-satisfaccion.component.html',
  styleUrls: ['./encuesta-satisfaccion.component.css']
})
export class EncuestaSatisfaccionComponent implements OnInit {
  encuestaForm: FormGroup;
  preguntas: PreguntaEvaluacionResponse[] = [];
  idRecibo: number = 0;
  idCotizacion: number = 0;
  loading: boolean = false;
  yaTieneEncuesta: boolean = false;

  constructor(
    private fb: FormBuilder,
    private encuestaService: EncuestaSatisfaccionService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.encuestaForm = this.fb.group({
      evaluaciones: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idRecibo = +params['idRecibo'];
      this.idCotizacion = +params['idCotizacion'];
      
      if (this.idRecibo && this.idCotizacion) {
        this.verificarEncuestaExistente();
        this.cargarPreguntas();
      }
    });
  }

  private verificarEncuestaExistente(): void {
    this.encuestaService.verificarEncuestaRecibo(this.idRecibo).subscribe({
      next: (tieneEncuesta) => {
        this.yaTieneEncuesta = tieneEncuesta;
        if (tieneEncuesta) {
          this.toastService.show('Ya existe una encuesta para este recibo', 'warning');
        }
      },
      error: (error) => {
        console.error('Error al verificar encuesta:', error);
        // Si hay error, asumimos que no hay encuesta existente
        this.yaTieneEncuesta = false;
      }
    });
  }

  private cargarPreguntas(): void {
    this.loading = true;
    this.encuestaService.obtenerPreguntasEvaluacion().subscribe({
      next: (preguntas) => {
        this.preguntas = preguntas;
        this.inicializarFormulario();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar preguntas:', error);
        this.toastService.show('Error al cargar las preguntas', 'danger');
        this.loading = false;
      }
    });
  }

  private inicializarFormulario(): void {
    const evaluacionesArray = this.fb.array([]);
    
    this.preguntas.forEach(pregunta => {
      const evaluacionGroup = this.fb.group({
        idPregunta: [pregunta.id, Validators.required],
        puntajeSatisfaccion: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
        comentario: ['']
      });
      
      (evaluacionesArray as any).push(evaluacionGroup);
    });

    this.encuestaForm = this.fb.group({
      evaluaciones: evaluacionesArray
    });
  }

  get evaluacionesArray() {
    return this.encuestaForm.get('evaluaciones') as any;
  }

  onSubmit(): void {
    if (this.encuestaForm.valid && !this.yaTieneEncuesta) {
      this.loading = true;
      
      const formValue = this.encuestaForm.value;
      const evaluaciones: EvaluacionRequest[] = formValue.evaluaciones.map((evaluacion: any) => ({
        idPregunta: evaluacion.idPregunta,
        puntajeSatisfaccion: evaluacion.puntajeSatisfaccion,
        comentario: evaluacion.comentario || undefined
      }));

      const request: EncuestaSatisfaccionRequest = {
        idRecibo: this.idRecibo,
        idCotizacion: this.idCotizacion,
        evaluaciones: evaluaciones
      };

      this.encuestaService.procesarEncuestaSatisfaccion(request).subscribe({
        next: (response) => {
          this.toastService.show('Encuesta enviada exitosamente', 'success');
          this.loading = false;
          this.router.navigate(['/confirmacion-encuesta']);
        },
        error: (error) => {
          console.error('Error al enviar encuesta:', error);
          this.toastService.show('Error al enviar la encuesta', 'danger');
          this.loading = false;
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.encuestaForm.controls).forEach(key => {
      const control = this.encuestaForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  getPreguntaById(id: number): string {
    const pregunta = this.preguntas.find(p => p.id === id);
    return pregunta ? pregunta.pregunta : '';
  }

  isFieldInvalid(fieldName: string, index: number): boolean {
    const control = this.evaluacionesArray.at(index).get(fieldName);
    return control?.invalid && control?.touched;
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
} 