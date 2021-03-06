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
  avaliacao: any;
  semAvaliação: string = 'Sem avaliação';
  generoIndefinido: Genero[] = [{ id: 0, name: 'Gênero Indefinido', nrRandom: 0}]
  elenco: Cast[];

  streamers$: Observable<Streamers[]>;
  streamers: Streamers[];

  buscouProducao: boolean;
  buscouStreamings: boolean;

  constructor(private tmdbService: TmdbService, private overlayService: OverlayService, private route: ActivatedRoute, private navCtrl: NavController, private utellyService: UtellyService) { 
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
      this.loading = this.overlayService.loading();
    
      let midia: 'tv' | 'movie';
      midia = (tipo_pagina == 'tv' ? 'tv' : 'movie');

      this.elenco = await this.tmdbService.buscarAtores(id_producao, midia).toPromise();
      this.elenco = this.elenco.slice(0, 3);

      this.streamers = await (await this.utellyService.buscarEmQualStreamingPorId(id_producao, 'tmdb').toPromise()).locations.filter(location => location.country.indexOf('br') > -1);
      this.buscouStreamings = true;

      /*
      this.streamers$.pipe(take(1)).subscribe( locations => {
        this.buscouStreamings = true;
        this.escondeLoading();
      });
      */

      if(tipo_pagina == 'tv'){
        this.tmdbService.buscarSeriePorId(id_producao).pipe(take(1)).subscribe(serie =>{
          this.poster = serie.poster_path;

          if (serie.vote_average !== 0) {
            this.avaliacao = serie.vote_average;
          } else {
            this.avaliacao = this.semAvaliação;
          }

          if (serie.genres.length > 0){
            this.generos = serie.genres;
          } else {
            this.generos = this.generoIndefinido;
          }

          if (serie.first_air_date !== null) {
            this.anoLancamento = serie.first_air_date.substring(0 ,4);
          } else {
            this.anoLancamento = 'Não informado.'
          }

          if (serie.overview !== '') {
            this.sinopse = serie.overview;
          } else {
            this.sinopse = 'Sinopse indisponível no momento.';
          }

          this.tituloProducao = serie.name;

          this.buscouProducao = true;
          this.escondeLoading();
        });
      }
      else{
        this.tmdbService.buscarFilmePorId(id_producao).pipe(take(1)).subscribe(filme =>{
          this.poster = filme.poster_path;

          if (filme.vote_average !== 0) {
            this.avaliacao = filme.vote_average;
          } else {
            this.avaliacao = this.semAvaliação;
          }

          if (filme.genres.length > 0){
            this.generos = filme.genres;
          } else {
            this.generos = this.generoIndefinido;
          }

          if (filme.release_date !== null) {
            this.anoLancamento = filme.release_date.substring(0 ,4);
          } else {
            this.anoLancamento = 'Não informado.'
          }
          
          if (filme.overview !== '') {
            this.sinopse = filme.overview;
          } else {
            this.sinopse = 'Sinopse indisponível no momento.';
          }
          
          this.tituloProducao = filme.title;

          this.buscouProducao = true;
          this.escondeLoading();
        });
      }
    }
    catch(error){
      //this.overlayService.toast(error);
      (await this.loading).dismiss();
    }
  }

  async escondeLoading(): Promise<void>{
    if(this.buscouProducao && this.buscouStreamings){
      (await this.loading).dismiss();
    }
  }

}
