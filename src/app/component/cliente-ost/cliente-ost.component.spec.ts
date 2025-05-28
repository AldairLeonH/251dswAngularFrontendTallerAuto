import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteOstComponent } from './cliente-ost.component';

describe('ClienteOstComponent', () => {
  let component: ClienteOstComponent;
  let fixture: ComponentFixture<ClienteOstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteOstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteOstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
