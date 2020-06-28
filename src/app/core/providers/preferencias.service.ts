import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore.class';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { Preferencias } from '../models/preferencias';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService extends Firestore<Preferencias> {
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe(user => {
      if (user){
        this.setCollection(`/users/${user.uid}/preferencias`, (ref: firestore.CollectionReference) => {
          return ref;
        });
      }
      else this.setCollection(null);
    });
  }
}
