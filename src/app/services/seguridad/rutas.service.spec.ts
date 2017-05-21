/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RutasService } from './rutas.service';

describe('RutasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RutasService]
    });
  });

  it('should ...', inject([RutasService], (service: RutasService) => {
    expect(service).toBeTruthy();
  }));
});
