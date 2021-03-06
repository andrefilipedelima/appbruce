import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { GlobalFooService } from './services/GlobalFooService ';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [];

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
  public user: boolean = false;
  // caso nao possua nome salvo, deixa como ola
  public userName: string = 'Olá';
  public userEmail: string;

  public userCompleto;
  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private route: Router,
    private globalFooService: GlobalFooService,
    public alertCtrl: AlertController,
  ) {
    this.initializeApp();

    this.globalFooService.getObservable().subscribe((data) => {
      if(data.atualizaMenu){
        this.selectedIndex = data.selectedIndex;
      }
    });
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
      const logado = user !== null;

      if (user !== null) {
        this.user = true;
        this.userCompleto = user;
        this.userEmail = user.email;
        if (user.displayName !== null) {
          this.userName = 'Olá, ' + user.displayName;
        }
      }
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
    this.user = false;
    this.authService.logout();
    this.selectedIndex = 0;
  }
  
  habilitado(): boolean{
     return (this.route.url == '/login' || this.route.url == '/signup' || this.route.url == '/reset' || this.route.url == '/login/true');
  }

  async salvarNomeUsuario() {
    let alert = await this.alertCtrl.create({
      header: 'Olá',
      subHeader: 'Bem vindo ao App Bruce!',
      message: 'Como gostaria de ser chamado?',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite aqui seu nome...'
        },
      ],
      buttons: [
        {
          text: 'Salvar',
          handler: data => {
            if (data.nome.length > 0) {
              this.authService.setUserName(data.nome);
              this.userName = 'Olá, ' + data.nome;
            }
          }
        },
      ]
    });
    await alert.present();
  }

  async changeUserDisplayName(e){
    let header: string = 'Olá';

    if (this.userCompleto.displayName) {
      header = header + ' ' + this.userCompleto.displayName;
    }
    let alert = await this.alertCtrl.create({
      header: header,
      message: 'Gostaria de alterar seu nome de usuário?',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite aqui um novo nome...'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (data.nome.length > 0) {
              this.authService.setUserName(data.nome);
              this.userName = 'Olá, ' + data.nome;
            }
          }
        },
      ]
    });
    await alert.present();

  }
}
