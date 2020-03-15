import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeComponentRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { TmdbService } from '../core/providers/tmdb.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeComponentRoutingModule,


  ],
  declarations: [WelcomeComponent]
})
export class WelcomeComponentModule {

  constructor(private tmdbService: TmdbService){
    tmdbService.buscarPorTexto('missão', 1).subscribe(result =>{
      console.log(result.Total_Paginas);
      result.Producoes.forEach(element => {
        console.log(element, ':PorTexto: ', element.media_type);
      });
    });

    tmdbService.buscarFilmesPopulares(1).subscribe(result =>{
      console.log(result.Total_Paginas);
      result.Producoes.forEach(element => {
        console.log(element, ':FilmesPopulares: ', element.media_type);
      });
    });

    tmdbService.buscarSeriesPopulares(1).subscribe(result =>{
      console.log(result.Total_Paginas);
      result.Producoes.forEach(element => {
        console.log(element, ':SeriesPopulares: ', element.title);
      });
    });
  }

}
