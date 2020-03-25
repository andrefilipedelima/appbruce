import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesProducaoPageRoutingModule } from './detalhes-producao-routing.module';

import { DetalhesProducaoPage } from './detalhes-producao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesProducaoPageRoutingModule
  ],
  declarations: [DetalhesProducaoPage]
})
export class DetalhesProducaoPageModule {}
