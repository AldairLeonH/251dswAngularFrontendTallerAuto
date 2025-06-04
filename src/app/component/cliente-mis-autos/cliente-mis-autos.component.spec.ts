import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteMisAutosComponent } from './cliente-mis-autos.component';

describe('ClienteMisAutosComponent', () => {
  let component: ClienteMisAutosComponent;
  let fixture: ComponentFixture<ClienteMisAutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteMisAutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteMisAutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
