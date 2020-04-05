import { Component, OnInit } from '@angular/core';
import { Filme } from '../core/models/filme';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { Observable } from 'rxjs';
import { Genero } from '../core/models/genero';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Serie } from '../core/models/serie';

@Component({
  selector: 'app-detalhes-producao',
  templateUrl: './detalhes-producao.page.html',
  styleUrls: ['./detalhes-producao.page.scss'],
})
export class DetalhesProducaoPage implements OnInit {
  filme: Filme;
  serie: Serie;
  loading: Promise<HTMLIonLoadingElement>;
  poster: string;
  generos: Genero[];
  anoLancamento: string;
  sinopse: string;
  tituloProducao: string;

  constructor(private tmdbService: TmdbService, private overlayService: OverlayService, private route: ActivatedRoute, private navCtrl: NavController) { 
    this.loading = this.overlayService.loading();
  }

  async ngOnInit() {
    const id_producao = this.route.snapshot.paramMap.get('id');
    const tipo_pagina = this.route.snapshot.paramMap.get('tipo');

    if(!id_producao && !tipo_pagina){
      this.navCtrl.navigateRoot(['/welcome/filmes']);
    }

    if(tipo_pagina == 'tv'){
      this.serie = await this.tmdbService.buscarSeriePorId(Number.parseInt(id_producao)).toPromise();

      this.poster = this.serie.poster_path;
      this.generos = this.serie.genres;
      this.anoLancamento = this.serie.first_air_date.substring(0 ,4);
      this.sinopse = this.serie.overview;
      this.tituloProducao = this.serie.name;

    }
    else{
      this.filme = await this.tmdbService.buscarFilmePorId(Number.parseInt(id_producao)).toPromise();

      this.poster = this.filme.poster_path;
      this.generos = this.filme.genres;
      this.anoLancamento = this.filme.release_date.substring(0 ,4);
      this.sinopse = this.filme.overview;
      this.tituloProducao = this.filme.title;
    }

  }

  async ionViewDidEnter(){
    (await this.loading).dismiss();
  }

}
