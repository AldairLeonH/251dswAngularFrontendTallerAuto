import { TestBed } from '@angular/core/testing';

import { TipoSolucionService } from './tipo-solucion.service';

describe('TipoSolucionService', () => {
  let service: TipoSolucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSolucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
