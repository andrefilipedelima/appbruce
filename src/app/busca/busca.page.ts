import { Component, OnInit, Input } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { BuscaType } from '../core/models/buscaType';
import { OverlayService } from '../services/OverlayService';
import { NavController, ModalController } from '@ionic/angular';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro.page';
import { ParametroBusca } from '../core/models/parametroBusca';

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
  public realizaBuscaFiltro;


  constructor(
    private tmdbService: TmdbService,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private  modalCtrl: ModalController) {
    // this.loading = this.overlayService.loading();
  }

  ngOnInit() {}

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

  incluiTipoMidia(value) {
    if (!value.media_type) {
      if (value.release_date) {
        return value.media_type = 'movie';
      }
      if (value.first_air_date) {
        return value.media_type = 'tv';
      }
    }
    return value.media_type;
  }

  async carregaDados(): Promise<void>{
    this.items = [];
    let resultado;

    const quantidadePaginas = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise()).Total_Paginas;
    console.log('quantidade de paginas da busca', quantidadePaginas );


    let itensAux = [];

    for(let i = 1; i <= quantidadePaginas; i++ ) {
      let concatAux = [];

      console.log('pagina', i);

      resultado = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, i).toPromise()).Producoes;


      var filtered = resultado.filter(this.filtraTipoMidia);

      concatAux = itensAux.concat(filtered);


      console.log('itens depois da pagina', i);
      console.log('itens', concatAux);

      itensAux = concatAux;

    }

    try {
      this.items.push({
        producoes: itensAux,
      });

      console.log(this.items);

  
    } catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }
    
  }

  abreDetalhes(id: number, tipoPagina){
    this.navCtrl.navigateForward(['detalhes', tipoPagina, id]);
  }

  async filtrar() {
    let profileModal = await this.modalCtrl.create({
      component: ModalFiltroPage,
    });

    profileModal.onDidDismiss()
      .then((data) => {
        const filtro = data['data'];
        if (filtro.ano !== undefined || 
            filtro.genero !== undefined ||
            filtro.ator !== undefined ||
            filtro.idioma !== undefined ||
            filtro.produtora !== undefined 
        ) {

            console.log('tem pesquisa para filtrar: ', filtro);
            this.realizaBuscaFiltro = filtro;

            this.realizaPesquisaComFiltro();

        } else {
          console.log('Nada para pesquisar!');
          this.msgError = null;
        }
      })

    return await profileModal.present();
  }

  async realizaPesquisaComFiltro(): Promise<void>{
    let busca: ParametroBusca[] = [];
    this.items = [];

    if ( this.realizaBuscaFiltro.genero !== undefined ) {
      busca.push({
        parametro: "with_genres",
        valor: this.realizaBuscaFiltro.genero.id,
      }
      )
    }

    if (this.realizaBuscaFiltro.produtora !== undefined) {
      let produtora = []
      produtora = await this.buscaIDprodutora();

      busca.push({
        parametro: "with_companies",
        valor: this.realizaBuscaFiltro.produtora,
      }
      )
    }


    if (this.realizaBuscaFiltro.idioma !== undefined) {
      busca.push(
       {
          parametro: "with_original_language",
          valor: this.realizaBuscaFiltro.idioma.id,
        }
      )
    }

    if (this.realizaBuscaFiltro.tipoStreaming === 'filme') {
      if (this.realizaBuscaFiltro.ano !== undefined) {
        busca.push({
          parametro: "primary_release_year",
          valor: this.realizaBuscaFiltro.ano,
        }
        )
      }
      if (this.realizaBuscaFiltro.ator !== undefined) {
        busca.push({
          parametro: "with_people",
          valor: this.realizaBuscaFiltro.ator,
        })
      }
    }

    if (this.realizaBuscaFiltro.tipoStreaming === 'serie') {
      if (this.realizaBuscaFiltro.ano !== undefined) {
        busca.push({
          parametro: "first_air_date_year",
          valor: this.realizaBuscaFiltro.ano,
        })
      }
    }

    if (this.realizaBuscaFiltro.tipoStreaming === 'filme') {
      this.tipo_pagina = 'movie';
    } else if (this.realizaBuscaFiltro.tipoStreaming === 'serie') {
      this.tipo_pagina = 'tv';
    }

    console.log('valores de buscas', busca);

    let resultado;

    const quantidadePaginas = await (await this.tmdbService.descobrir(1, this.tipo_pagina, busca).toPromise()).Total_Paginas;
    console.log('quantidade de paginas da busca', quantidadePaginas );

    let itensAux = [];

    for(let i = 1; i <= quantidadePaginas; i++ ) {
      let concatAux = [];

      console.log('pagina', i);

      resultado = await (await this.tmdbService.descobrir(i, this.tipo_pagina, busca).toPromise()).Producoes;


      var filtered = resultado.filter(this.incluiTipoMidia);

      concatAux = itensAux.concat(filtered);


      console.log('itens depois da pagina', i);
      console.log('itens', concatAux);

      itensAux = concatAux;

    }

    try {
      this.items.push({
        producoes: itensAux,
      });

      console.log('sao os filtros da pesquisa', this.items);

  
    } catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }

  }


  async buscaIDprodutora() {

    // verificar numero da pagina 
    const resultado = await (await this.tmdbService.buscarPorCompania(this.realizaBuscaFiltro.produtora, 1).toPromise());

    let produtoraID = [];

    resultado.forEach(item => {
      produtoraID.push(
        item.id
      )
    }
    )

    return produtoraID;

  }

}
