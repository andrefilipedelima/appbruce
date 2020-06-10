import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore.class';
import { HistoricoBusca } from '../models/historicoBusca';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class HistoricoBuscaService extends Firestore<HistoricoBusca> {

  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe(user => {
      console.log(user);
      console.log(user.uid);
      console.log(this.collection);

      if (user)
        this.setCollection(`/users/${user.uid}/historico`, (ref: firestore.CollectionReference) => {
          //return ref.orderBy('done', 'asc').orderBy('title', 'asc');
          return ref;
        });
      else this.setCollection(null);

      console.log(user);
      console.log(user.uid);
      console.log(this.collection);
    });
  }

}
