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

  public generos;
  public producao;


  ngOnInit() {
    this.montarSelectGeneros();
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


  pesquisaComFiltros() {
    console.log('ano de lancamento: ', this.ano, 'ator: ', this.ator, 'genero: ', this.genero, 'idioma original: ', this.idioma, 'produtora: ', this.produtora);

    // this.montarSelectGeneros();

    this.producao = {
      tipoStreaming: this.tipoStreaming,
      ano: this.ano,
      ator: this.ator,
      genero: this.genero,
      idioma: this.idioma,
      produtora: this.produtora,
    }


    if (this.ano === undefined &&
      this.ator === undefined &&
      this.genero === undefined &&
      this.idioma === undefined &&
      this.produtora === undefined
      ) {
      this.presentAlert();
    } else {
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
  
  onChange(valorSelecionado){
    console.log('genero selecionado', valorSelecionado);
    this.genero = valorSelecionado;
  }

}
