import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { TmdbService } from '../core/providers/tmdb.service';
import { Genero } from '../core/models/genero';


@Component({
  selector: 'app-modal-filtro',
  templateUrl: './modal-filtro.page.html',
  styleUrls: ['./modal-filtro.page.scss'],
})
export class ModalFiltroPage implements OnInit {

  constructor(private tmdbService: TmdbService, public navCtrl: NavController, public modalController: ModalController) { }

  @Output() realizaBusca: EventEmitter<Object> = new EventEmitter<Object>();

  public tipoStreaming: string;
  public ator: string;
  public ano: string;
  public genero: string;
  public idioma: string;
  public produtora: string;

  public generos;


  ngOnInit() {
    this.montarSelectGeneros();
  }


  coletaTipoStreaming(event) {
    this.tipoStreaming = event.detail;
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

    this.montarSelectGeneros();

    const producao = {
      ano: this.ano,
      ator: this.ator,
      genero: this.genero,
      idioma: this.idioma,
      produtora: this.produtora,
    }
    this.modalController.dismiss();
    this.realizaBusca.emit(producao);

  }
  
  onChange(valorSelecionado){
    console.log('genero selecionado', valorSelecionado);
    this.genero = valorSelecionado;
  }

}
