import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTecnicoComponent } from './menu-tecnico.component';

describe('MenuTecnicoComponent', () => {
  let component: MenuTecnicoComponent;
  let fixture: ComponentFixture<MenuTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTecnicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
