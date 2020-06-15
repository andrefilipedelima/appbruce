import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, UrlSegment } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'welcome/buscar',
    loadChildren: () => import('./busca/busca.module').then( m => m.BuscaPageModule)
  },
  {
    path: 'welcome/buscar/:historicoBusca',
    loadChildren: () => import('./busca/busca.module').then( m => m.BuscaPageModule)
  },
  {
    path: 'welcome/historico',
    loadChildren: () => import('./historico-busca/historico-busca.module').then( m => m.HistoricoBuscaPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'welcome/preferencias',
    loadChildren: () => import('./preferencias/preferencias.module').then( m => m.PreferenciasPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'welcome/:id',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule), 
  },
  { path: 'signup', component: SignupComponent },
  { path: 'login/:contacriada', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetPasswordComponent },
  {
    path: 'detalhes/:tipo/:id',
    loadChildren: () => import('./detalhes-producao/detalhes-producao.module').then( m => m.DetalhesProducaoPageModule)
  },
  {
    path: 'modal-filtro',
    loadChildren: () => import('./modal-filtro/modal-filtro.module').then( m => m.ModalFiltroPageModule)
  } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
