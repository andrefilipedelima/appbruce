import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TmdbService } from '../core/providers/tmdb.service';
import { Genero } from '../core/models/genero';
import { IonicSelectableComponent } from 'ionic-selectable';


@Component({
  selector: 'app-modal-filtro',
  templateUrl: './modal-filtro.page.html',
  styleUrls: ['./modal-filtro.page.scss'],
})
export class ModalFiltroPage implements OnInit {

  constructor(
    private tmdbService: TmdbService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public alertController: AlertController,
  ) { }


  public tipoStreaming: string = 'filme';
  public ator: any;
  public ano: string;
  public genero: string;
  public idioma: string;
  public produtora: string;

  // array de generos retornados que compoem o select da tela de filtros 
  public generos;

  // array de idiomas retornados que compoem o select da tela de filtros 
  public idiomas;

  // array de atores retornados que compoem o select da tela de filtros 
  public atores;

  // array de produtoras retornados que compoem o select da tela de filtros 
  public produtoras;

  public producao;

  public tipoStreamingAux: string;
  public mostraCampoAtor: boolean = true;

  // variaveis de retorno das pesquisas dos selects
  public produtoraNotFound: boolean = false;
  public prodPesquisaAux: string = null;
  public atorNotFound: boolean = false;
  public atorPesquisaAux: string = null;

  ngOnInit() {
    this.montarSelectGeneros();
    this.montaSelectIdiomas();
    this.tipoStreamingAux = this.tipoStreaming;
  }

  ngDoCheck() {
    if (this.tipoStreaming === 'serie') {
      this.mostraCampoAtor = false;
    } else {
      this.mostraCampoAtor = true;
    }
    if (this.tipoStreaming !== this.tipoStreamingAux) {
      this.montarSelectGeneros();
      this.tipoStreamingAux = this.tipoStreaming;
    }
  }


  coletaTipoStreaming(event) {
    const aux = event.detail;
    // event.detail vem com array de informacoes,[] serve para coletar apenas o valor de value
    this.tipoStreaming = aux['value'];
  }

  async montarSelectGeneros(){
    this.generos = [];

    let mediaType;

    if (this.tipoStreaming === 'serie'){
      mediaType = 'tv'
    } else {
      mediaType = 'movie';
    }

    const resultado = await (await this.tmdbService.buscarGeneros(mediaType).toPromise());

    this.generos.push({
      resultado: resultado,
    })
  }

  async montaSelectIdiomas(){
    this.idiomas = [];
    const resultado = await (await this.tmdbService.getLanguages().toPromise());

    this.idiomas.push({
      resultado: resultado,
    })
  }

  async montaSelectAtor(ator) {
    this.atores = [];
    const atoresAux = [];
    const resultado = await (await this.tmdbService.buscarPorPessoa(ator,1).toPromise());

    if (resultado.length === 0) {
      this.atorNotFound = true;
    }

    atoresAux.push({
      resultado: resultado,
    })

    const varAux = atoresAux[0].resultado;

    varAux.forEach(element => {

      this.atores.push({
        id: element.id,
        name: element.name,
        image: 'http://image.tmdb.org/t/p/original/' + element.profile_path,
      })

    });

  }


  async montaSelectProdutora(produtora) {
    this.produtoras = [];
    const prodAux = [];
    const resultado = await (await this.tmdbService.buscarPorCompania(produtora,1).toPromise());

    if (resultado.length === 0) {
      this.produtoraNotFound = true;
    }

    prodAux.push({
      resultado: resultado,
    })

    const varAux = prodAux[0].resultado;

    varAux.forEach(element => {

      this.produtoras.push({
        id: element.id,
        name: element.name,
      })
    });

  }

  pesquisaComFiltros() {

    if (this.ano === undefined &&
      this.ator === undefined &&
      this.genero === undefined &&
      this.idioma === undefined &&
      this.produtora === undefined
      ) {
      this.presentAlert();
    } else {
      let ano;
      if (this.ano !== undefined) {
        ano = this.tratamentoData();
      }
      let genero; 
      if (this.genero !== undefined) {
        genero = this.buscaIDgenero();
      }
      let idioma;
      if (this.idioma !== undefined) {
        idioma = this.buscaIDidioma();
      }

      this.producao = {
        tipoStreaming: this.tipoStreaming,
        ano: ano,
        ator: this.ator,
        genero: genero,
        idioma: idioma,
        produtora: this.produtora,
      }

      this.modalController.dismiss(this.producao);
    }

  }


  async presentAlert() {

    const alert = await this.alertController.create({
      header: 'Ops!',
      subHeader: 'Você deve selecionar pelo menos UM filtro para continuar a pesquisa.',
      message: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Pesquisar depois',
          handler: () => {
            this.dismissModal();
          }
        },
        { 
          text: 'Continuar pesquisa',
        }
      ]
    });

    await alert.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
  
  onChangeGenero(valorSelecionado){
    this.genero = valorSelecionado;
  }

  onChangeIdioma(valorSelecionado){
    this.idioma = valorSelecionado;
  }

  onSearchAtor(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let atorPesquisa = event.text.trim().toLowerCase();

    if (atorPesquisa.length >= 2) {
      if (this.atorPesquisaAux !== atorPesquisa) {
        this.montaSelectAtor(atorPesquisa);
        this.atorPesquisaAux = atorPesquisa;
      }
    } else {
      event.component.items = [];
      this.atorNotFound = false;
      this.atorPesquisaAux = null;
      return;
    }
  }

  onSearchProdutora(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let prodPesquisa = event.text.trim().toLowerCase();

    if (prodPesquisa) { 
      if (this.prodPesquisaAux !== prodPesquisa) {
        this.montaSelectProdutora(prodPesquisa);
        this.prodPesquisaAux = prodPesquisa;
      }
    }
   
    if (!prodPesquisa) {
      event.component.items = [];
      this.produtoraNotFound = false;
      this.prodPesquisaAux = null;
      return;
    }
  }


  tratamentoData() {
    const aux = this.ano.split('-');
    const anoEscolhido = aux[0];
    return anoEscolhido
  }

  buscaIDgenero() {
    const generoEscolhido = {
      name: this.genero,
      id: '',
    };

    let resultado = this.generos[0].resultado;
    const aux = resultado.find(genero => genero.name === generoEscolhido.name);
    generoEscolhido.id = aux.id;
    return generoEscolhido;
  }

  buscaIDidioma() {
    const idiomaEscolhido = {
      name: this.idioma,
      id: '',
    };

    let resultado = this.idiomas[0].resultado;
    // funcao find procura o item selecionado dentro do array
    const aux = resultado.find(idioma => idioma.language === idiomaEscolhido.name);
    idiomaEscolhido.id = aux.id;
    return idiomaEscolhido;
  }

}
