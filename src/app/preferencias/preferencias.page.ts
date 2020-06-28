import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';
import { PreferenciasService } from '../core/providers/preferencias.service';
import { take } from 'rxjs/operators';
import { Preferencias } from '../core/models/preferencias';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Genero } from '../core/models/genero';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {

  public generos;
  public tipo: string = 'movie';
  preferenciasService$: Observable<Preferencias[]>;

  constructor(private tmdbService: TmdbService, 
              private overlayService: OverlayService,
              private authService: AuthService,
              private preferenciasService: PreferenciasService
              ) { }

  ngOnInit() {
    this.montarPreferenciasGeneros(this.tipo);
  }

  onChangeTipo(e) {
    this.tipo = e.detail.value;

    if (this.tipo === 'movie') {
      this.montarPreferenciasGeneros(this.tipo)
    } 
    if (this.tipo === 'tv') {
      this.montarPreferenciasGeneros(this.tipo)
    } 
  }

  async montarPreferenciasGeneros(mediaType){
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

        this.generos = [];
        const resultado = await (await this.tmdbService.buscarGeneros(mediaType).toPromise());
        let selecionados: Genero[] = [];

        if(preferencias.length > 0 && 
            (
              (mediaType == 'tv' && preferencias[0].id_generos_tv.length > 0) || 
              (mediaType != 'tv' && preferencias[0].id_generos_movie.length > 0)
            )
          ){
          selecionados = mediaType == 'tv' ? preferencias[0].id_generos_tv : preferencias[0].id_generos_movie;
        }

        resultado.forEach(element => {
          element.isChecked = selecionados.map(elem => elem.id).indexOf(element.id) != -1;
        })
    
        this.generos = resultado.sort(elem => elem.isChecked ? -1 : 1);
        await loading.dismiss()
      });
    });
  }

  async generosChecked(item, event){
    // ******** PRECISA ARRUMAR ESSA FUNÇÃO ****************
    let lista: Genero[] = [];
    let persistir:Preferencias[];
    
    await this.preferenciasService$.toPromise()
                                  .then(preferencias =>{
                                    persistir = preferencias;
                                    lista = this.tipo === 'movie' ? preferencias[0].id_generos_movie : preferencias[0].id_generos_tv;
                                  });

    if(event.target.checked && lista.map(elem => elem.id).indexOf(item.id) == -1){
      lista.push(item);
    }
    else if(!event.target.checked && lista.map(elem => elem.id).indexOf(item.id) != -1){
      lista = lista.filter(elem => elem.id != item.id);
    }

    if (this.tipo === 'movie') {
      persistir[0].id_generos_movie = lista;
      this.preferenciasService.update(persistir[0]);
    }

    if (this.tipo === 'tv') {
      persistir[0].id_generos_tv = lista;
      this.preferenciasService.update(persistir[0]);
    }

    this.generos = this.generos.sort(elem => elem.isChecked ? -1 : 1);
  }

}
