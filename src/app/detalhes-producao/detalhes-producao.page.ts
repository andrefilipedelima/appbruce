import { Component, OnInit } from '@angular/core';
import { Filme } from '../core/models/filme';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { Observable } from 'rxjs';
import { Genero } from '../core/models/genero';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Serie } from '../core/models/serie';
import { UtellyService } from '../core/providers/utelly.service';
import { Utelly_Item } from '../core/models/utelly_item';
import { Streamers } from '../core/models/streamers';
import { take, map } from 'rxjs/operators';
import { Cast } from '../core/models/cast';

@Component({
  selector: 'app-detalhes-producao',
  templateUrl: './detalhes-producao.page.html',
  styleUrls: ['./detalhes-producao.page.scss'],
})
export class DetalhesProducaoPage implements OnInit {
  loading: Promise<HTMLIonLoadingElement>;
  poster: string;
  generos: Genero[];
  anoLancamento: string;
  sinopse: string;
  tituloProducao: string;
  elenco: Cast[];

  streamers$: Observable<Streamers[]>;

  buscouProducao: boolean;
  buscouStreamings: boolean;

  constructor(private tmdbService: TmdbService, private overlayService: OverlayService, private route: ActivatedRoute, private navCtrl: NavController, private utellyService: UtellyService) { 
    this.loading = this.overlayService.loading();
    this.buscouProducao = false;
    this.buscouStreamings = false;
  }

  async ngOnInit(): Promise<void> {
    const id_producao = this.route.snapshot.paramMap.get('id');
    const tipo_pagina = this.route.snapshot.paramMap.get('tipo');

    if(!id_producao && !tipo_pagina){
      this.navCtrl.navigateRoot(['/welcome/filmes']);
    }

    this.carregaDados(Number.parseInt(id_producao), tipo_pagina);
  }

  async carregaDados(id_producao: number, tipo_pagina: string): Promise<void>{

    try{
      let midia: 'tv' | 'movie';
      midia = (tipo_pagina == 'tv' ? 'tv' : 'movie');

      this.elenco = await this.tmdbService.buscarAtores(id_producao, midia).toPromise();
      this.elenco = this.elenco.slice(0, 3);

      this.streamers$ = this.utellyService.buscarEmQualStremingPorId(id_producao, 'tmdb').pipe(map(uttely => uttely.locations));
      
      this.streamers$.pipe(take(1)).subscribe( locations => {
        this.buscouStreamings = true;
        this.escondeLoading();
      });

      if(tipo_pagina == 'tv'){
        this.tmdbService.buscarSeriePorId(id_producao).pipe(take(1)).subscribe(serie =>{
          this.poster = serie.poster_path;
          this.generos = serie.genres;
          this.anoLancamento = serie.first_air_date.substring(0 ,4);
          this.sinopse = serie.overview;
          this.tituloProducao = serie.name;

          this.buscouProducao = true;
          this.escondeLoading();
        });
      }
      else{
        this.tmdbService.buscarFilmePorId(id_producao).pipe(take(1)).subscribe(filme =>{
          this.poster = filme.poster_path;
          this.generos = filme.genres;
          this.anoLancamento = filme.release_date.substring(0 ,4);
          this.sinopse = filme.overview;
          this.tituloProducao = filme.title;

          this.buscouProducao = true;
          this.escondeLoading();
        });
      }
    }
    catch(error){
      this.overlayService.toast(error);
    }
  }

  async escondeLoading(): Promise<void>{
    if(this.buscouProducao && this.buscouStreamings){
      (await this.loading).dismiss();
    }
  }

}
