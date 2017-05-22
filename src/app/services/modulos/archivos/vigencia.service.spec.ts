import { TestBed, inject } from '@angular/core/testing';

import { VigenciaService } from './vigencia.service';

describe('VigenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VigenciaService]
    });
  });

  it('should be created', inject([VigenciaService], (service: VigenciaService) => {
    expect(service).toBeTruthy();
  }));
});
