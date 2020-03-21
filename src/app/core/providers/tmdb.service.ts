import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Producao } from '../models/producao';
import { Genero } from '../models/genero';
import { ParametroBusca } from '../models/parametroBusca';

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

  buscarPopulares(pagina: number, media_type: 'tv' | 'movie'): Observable<Resultado>{
    const url_busca = this.API_URL + media_type + "/popular?" + this.KEY + "&language=pt-BR&page=" + pagina;

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

  buscarEmAlta(media_type: 'tv' | 'movie'): Observable<Resultado>{
    const url_busca = this.API_URL + "trending/" + media_type + "/week?" + this.KEY + "";

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

  descobrir(pagina: number, media_type: 'tv' | 'movie', parametroBusca: ParametroBusca[]): Observable<Resultado>{
    let parametro = '&language=pt-BR&page=' + pagina;

    parametroBusca.forEach(param =>{
      parametro += '&' + param.parametro + "=" + param.valor;
    });

    const url_busca = this.API_URL + "discover/" + media_type + "?" + this.KEY + parametro;

    return this.http.get(url_busca)
                    .pipe(map((props:any) => new Resultado(props.total_pages, props.results)));
  }

  buscarGeneros(media_type: 'tv' | 'movie'): Observable<Genero[]>{
    const url_busca = this.API_URL + "genre/" + media_type + "/list?" + this.KEY + "&language=pt-BR";

    return this.http.get(url_busca)
                    .pipe(map((props: {genres: {id: number, name: string, nrRandom: number}[]}) =>{
                        let generos: Genero[];
                        generos = [];

                        props.genres.forEach((genero: Genero) =>{
                          genero.nrRandom = Math.floor(Math.random() * 2);
                          generos.push(genero);
                        })

                        return generos;
                    }));
  }

}

export class Resultado{
  Total_Paginas: number; 
  Producoes: Producao[];

  constructor(Total_Paginas: number, Producoes: Producao[]){
    this.Total_Paginas= Total_Paginas;
    this.Producoes = Producoes.filter(x => x.poster_path !=null);
  }

}