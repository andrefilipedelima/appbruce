import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

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
    path: 'welcome/:id',
    loadChildren: () => import('./welcome2/welcome2.module').then( m => m.Welcome2PageModule), 
  },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetPasswordComponent },
  {
    path: 'welcome2/:id',
    loadChildren: () => import('./welcome2/welcome2.module').then( m => m.Welcome2PageModule)
  },
  {
    path: 'detalhes/:tipo/:id',
    loadChildren: () => import('./detalhes-producao/detalhes-producao.module').then( m => m.DetalhesProducaoPageModule)
  },



  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
