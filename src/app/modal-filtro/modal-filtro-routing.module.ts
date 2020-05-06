import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFiltroPage } from './modal-filtro.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFiltroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFiltroPageRoutingModule {}
