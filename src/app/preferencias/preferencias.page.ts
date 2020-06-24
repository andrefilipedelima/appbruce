import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { OverlayService } from '../services/OverlayService';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
})
export class PreferenciasPage implements OnInit {

  public generos;
  public generosSelecionadosSerie = [];
  public generosSelecionadosFilme = [];
  public tipo: string = 'movie';

  constructor(private tmdbService: TmdbService, private overlayService: OverlayService) { }

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
    this.generos = [];
    const resultado = await (await this.tmdbService.buscarGeneros(mediaType).toPromise());

    resultado.forEach(element => {
      element.isChecked = false;
    })

    this.generos = resultado;
    await loading.dismiss()
  }

  generosChecked(item){
    // ******** PRECISA ARRUMAR ESSA FUNÇÃO ****************

    if (this.tipo === 'movie') {
      this.generosSelecionadosFilme.push({
        item
      })
      console.log('filmes selecionados', this.generosSelecionadosFilme);
    }

    if (this.tipo === 'tv') {
      this.generosSelecionadosSerie.push({
        item
      })
      console.log('series selecionados', this.generosSelecionadosSerie);
    }
  }

}
