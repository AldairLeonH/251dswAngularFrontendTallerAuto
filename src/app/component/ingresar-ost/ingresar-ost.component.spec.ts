import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarOstComponent } from './ingresar-ost.component';

describe('IngresarOstComponent', () => {
  let component: IngresarOstComponent;
  let fixture: ComponentFixture<IngresarOstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarOstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarOstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
