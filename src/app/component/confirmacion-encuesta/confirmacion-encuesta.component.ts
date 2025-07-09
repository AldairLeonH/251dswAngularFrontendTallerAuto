import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-encuesta.component.html',
  styleUrls: ['./confirmacion-encuesta.component.css']
})
export class ConfirmacionEncuestaComponent {

  constructor(private router: Router) { }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  irAPanelEncuestas(): void {
    this.router.navigate(['/panel-encuestas']);
  }
} 