import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesProducaoPage } from './detalhes-producao.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesProducaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesProducaoPageRoutingModule {}
