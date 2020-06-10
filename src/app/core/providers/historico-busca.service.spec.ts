import { TestBed } from '@angular/core/testing';

import { HistoricoBuscaService } from './historico-busca.service';

describe('HistoricoBuscaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricoBuscaService = TestBed.get(HistoricoBuscaService);
    expect(service).toBeTruthy();
  });
});
