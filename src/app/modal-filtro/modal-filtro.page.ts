import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-filtro',
  templateUrl: './modal-filtro.page.html',
  styleUrls: ['./modal-filtro.page.scss'],
})
export class ModalFiltroPage implements OnInit {

  constructor(public navCtrl: NavController, public modalController: ModalController) { }

  ngOnInit() {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logIn(mail, password) {
    this.modalController.dismiss({ mail: mail, password: password });

  }
  coletaTipoStreaming(event) {

    const teste = event.detail;
    console.log('tipo de streaming selecionado', teste);

  }

}
