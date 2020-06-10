import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from './auth-data.model';
import * as firebase from 'firebase';
import { OverlayService } from '../services/OverlayService';
import { AuthEmail } from './auth-email.model';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  authState$: Observable<firebase.User>;

  defaultAuth = firebase.auth();

   actionCodeSettings = {
    url: '/login',
    iOS: {
      bundleId: ''
    },
    android: {
      packageName: '',
      installApp: true,
      minimumVersion: '12'
    },
    handleCodeInApp: true
  };

  constructor(private router: Router, private afAuth: AngularFireAuth, private overlay: OverlayService) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        result.user.sendEmailVerification().then(result => {
          this.overlay.toast({message: "Conta Criada, verifique sua caixa de e-mail"});
          this.router.navigate(['/login/true']);
        }).catch(error => {
          this.overlay.toast({message: "Erro de e-mail de configuração."});
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  async login(authData: AuthData): Promise<boolean> {
    let sucesso = true; 
    await this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        if (result.user.emailVerified) {
          this.authSuccessfully();
        }
        else {
          this.overlay.toast({message: "E-mail ainda não verificado."});
        }
      })
      .catch(error => {
        console.log(error);
        sucesso = false;
      });

      return sucesso;
  }

  reset(authEmail: AuthEmail) {
    this.afAuth.auth.sendPasswordResetEmail(authEmail.email).then( result => {
      this.overlay.toast({message: "Verifique sua caixa de e-mail para trocar a senha."});     
    }).catch(error => {
      this.overlay.toastLong({message: "Nenhuma conta válida foi encontrada com o E-mail informado."});
    });
  }
  
  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/welcome2/filmes']);
  }

}
