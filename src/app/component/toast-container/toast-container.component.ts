import { Component, inject } from '@angular/core';

import { ToastService, ToastType } from '@service/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-toast-container',
  standalone: true,
  	imports: [NgbToastModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastContainerComponent {
	toastService = inject(ToastService); 

  getToastClass(type: ToastType): string {
    const baseClass = 'text-light';
    switch (type) {
      case 'success': return `bg-success ${baseClass}`;
      case 'danger': return `bg-danger ${baseClass}`;
      case 'warning': return `bg-warning ${baseClass}`;
      case 'info': return `bg-info ${baseClass}`;
      default: return baseClass;
    }
  }
}
