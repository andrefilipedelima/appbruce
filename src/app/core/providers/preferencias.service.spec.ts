import { TestBed } from '@angular/core/testing';

import { PreferenciasService } from './preferencias.service';

describe('PreferenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreferenciasService = TestBed.get(PreferenciasService);
    expect(service).toBeTruthy();
  });
});
