import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { WelcomeType } from '../core/models/welcomeType';
import { ParametroBusca } from '../core/models/parametroBusca';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome2',
  templateUrl: './welcome2.page.html',
  styleUrls: ['./welcome2.page.scss'],
})
export class Welcome2Page implements OnInit {
  items: WelcomeType[];
  tipo_pagina: 'tv' | 'movie';
  titulo_pagina: string;
  loading: Promise<HTMLIonLoadingElement>;
  
  constructor(private tmdbService: TmdbService, private overlayService: OverlayService, private route: ActivatedRoute, private navCtrl: NavController) { 
    this.loading = this.overlayService.loading();
  }

  async ngOnInit(): Promise<void> {
    const param_tipo_pagina = this.route.snapshot.paramMap.get('id');

    if(!param_tipo_pagina){
      this.tipo_pagina = 'movie';
    }
    else{
      if(param_tipo_pagina == 'filmes'){
        this.tipo_pagina = 'movie';
      }
      else{
        this.tipo_pagina = 'tv';
      }
    }

    this.titulo_pagina = this.tipo_pagina == 'tv'? 'Séries' : 'Filmes';

    await this.carregaDados();
  }

  async ionViewDidEnter(){
    (await this.loading).dismiss();
  }

  async carregaDados(): Promise<void>{
    this.items = [];

    try
    {
      
      this.items.push({
        tipo: "emAlta",
        titulo: "Em Alta",
        producoes: await (await this.tmdbService.buscarEmAlta(this.tipo_pagina).toPromise()).Producoes
      });

      this.items.push({
        tipo: "popular",
        titulo: "Populares",
        producoes: await (await this.tmdbService.buscarPopulares(1, this.tipo_pagina).toPromise()).Producoes
      });

      const generos = (await this.tmdbService.buscarGeneros(this.tipo_pagina).toPromise()).sort((a, b) => a.nrRandom > b.nrRandom ? 1 : -1).slice(0, 5);

      generos.forEach(async genero =>{
        let param: ParametroBusca[];
        param = [];

        param.push({parametro: 'with_genres', valor: genero.id.toString()});

        this.items.push({
          tipo: "genero",
          titulo: genero.name,
          producoes: await (await this.tmdbService.descobrir(1, this.tipo_pagina, param).toPromise()).Producoes
        });
      });
  
    }
    catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }
    
  }

  retornaSliderConfig(tipo: 'emAlta' | 'popular' | 'genero'){
      let retorno: {};

      if(tipo == 'emAlta'){
        retorno = {
          spaceBetween: 10,
          centeredSlides: !(window.innerWidth>=960),
          slidesPerView: window.innerWidth>=960 ? 6 : 1.6,
          loop: true
        }
      }
      else{
        retorno = {
          spaceBetween: 10,
          centeredSlides: false,
          slidesPerView: window.innerWidth>=960 ? 6 : 2.6,
          loop: true
        }
      }

      return retorno;
  }

  abreDetalhes(id: string){
    this.navCtrl.navigateForward(['detalhes',this.tipo_pagina, id]);
  }
}
