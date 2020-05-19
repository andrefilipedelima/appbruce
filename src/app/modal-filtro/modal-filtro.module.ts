import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFiltroPageRoutingModule } from './modal-filtro-routing.module';

import { ModalFiltroPage } from './modal-filtro.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFiltroPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ModalFiltroPage]
})
export class ModalFiltroPageModule {}
