import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Filmes',
      url: '/welcome/filmes',
      icon: 'film'
    },
    {
      title: 'Séries',
      url: '/welcome/series',
      icon: 'videocam'
    },
    {
      title: 'Buscar',
      url: '/welcome/buscar',
      icon: 'search'
    }
  ];

  public appPages2 = [
    {
      title: 'Histórico',
      url: '/welcome/historico',
      icon: 'globe'
    },
    {
      title: 'Preferências',
      url: '/welcome/preferencias',
      icon: 'settings'
    },
    {
      title: 'Notificações',
      url: '/welcome/notificacoes',
      icon: 'notifications'
    },
  ];
  /* public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; */

  home = false;
  isAuth = false;
  authSubscription: Subscription;
  
  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private route: Router
  ) {
    this.initializeApp();

  }

  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('welcome/')[1];
    
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
  
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  
  habilitado(): boolean{
     return (this.route.url == '/login' || this.route.url == '/signup' || this.route.url == '/reset');
  }

}
