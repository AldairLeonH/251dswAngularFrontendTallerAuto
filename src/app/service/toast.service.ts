import { Injectable, TemplateRef } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
	message: string;
	type: ToastType;
	delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
	toasts: Toast[] = [];

	show(message: string, type: ToastType = 'info', delay?: number) {
		const toast: Toast = {
		  message,
		  type,
		  delay: delay || 3000
		};
		
		console.log('adding this toast', toast);
		this.toasts.push(toast);
	} 
	  

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts = [];
	}
}
