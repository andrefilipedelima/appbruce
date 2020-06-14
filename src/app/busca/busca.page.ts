import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { BuscaType } from '../core/models/buscaType';
import { OverlayService } from '../services/OverlayService';
import { NavController, ModalController } from '@ionic/angular';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro.page';
import { ParametroBusca } from '../core/models/parametroBusca';
import { HistoricoBuscaService } from '../core/providers/historico-busca.service';
import { AuthService } from '../auth/auth.service';
import { HistoricoBusca } from '../core/models/historicoBusca';
import { DatePipe } from '@angular/common';
import { ParametroBuscaLog } from '../core/models/parametroBuscaLog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {

  items: BuscaType[] = [];

  public tituloPesquisa: any;
  public msgError: string;
  public goalList: any[];
  public loadedGoalList: any[];
  tipo_pagina: 'tv' | 'movie';
  loading: Promise<HTMLIonLoadingElement>;
  public realizaBuscaFiltro;

  // recebe o titulo da searchbar
  public pesquisa: string;

  // tipo de pesquisa
  public porTitulo: boolean = false;
  public porFiltro: boolean = false;

  // variavel auxiliar para informar se tem retorno de pesquisa ou nao
  public pesquisaEncontrada: boolean = false;

  // botoes de filtro
  public btFiltroGenero = null;
  public btFiltroAno = null;
  public btFiltroAtor = null;
  public btFiltroProdutora = null;
  public btFiltroIdioma = null;

  constructor(
    private tmdbService: TmdbService,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private historicoBuscaService: HistoricoBuscaService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
    ) {
    // this.loading = this.overlayService.loading();
  }

  ngOnInit() {
    let historicoJson = this.activatedRoute.snapshot.paramMap.get("historicoBusca");
    
    if (historicoJson !== undefined && historicoJson !== null) {
      let historico: HistoricoBusca = JSON.parse(historicoJson);
      
      if (historico.porTitulo) {
        this.tituloPesquisa = historico.tituloBuscado;
        this.carregaDados(false);
      } else {
        let paramBusca: ParametroBusca[] = [];

        historico.detalhada.parametrosBusca.forEach(param =>{
          paramBusca.push({
            parametro: param.parametro,
            valor: param.valor
          });
        })

        this.realizaPesquisaComFiltro(false, paramBusca, historico.detalhada.midia);
      }
    }
  }

  coletaTitulo(searchbar) {
    if (this.msgError !== null || this.pesquisaEncontrada) {
      // para limpar a tela ao modificar barra de pesquisa
      this.msgError = null;
      this.pesquisaEncontrada = false;
      this.porFiltro = false;
      this.items = []
    }
    this.tituloPesquisa = searchbar.target.value;
  }

  limpaPesquisa(e) {
    this.items = [];
    this.msgError = null;
    this.pesquisaEncontrada = false;
    this.porFiltro = false;
    this.porTitulo = false;
    (<HTMLInputElement>document.getElementById('barraPesquisa')).value = '';    
  }

  clickEnter(e) {
    // e.target é o input da searchbar
    // vai tirar o foco da searchbar quando clicar na tecla enter
    e.target.blur();

    this.pesquisarPorTitulo();
  }

  pesquisarPorTitulo() {
    this.msgError = null;
    this.porTitulo = true;
    this.porFiltro = false;

    if (this.tituloPesquisa) {
      this.pesquisa = this.tituloPesquisa;
      this.carregaDados(true);
    } else {
      this.msgError = "Não foi possivel encontrar sua busca. Tente novamente usando outros termos!";
      this.items = [];
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

  async carregaDados(gravaHistorico: boolean): Promise<void>{
    let loading = this.overlayService.loading();
    this.items = [];
    let resultado;

    const quantidadePaginas = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise()).Total_Paginas;

    if (quantidadePaginas <= 0) {
      this.msgError = 'Não encontramos resultados para sua pesquisa. Tente novamente usando outros termos!';
      this.pesquisaEncontrada = false;
      this.porTitulo = false;
    } 
     
    if(gravaHistorico && quantidadePaginas > 0 && this.authService.isAuth()){
      let buscaHistorico: HistoricoBusca;
      buscaHistorico = {
        id: undefined,
        dataBusca: new Date(),
        porTitulo: true,
        tituloBuscado: this.tituloPesquisa
      }

      this.historicoBuscaService.create(buscaHistorico);
    }  

    let itensAux = [];

    for(let i = 1; i <= quantidadePaginas; i++ ) {
      let concatAux = [];

      resultado = await (await this.tmdbService.buscarPorTexto(this.tituloPesquisa, i).toPromise()).Producoes;

      this.pesquisaEncontrada = true;

      var filtered = resultado.filter(this.filtraTipoMidia);

      concatAux = itensAux.concat(filtered);

      itensAux = concatAux;

    }

    try {
      this.items.push({
        producoes: itensAux,
      });
  
    } catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }
    finally
    {
      (await loading).dismiss();
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
        if (filtro !== undefined) {
          if (filtro.ano !== undefined || 
              filtro.genero !== undefined ||
              filtro.ator !== undefined ||
              filtro.idioma !== undefined ||
              filtro.produtora !== undefined 
          ) {
              console.log('tem pesquisa para filtrar: ', filtro);
              this.realizaBuscaFiltro = filtro;
  
              this.realizaPesquisaComFiltro(true);
  
          } 
        } else {
          console.log('Nada para pesquisar!');
          this.msgError = null;
        }
      })

    return await profileModal.present();
  }


  botaoFiltro(filtroRetirado){

    if (filtroRetirado === 'genero') {
      this.realizaBuscaFiltro.genero = undefined;
      this.btFiltroGenero = false;
    }
    if (filtroRetirado === 'ano') {
      this.realizaBuscaFiltro.ano = undefined;
      this.btFiltroAno = false;
    }
    if (filtroRetirado === 'idioma') {
      this.realizaBuscaFiltro.idioma = undefined;
      this.btFiltroIdioma = false;
    }
    if (filtroRetirado === 'produtora') {
      this.realizaBuscaFiltro.produtora = undefined;
      this.btFiltroProdutora = false;
    }
    if (filtroRetirado === 'ator') {
      this.realizaBuscaFiltro.ator = undefined;
      this.btFiltroAtor = false;
    }
    if (this.realizaBuscaFiltro.ator === undefined &&
      this.realizaBuscaFiltro.produtora === undefined &&
      this.realizaBuscaFiltro.idioma === undefined &&
      this.realizaBuscaFiltro.ano === undefined &&
      this.realizaBuscaFiltro.genero === undefined
    ) {
      this.msgError = 'Para realizar buscas você deve selecionar pelo menos um filtro ou digitar um titulo no campo acima!';
      this.porFiltro = false;
      this.pesquisaEncontrada = false;
      this.items = [];
    } else {
      this.realizaPesquisaComFiltro(false);
    }
  }


  async realizaPesquisaComFiltro(gravaHistorico: boolean, parametrosBusca?:ParametroBusca[], parametromidia?: 'tv' | 'movie'): Promise<void>{
    // limpar tela caso ja tenha pesquisa
    this.msgError = null;
    this.pesquisaEncontrada = false;
    this.porTitulo = false;
    (<HTMLInputElement>document.getElementById('barraPesquisa')).value = '';    

    this.porFiltro = true;
    let loading = this.overlayService.loading();
    let busca: ParametroBusca[] = [];
    let buscaLog: ParametroBuscaLog[] = [];
    this.items = [];

    if(parametrosBusca != undefined && parametrosBusca != null){
      this.tipo_pagina = parametromidia;
      busca = parametrosBusca;
    }
    else{
      if ( this.realizaBuscaFiltro.genero !== undefined ) {
        busca.push({
          parametro: "with_genres",
          valor: this.realizaBuscaFiltro.genero.id,
        })
        buscaLog.push({
          parametro: "with_genres",
          valor: this.realizaBuscaFiltro.genero.id,
          parametroMostrar : "Gênero",
          valorMostrar: this.realizaBuscaFiltro.genero.name
        })
        this.btFiltroGenero = this.realizaBuscaFiltro.genero.name;
      }
      if (this.realizaBuscaFiltro.produtora !== undefined) {
        busca.push({
          parametro: "with_companies",
          valor: this.realizaBuscaFiltro.produtora.id,
        })
        buscaLog.push({
          parametro: "with_companies",
          valor: this.realizaBuscaFiltro.produtora.id,
          parametroMostrar : "Produtora",
          valorMostrar: this.realizaBuscaFiltro.produtora.name
        })
        this.btFiltroProdutora = this.realizaBuscaFiltro.produtora.name;
      }
      if (this.realizaBuscaFiltro.idioma !== undefined) {
        busca.push({
            parametro: "with_original_language",
            valor: this.realizaBuscaFiltro.idioma.id,
          })
        buscaLog.push({
          parametro: "with_original_language",
          valor: this.realizaBuscaFiltro.idioma.id,
          parametroMostrar : "Idioma Original",
          valorMostrar: this.realizaBuscaFiltro.idioma.name
        })
        this.btFiltroIdioma = this.realizaBuscaFiltro.idioma.name;
      }
      if (this.realizaBuscaFiltro.tipoStreaming === 'filme') {
        if (this.realizaBuscaFiltro.ano !== undefined) {
          busca.push({
            parametro: "primary_release_year",
            valor: this.realizaBuscaFiltro.ano,
          }) 
          buscaLog.push({
            parametro: "primary_release_year",
            valor: this.realizaBuscaFiltro.ano,
            parametroMostrar : "Ano de Lançamento",
            valorMostrar: this.realizaBuscaFiltro.ano
          })
          this.btFiltroAno = this.realizaBuscaFiltro.ano;
        }
        if (this.realizaBuscaFiltro.ator !== undefined) {
          busca.push({
            parametro: "with_people",
            valor: this.realizaBuscaFiltro.ator.id,
          })
          buscaLog.push({
            parametro: "with_people",
            valor: this.realizaBuscaFiltro.ator.id,
            parametroMostrar : "Ator",
            valorMostrar: this.realizaBuscaFiltro.ator.name
          })
          this.btFiltroAtor = this.realizaBuscaFiltro.ator.name;
        }
      }
      if (this.realizaBuscaFiltro.tipoStreaming === 'serie') {
        if (this.realizaBuscaFiltro.ano !== undefined) {
          busca.push({
            parametro: "first_air_date_year",
            valor: this.realizaBuscaFiltro.ano,
          })
          buscaLog.push({
            parametro: "first_air_date_year",
            valor: this.realizaBuscaFiltro.ano,
            parametroMostrar : "Ano de Lançamento",
            valorMostrar: this.realizaBuscaFiltro.ano
          })
          this.btFiltroAno = this.realizaBuscaFiltro.ano;
        }
      }
    }

    if (this.realizaBuscaFiltro.tipoStreaming === 'filme') {
      this.tipo_pagina = 'movie';
    } else if (this.realizaBuscaFiltro.tipoStreaming === 'serie') {
      this.tipo_pagina = 'tv';
    }
    
    let resultado;

    const quantidadePaginas = await (await this.tmdbService.descobrir(1, this.tipo_pagina, busca).toPromise()).Total_Paginas;
    
    if (quantidadePaginas <= 0) {
      this.msgError = 'Não encontramos resultados para sua pesquisa. Tente novamente usando outra combinação de filtros!';
      this.pesquisaEncontrada = false;
    }
    
    let itensAux = [];

    if(gravaHistorico && quantidadePaginas > 0 && this.authService.isAuth()){
      let buscaHistorico: HistoricoBusca;
      buscaHistorico = {
        id: undefined,
        dataBusca: new Date(),
        porTitulo: false,
        detalhada: {
          midia: this.tipo_pagina,
          midiaMostrar: this.tipo_pagina == 'tv' ? "Série" : "Filme",
          parametrosBusca: buscaLog
        }
      }

      console.log(buscaHistorico)
      this.historicoBuscaService.create(buscaHistorico);
    }

    for(let i = 1; i <= quantidadePaginas; i++ ) {
      let concatAux = [];

      resultado = await (await this.tmdbService.descobrir(i, this.tipo_pagina, busca).toPromise()).Producoes;

      this.pesquisaEncontrada = true;

      var filtered = resultado.filter(this.incluiTipoMidia);

      concatAux = itensAux.concat(filtered);

      itensAux = concatAux;

    }

    try {
      this.items.push({
        producoes: itensAux,
      });
  
    } catch(ex){
      console.log(ex);
      this.overlayService.toast({ message: ex});
    }
    finally{
      (await loading).dismiss();
    }

  }
}

