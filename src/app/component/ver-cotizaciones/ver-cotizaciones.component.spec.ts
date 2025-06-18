import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCotizacionesComponent } from './ver-cotizaciones.component';

describe('VerCotizacionesComponent', () => {
  let component: VerCotizacionesComponent;
  let fixture: ComponentFixture<VerCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCotizacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
