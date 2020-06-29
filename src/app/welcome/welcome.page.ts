import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { WelcomeType } from '../core/models/welcomeType';
import { ParametroBusca } from '../core/models/parametroBusca';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonSlides, AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { PreferenciasService } from '../core/providers/preferencias.service';
import { take } from 'rxjs/operators';
import { Preferencias } from '../core/models/preferencias';
import { Genero } from '../core/models/genero';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  items: WelcomeType[];
  tipo_pagina: 'tv' | 'movie';
  titulo_pagina: string;
  loading: Promise<HTMLIonLoadingElement>;
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  constructor(private tmdbService: TmdbService, 
              private overlayService: OverlayService,
              private route: ActivatedRoute, 
              private navCtrl: NavController,
              private authService: AuthService,
              private preferenciasService: PreferenciasService) { 
    this.loading = this.overlayService.loading();
  }

  async ngOnInit(): Promise<void> {
    const param_tipo_pagina = this.route.snapshot.paramMap.get('id');
    let preferenciasGenero: Genero[] = [];

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

    this.authService.authState$.pipe(take(1)).subscribe(async user =>{

      console.log(user)
      if(user !== null){
        const preferencias$ = this.preferenciasService.getAll();

        preferencias$.subscribe(async pref => {
          if(pref !== undefined && pref !== null && pref.length !== 0){
            preferenciasGenero = this.tipo_pagina === 'tv' ? pref[0].id_generos_tv : pref[0].id_generos_movie;
          }
          
          console.log(pref);
          console.log(preferenciasGenero);
          await this.carregaDados(preferenciasGenero);
        })

      }
      else{
        await this.carregaDados(preferenciasGenero);
      }

    });


  }

  async ionViewDidEnter(){
    
  }

  async carregaDados(preferenciasGenero: Genero[]): Promise<void>{
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
      let generos: Genero[] = [];
      
      if(preferenciasGenero.length > 0){
        preferenciasGenero.sort((a, b) => a.nrRandom > b.nrRandom ? 1 : -1)
                          .slice(0, 5)
                          .forEach(pGenero =>{
                            generos.push(pGenero);
                          });
                          

        if(generos.length < 5){
          const qtde = 5 - generos.length;

          (await this.tmdbService.buscarGeneros(this.tipo_pagina).toPromise()).sort((a, b) => a.nrRandom > b.nrRandom ? 1 : -1)
                                                                              .slice(0, qtde)
                                                                              .forEach(genero =>{
                                                                                generos.push(genero);
                                                                              });
        }
        
      }
      else{
        generos = (await this.tmdbService.buscarGeneros(this.tipo_pagina).toPromise()).sort((a, b) => a.nrRandom > b.nrRandom ? 1 : -1).slice(0, 5);
      }

      generos.forEach(async genero =>{
        let param: ParametroBusca[];
        param = [];

        param.push({parametro: 'with_genres', valor: genero.id.toString()});

        this.items.push({
          tipo: "genero",
          titulo: genero.name,
          producoes: await (await this.tmdbService.descobrir(1, this.tipo_pagina, param).toPromise()).Producoes.filter(producao => producao.poster_path != null)
        });
      });
      (await this.loading).dismiss();
    }
    catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
      (await this.loading).dismiss();
    }
    
  }

  retornaSliderConfig(tipo: 'emAlta' | 'popular' | 'genero'){
      let retorno: {};

      if(tipo == 'emAlta'){
        retorno = {
          spaceBetween: 10,
          centeredSlides: !(window.innerWidth>=960),
          slidesPerView: window.innerWidth>=500 ? 3.2 : 1.2,
          loop: true,
          initialSlide: 0,
          speed: 400
        }
      }
      else{
        retorno = {
          spaceBetween: 10,
          centeredSlides: !(window.innerWidth>=960),
          slidesPerView: window.innerWidth>=500 ? 6.2 : 2.4,
          loop: true,
          initialSlide: 0,
          speed: 400
        }
      }

      return retorno;
  }

  abreDetalhes(id: string){
    this.navCtrl.navigateForward(['detalhes',this.tipo_pagina, id]);
  }

  slideNext(indice: number): void{
    this.slides.toArray()[indice].slideNext();
  }

  slidePrev(indice: number): void{
    this.slides.toArray()[indice].slidePrev();
  }
}
