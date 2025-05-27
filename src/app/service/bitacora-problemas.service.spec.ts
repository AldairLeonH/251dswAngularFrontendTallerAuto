import { TestBed } from '@angular/core/testing';

import { BitacoraProblemasService } from './bitacora-problemas.service';

describe('BitacoraProblemasService', () => {
  let service: BitacoraProblemasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitacoraProblemasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
