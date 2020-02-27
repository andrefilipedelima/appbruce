import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

interface User {
  email?: string;
  password?: string;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user: User = {
    email: 'test2@test.com',
    password: 'test1234',
  };

  constructor(public afAuth: AngularFireAuth) {}

  async createAccount() {
     const user = await this.afAuth.auth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );

    console.log(user);
  }

  async login() {
    const user = await this.afAuth.auth.signInWithEmailAndPassword(
      this.user.email,
      this.user.password
    );

    console.log(user);
  }

  async logout() {
    await this.afAuth.auth.signOut();
  }

}
