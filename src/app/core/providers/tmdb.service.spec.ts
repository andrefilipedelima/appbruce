import { TestBed, inject } from '@angular/core/testing';

import { TmdbService } from './tmdb.service';
import { HttpClientModule } from '@angular/common/http';


describe('TmdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [TmdbService],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: TmdbService = TestBed.get(TmdbService);


    expect(service).toBeTruthy();
    
  });
});
