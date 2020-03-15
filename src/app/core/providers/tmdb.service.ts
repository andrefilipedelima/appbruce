import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Producao } from '../models/producao';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private API_URL = "https://api.themoviedb.org/3/";
  private KEY = "api_key=c5b741870c2311cf49febb1f3d228bd2";

  constructor(private http: HttpClient) { }

  buscarPorTexto(strBusca: string, pagina: number): Observable<Resultado>{
    const url_busca = this.API_URL + "search/multi?" + this.KEY + "&language=pt-BR&page=" + pagina + "&query=" + strBusca;

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

  buscarFilmesPopulares(pagina: number): Observable<Resultado>{
    const url_busca = this.API_URL + "movie/popular?" + this.KEY + "&language=pt-BR&page=" + pagina;

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

  buscarSeriesPopulares(pagina: number): Observable<Resultado>{
    const url_busca = this.API_URL + "tv/popular?" + this.KEY + "&language=pt-BR&page=" + pagina;

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

}

export class Resultado{
  Total_Paginas: number; 
  Producoes: Producao[];

  constructor(Total_Paginas: number, Producoes: Producao[]){
    this.Total_Paginas= Total_Paginas;
    this.Producoes = Producoes;
  }

}