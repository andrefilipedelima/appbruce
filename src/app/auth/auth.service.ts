import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSuccessfully();
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
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
        sucesso = false;
      });

      return sucesso;
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
    this.router.navigate(['/welcome/filmes']);
  }

}
