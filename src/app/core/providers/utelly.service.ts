import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utelly_Item } from '../models/utelly_item';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtellyService {
  private httpOptions = {
    headers: new HttpHeaders({
      'x-rapidapi-host':  'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
      'x-rapidapi-key': '57adc7d1cemsh29ff47261d5b29bp1a6ef1jsn98ed1b087bfb'
    })
  };

  private URL_BASE = 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/';

  constructor(private http: HttpClient) { 

  }

  buscarEmQualStreamingPorId(id_producao: number, baseParaConsultar: 'tmdb'): Observable<Utelly_Item>{
    const url_busca = `${this.URL_BASE}idlookup?country=BR&source_id=${id_producao}&source=${baseParaConsultar}`

    return this.http
               .get<Utelly_Item>(url_busca, this.httpOptions)
               .pipe(map((result: any) => result.collection));
  }

}
