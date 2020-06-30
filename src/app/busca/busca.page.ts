import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TmdbService } from '../core/providers/tmdb.service';
import { BuscaType } from '../core/models/buscaType';
import { OverlayService } from '../services/OverlayService';
import { NavController, ModalController, IonContent } from '@ionic/angular';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro.page';
import { ParametroBusca } from '../core/models/parametroBusca';
import { HistoricoBuscaService } from '../core/providers/historico-busca.service';
import { AuthService } from '../auth/auth.service';
import { HistoricoBusca } from '../core/models/historicoBusca';
import { ParametroBuscaLog } from '../core/models/parametroBuscaLog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})

export class BuscaPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: BuscaType[] = [];

  //-----------Auxiliares para busca por scrolll-------------

  private informacoesBusca: {
    porTitulo: boolean,
    paginaCorrente: number,
    totalPaginas: number,
    tituloBuscado?: string,
    buscaAvancada?:{
      tipoMedia: 'tv' | 'movie',
      parametroBusca: ParametroBusca[]
    }
  }

  //---------------------------------------------------------

  private usuarioLogado: boolean;
  public tituloPesquisa: any;
  public msgError: string = null;
  tipo_pagina: 'tv' | 'movie';
  loading: Promise<HTMLIonLoadingElement>;
  public realizaBuscaFiltro: any;

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

  // variavel para habilitar botao que volta ao topo
  public habilitaBTfab: boolean = false;

  constructor(
    private tmdbService: TmdbService,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private historicoBuscaService: HistoricoBuscaService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
    ) {
  }

  async ngOnInit() {
    await this.authService.isAuth()
                          .pipe(take(1))
                          .subscribe(logado => {
                            this.usuarioLogado = logado;
                          });


    let historicoJson = this.activatedRoute.snapshot.paramMap.get("historicoBusca");

    if (historicoJson !== undefined && historicoJson !== null) {
      let historico: HistoricoBusca = JSON.parse(historicoJson);
      
      if (historico.porTitulo) {
        this.tituloPesquisa = historico.tituloBuscado;
        this.pesquisa = this.tituloPesquisa;
        this.porTitulo = true;
        this.porFiltro = false;
        this.carregaDados(false);
      } else {
        this.montarFiltrosComHistorico(historico);
        this.realizaPesquisaComFiltro(false);
      }
    }
  }

  montarFiltrosComHistorico(historico) {
    let filtro = {
      tipoStreaming: undefined,
      genero: {
        id: undefined,
        name: undefined,
      },
      idioma: {
        id: undefined,
        name: undefined,
      },
      ano: undefined,
      produtora: {
        id: undefined,
        name: undefined,
      },
      ator: {
        id: undefined,
        name: undefined,
      },
    };

    if (historico.detalhada.midia === 'movie') {
      filtro.tipoStreaming = 'filme';
    }
    if (historico.detalhada.midia === 'tv') {
      filtro.tipoStreaming = 'serie';
    }
    historico.detalhada.parametrosBusca.forEach(param =>{
      if (param.parametroMostrar === 'Gênero') {
        filtro.genero.id = param.valor;
        filtro.genero.name = param.valorMostrar;
      }
      if (param.parametroMostrar === "Idioma Original") {
        filtro.idioma.id = param.valor;
        filtro.idioma.name = param.valorMostrar;
      }
      if (param.parametroMostrar === "Ano de Lançamento") {
        filtro.ano = param.valor;
      }
      if (param.parametroMostrar === "Ator") {
        filtro.ator.id = param.valor;
        filtro.ator.name = param.valorMostrar;
      }
      if (param.parametroMostrar === 'Produtora') {
        filtro.produtora.id = param.valor;
        filtro.produtora.name = param.valorMostrar;
      }
    })

    if (filtro.ator.id === undefined) {
      delete filtro['ator'];
    }
    if (filtro.genero.id === undefined) {
      delete filtro['genero'];
    }
    if (filtro.idioma.id === undefined) {
      delete filtro['idioma'];
    }
    if (filtro.produtora.id === undefined) {
      delete filtro['produtora'];
    }
    this.realizaBuscaFiltro = filtro;
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
    this.tituloPesquisa = null;
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
      this.pesquisaEncontrada = false;
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

    const resultado_busca = await this.tmdbService.buscarPorTexto(this.tituloPesquisa, 1).toPromise();

    this.informacoesBusca = {
      porTitulo: true,
      totalPaginas: resultado_busca.Total_Paginas,
      paginaCorrente: 1,
      tituloBuscado: this.tituloPesquisa
    }

    if (resultado_busca.Total_Paginas <= 0) {
      this.msgError = 'Não encontramos resultados para sua pesquisa. Tente novamente usando outros termos!';
      this.pesquisaEncontrada = false;
      this.porTitulo = false;
    } 
     
    if(gravaHistorico && resultado_busca.Total_Paginas > 0 && this.usuarioLogado){
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

    if(resultado_busca.Total_Paginas > 0) {
      let concatAux = [];

      this.pesquisaEncontrada = true;

      var filtered = resultado_busca.Producoes.filter(this.filtraTipoMidia);

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

  async carregaBusca(evento){
    if(this.informacoesBusca == undefined || this.informacoesBusca == null){
      evento.target.complete();
      return;
    }

    if(this.informacoesBusca.paginaCorrente < this.informacoesBusca.totalPaginas){
      this.informacoesBusca.paginaCorrente++;
      const loadingBusca = this.overlayService.loading();

      if(this.informacoesBusca.porTitulo){
        const resultado = await (await this.tmdbService.buscarPorTexto(this.informacoesBusca.tituloBuscado, this.informacoesBusca.paginaCorrente).toPromise()).Producoes;

        var filtered = resultado.filter(this.filtraTipoMidia);

        filtered.forEach(producao =>{
          this.items.forEach(item =>{
            item.producoes.push(producao);
          });
        });

      }
      else{
        const resultado = await (await this.tmdbService.descobrir(this.informacoesBusca.paginaCorrente, this.informacoesBusca.buscaAvancada.tipoMedia, this.informacoesBusca.buscaAvancada.parametroBusca).toPromise()).Producoes;

        var filtered = resultado.filter(this.incluiTipoMidia);

        filtered.forEach(producao =>{
          this.items.forEach(item =>{
            item.producoes.push(producao);
          });
        });
      }

      await (await loadingBusca).dismiss();
    }

    evento.target.complete();
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


  async realizaPesquisaComFiltro(gravaHistorico: boolean): Promise<void>{
    // limpar tela caso ja tenha pesquisa
    this.msgError = null;
    this.pesquisaEncontrada = false;
    this.porTitulo = false;
    (<HTMLInputElement>document.getElementById('barraPesquisa')).value = '';
    this.tituloPesquisa = null;    

    this.porFiltro = true;
    let loading = this.overlayService.loading();
    let busca: ParametroBusca[] = [];
    let buscaLog: ParametroBuscaLog[] = [];
    this.items = [];

    if ( this.realizaBuscaFiltro.genero !== undefined) {
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

    if (this.realizaBuscaFiltro.tipoStreaming === 'filme') {
      this.tipo_pagina = 'movie';
    } else if (this.realizaBuscaFiltro.tipoStreaming === 'serie') {
      this.tipo_pagina = 'tv';
    }
    
    const resultado_busca = await this.tmdbService.descobrir(1, this.tipo_pagina, busca).toPromise();
    
    this.informacoesBusca = {
      porTitulo: false,
      totalPaginas: resultado_busca.Total_Paginas,
      paginaCorrente: 1,
      buscaAvancada:{
        tipoMedia: this.tipo_pagina,
        parametroBusca: busca
      }
    }

    if (resultado_busca.Total_Paginas <= 0) {
      this.msgError = 'Não encontramos resultados para sua pesquisa. Tente novamente usando outra combinação de filtros!';
      this.pesquisaEncontrada = false;
    }
    
    let itensAux = [];

    if(gravaHistorico && resultado_busca.Total_Paginas > 0 && this.usuarioLogado){
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

    if(resultado_busca.Total_Paginas > 0) {
      let concatAux = [];

      this.pesquisaEncontrada = true;

      var filtered = resultado_busca.Producoes.filter(this.incluiTipoMidia);

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

  ScrollToTop() {
    this.content.scrollToTop(1000).then(() => {
      this.habilitaBTfab = false
    });
  }

  btScroll(event) {
      // captura a posicao do botao
      const bottomPosition = event.target.clientHeight + event.detail.scrollTop;
      // captura o tamanho da tela
      const screenSize = event.target.clientHeight;
      // calcula um valor de acordo com o tamanho da tela
      var auxbottomPosition = screenSize + (screenSize / 4 );
      // se a posicao do botao for maior que o valor, mostra o botao, senao deixa oculto
      if (bottomPosition > auxbottomPosition) {
        this.habilitaBTfab = true;
      } else {
        this.habilitaBTfab = false;
      }
  }

}

