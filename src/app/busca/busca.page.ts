import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { BuscaType } from '../core/models/buscaType';
import { OverlayService } from '../services/OverlayService';
import { NavController, ModalController } from '@ionic/angular';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro.page';



@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {
  items: BuscaType[];


  public tituloPesquisa: any;
  public msgError: string;
  public goalList: any[];
  public loadedGoalList: any[];
  tipo_pagina: 'tv' | 'movie';
  loading: Promise<HTMLIonLoadingElement>;


  constructor(private tmdbService: TmdbService, private overlayService: OverlayService, private navCtrl: NavController, public modalCtrl: ModalController) {
    // this.loading = this.overlayService.loading();
  }


  ngOnInit() {
  }

  coletaTitulo(searchbar) {
    this.tituloPesquisa = searchbar.target.value;

    console.log(this.tituloPesquisa);
  }

  pesquisarPorTitulo() {
    if (this.tituloPesquisa) {
      this.msgError = "Esses foram os resultados encontrados para " + this.tituloPesquisa;

       // const teste = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise()).Producoes
       const teste = this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise();

       console.log('teste', teste);

       this.carregaDados();


    } else {
      this.msgError = "Não foi possivel encontrar sua busca. Tente novamente usando outros termos!";
    }
  }

  possuiImagem(value) {
    return value.poster_path !== null;
  }

  filtraTipoMidia(value) {
    return value.media_type === 'movie' || value.media_type === 'tv';
  }


  async carregaDados(): Promise<void>{
    this.items = [];

    const resultado = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise()).Producoes;

    var filtered = resultado.filter(this.possuiImagem);

    filtered = filtered.filter(this.filtraTipoMidia);

    try
    {


      this.items.push({
        producoes: filtered,
      });

      console.log(this.items);

  
    }
    catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }
    
  }

  // retornaSliderConfig(){
  //     let retorno: {};


  //       retorno = {
  //         spaceBetween: 10,
  //         centeredSlides: !(window.innerWidth>=960),
  //         slidesPerView: window.innerWidth>=960 ? 6.2 : 2.4,
  //         loop: true
  //       }

  //     return retorno;
  // }

  abreDetalhes(id: number, tipoPagina){
    this.navCtrl.navigateForward(['detalhes', tipoPagina, id]);
  }

  async logIn() {
    let profileModal = await this.modalCtrl.create({
      component: ModalFiltroPage,
    });

    return await profileModal.present();
  }

}
