import { Component, OnInit, ViewChild } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { PreferenciasService } from '../core/providers/preferencias.service';
import { take } from 'rxjs/operators';
import { Preferencias } from '../core/models/preferencias';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Genero } from '../core/models/genero';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  public generosFilme;
  public generosSerie;
  public segment:number = 0;
  
  preferenciasService$: Observable<Preferencias[]>;

  constructor(private tmdbService: TmdbService, 
              private overlayService: OverlayService,
              private authService: AuthService,
              private preferenciasService: PreferenciasService
              ) { }

  ngOnInit() {
    this.montarPreferenciasGeneros();
  }

  async montarPreferenciasGeneros(){
    const loading = await this.overlayService.loading();

    this.authService.authState$.pipe(take(1)).subscribe(user =>{
      this.preferenciasService$ = this.preferenciasService.getAll().pipe(take(1));
      this.preferenciasService$.subscribe(async preferencias => {
        if(preferencias == undefined || preferencias == null || preferencias.length == 0){
          preferencias = [];
          const generoFake: Genero[] = [];
          preferencias[0] ={
            id: undefined,
            id_generos_movie: generoFake,
            id_generos_tv: generoFake
          };

          this.preferenciasService.create(preferencias[0]);
        }

        this.generosFilme = [];
        this.generosSerie = [];
        const resultadoFilme = await (await this.tmdbService.buscarGeneros('movie').toPromise());
        const resultadoSerie = await (await this.tmdbService.buscarGeneros('tv').toPromise());

        let selecionadosFilmes: Genero[] = [];
        let selecionadosSeries: Genero[] = [];

        if(preferencias.length > 0 && 
            (
              (preferencias[0].id_generos_tv.length > 0) || 
              (preferencias[0].id_generos_movie.length > 0)
            )
          ){
          selecionadosFilmes = preferencias[0].id_generos_movie;
          selecionadosSeries = preferencias[0].id_generos_tv;

        }

        resultadoFilme.forEach(element => {
          element.isChecked = selecionadosFilmes.map(elem => elem.id).indexOf(element.id) != -1;
        })
        resultadoSerie.forEach(element => {
          element.isChecked = selecionadosSeries.map(elem => elem.id).indexOf(element.id) != -1;
        })
    
        this.generosFilme = resultadoFilme.sort(elem => elem.isChecked ? -1 : 1);
        this.generosSerie = resultadoSerie.sort(elem => elem.isChecked ? -1 : 1);
        await loading.dismiss()
      });
    });
  }

  async generosChecked(item, event, tipo){
    let lista: Genero[] = [];
    let persistir:Preferencias[];
    
    await this.preferenciasService$.toPromise()
                                  .then(preferencias =>{
                                    persistir = preferencias;
                                    lista = tipo === 'movie' ? preferencias[0].id_generos_movie : preferencias[0].id_generos_tv;
                                  });

    if(event.target.checked && lista.map(elem => elem.id).indexOf(item.id) == -1){
      lista.push(item);
    }
    else if(!event.target.checked && lista.map(elem => elem.id).indexOf(item.id) != -1){
      lista = lista.filter(elem => elem.id != item.id);
    }

    if (tipo === 'movie') {
      persistir[0].id_generos_movie = lista;
      this.preferenciasService.update(persistir[0]);
    }

    if (tipo === 'tv') {
      persistir[0].id_generos_tv = lista;
      this.preferenciasService.update(persistir[0]);
    }

    this.generosFilme = this.generosFilme.sort(elem => elem.isChecked ? -1 : 1);
    this.generosSerie = this.generosSerie.sort(elem => elem.isChecked ? -1 : 1);
  }

  slideChanged() {
    this.slides.getActiveIndex().then((index: number) => {
      this.segment = index;
    });
  }

}
