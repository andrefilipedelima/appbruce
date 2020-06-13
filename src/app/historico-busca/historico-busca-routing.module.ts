import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoBuscaPage } from './historico-busca.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricoBuscaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricoBuscaPageRoutingModule {}
