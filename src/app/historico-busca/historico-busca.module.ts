import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoBuscaPageRoutingModule } from './historico-busca-routing.module';

import { HistoricoBuscaPage } from './historico-busca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoBuscaPageRoutingModule
  ],
  declarations: [HistoricoBuscaPage]
})
export class HistoricoBuscaPageModule {}
