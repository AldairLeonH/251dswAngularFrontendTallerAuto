import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOstComponent } from './ver-ost.component';

describe('VerOstComponent', () => {
  let component: VerOstComponent;
  let fixture: ComponentFixture<VerOstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerOstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerOstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
