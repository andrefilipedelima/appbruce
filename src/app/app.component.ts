import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
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
    },
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
    {
      title: 'MyBruce',
      url: '/welcome/myBruce',
      icon: 'ribbon'
    },
    {
      title: 'Logout',
      url: '/welcome/logout',
      icon: 'log-out'
    }
  ];
  /* public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; */

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
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
  }
}
