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
      name: 'filmes',
      url: '/welcome/filmes',
      icon: 'film'
    },
    {
      title: 'Séries',
      name: 'series',
      url: '/welcome/series',
      icon: 'videocam'
    },
    {
      title: 'Buscar',
      name: 'buscar',
      url: '/welcome/buscar',
      icon: 'search'
    }
  ];

  public appPages2 = [
    {
      title: 'Filmes',
      name: 'filmes',
      url: '/welcome/filmes',
      icon: 'film'
    },
    {
      title: 'Séries',
      name: 'series',
      url: '/welcome/series',
      icon: 'videocam'
    },
    {
      title: 'Buscar',
      name: 'buscar',
      url: '/welcome/buscar',
      icon: 'search'
    },
    {
      title: 'Histórico',
      name: 'historico',
      url: '/welcome/historico',
      icon: 'globe'
    },
    {
      title: 'Preferências',
      name: 'preferencias',
      url: '/welcome/preferencias',
      icon: 'settings'
    }
  ];

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
      this.selectedIndex = this.appPages2.findIndex(page => page.name === path);
    }

    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.authService.authState$.subscribe(user =>{
      const logado = user != null;

      console.log('app component:' + logado);
      this.isAuth = logado;
      this.controlaMenu(logado);
    })
  }

  controlaMenu(logado){
    if(!logado){
      this.appPages = [
        {
          title: 'Filmes',
          name: 'filmes',
          url: '/welcome/filmes',
          icon: 'film'
        },
        {
          title: 'Séries',
          name: 'series',
          url: '/welcome/series',
          icon: 'videocam'
        },
        {
          title: 'Buscar',
          name: 'buscar',
          url: '/welcome/buscar',
          icon: 'search'
        }
      ];
    }
    else{
      this.appPages = this.appPages2;
    }
  }
  
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.isAuth = false;
    this.controlaMenu(this.isAuth);
    this.authService.logout();
  }
  
  habilitado(): boolean{
     return (this.route.url == '/login' || this.route.url == '/signup' || this.route.url == '/reset' || this.route.url == '/login/true');
  }

}
