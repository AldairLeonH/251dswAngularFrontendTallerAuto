import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarClientesComponent } from './ingresar-clientes.component';

describe('IngresarClientesComponent', () => {
  let component: IngresarClientesComponent;
  let fixture: ComponentFixture<IngresarClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
