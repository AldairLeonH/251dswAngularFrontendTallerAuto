import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./component/navbar/navbar.component";
import { ToastContainerComponent } from '@component/toast-container/toast-container.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,NavbarComponent,ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '251dswAngularFrontendTallerAuto';
}
