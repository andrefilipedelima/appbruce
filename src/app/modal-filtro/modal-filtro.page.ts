import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TmdbService } from '../core/providers/tmdb.service';
import { Genero } from '../core/models/genero';


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


  public tipoStreaming: string;
  public ator: string;
  public ano: string;
  public genero: string;
  public idioma: string;
  public produtora: string;

  // array de generos retornados que compoem o select da tela de filtros 
  public generos;

  // array de idiomas retornados que compoem o select da tela de filtros 
  public idiomas;

  public producao;


  ngOnInit() {
    this.montarSelectGeneros();
    this.montaSelectIdiomas();
  }


  coletaTipoStreaming(event) {
    const aux = event.detail;
    // event.detail vem com array de informacoes,[] serve para coletar apenas o valor de value
    this.tipoStreaming = aux['value'];
    console.log('tipo de streaming selecionado', this.tipoStreaming);
  }

  async montarSelectGeneros(){
    this.generos = [];

    let mediaType;

    if (this.tipoStreaming === 'serie'){
      mediaType = 'tv'
    } else {
      mediaType = 'movie';
    }
    if (!this.tipoStreaming) {
      mediaType = 'movie';
    }
    const resultado = await (await this.tmdbService.buscarGeneros(mediaType).toPromise());

    console.log('resultado dos generos', resultado);
    this.generos.push({
      resultado: resultado,
    })
  }

  async montaSelectIdiomas(){
    this.idiomas = [];
    const resultado = await (await this.tmdbService.getLanguages().toPromise());
    console.log('resultado', resultado);

    this.idiomas.push({
      resultado: resultado,
    })
  }


  pesquisaComFiltros() {
    console.log('ano de lancamento: ', this.ano, 'ator: ', this.ator, 'genero: ', this.genero, 'idioma original: ', this.idioma, 'produtora: ', this.produtora);

    // this.montarSelectGeneros();


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

      this.fechaModal();
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
            this.fechaModal();
          }
        },
        { 
          text: 'Continuar pesquisa',
        }
      ]
    });

    await alert.present();
  }

  fechaModal(){
    this.modalController.dismiss(this.producao);
  }
  
  onChangeGenero(valorSelecionado){
    console.log('genero selecionado', valorSelecionado);
    this.genero = valorSelecionado;
  }

  onChangeIdioma(valorSelecionado){
    console.log('idioma selecionado', valorSelecionado);
    this.idioma = valorSelecionado;
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
