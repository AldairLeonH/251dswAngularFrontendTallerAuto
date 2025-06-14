import { TestBed } from '@angular/core/testing';

import { TipoEstadoService } from './tipo-estado.service';

describe('TipoEstadoService', () => {
  let service: TipoEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
