/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutenticacionService } from './autenticacion.service';

describe('AutenticacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutenticacionService]
    });
  });

  it('should ...', inject([AutenticacionService], (service: AutenticacionService) => {
    expect(service).toBeTruthy();
  }));
});
