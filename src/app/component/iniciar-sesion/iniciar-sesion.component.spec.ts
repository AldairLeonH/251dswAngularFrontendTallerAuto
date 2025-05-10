import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IniciarSesionComponent } from './iniciar-sesion.component';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';

describe('InicioSesionComponent', () => {
  let component: IniciarSesionComponent;
  let fixture: ComponentFixture<IniciarSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      providers: [AuthService, ToastService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});