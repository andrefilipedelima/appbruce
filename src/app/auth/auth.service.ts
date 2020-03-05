import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from './auth-data.model';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

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

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
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
    this.router.navigate(['/welcome/filmes']);
  }

  resetPassword(email: string) {
    firebase.auth().sendPasswordResetEmail(
      email, this.actionCodeSettings)
      .then(function() {
        // Password reset email sent.
      })
      .catch(function(error) {
        // Error occurred. Inspect error.code.
      }); 
    }

  
}
