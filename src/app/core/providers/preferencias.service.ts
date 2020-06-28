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
  private readonly limiteRegistros = 10;
  private qtdeRegistros: number;
  private ultimoRegistro: Preferencias;

  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe(user => {
      if (user){
        this.setCollection(`/users/${user.uid}/preferencias`, (ref: firestore.CollectionReference) => {
          return ref.orderBy('dataBusca', 'desc');
        });

        this.collection.valueChanges().subscribe(preferencias =>{
          this.qtdeRegistros = preferencias.length;
          this.ultimoRegistro = preferencias[this.qtdeRegistros - 1];
        })
      }
      else this.setCollection(null);
    });
  }

  create(item: Preferencias): Promise<Preferencias> {
    if(this.qtdeRegistros >= this.limiteRegistros){
     this.delete(this.ultimoRegistro);
    }

    item.id = this.db.createId();
    return this.setItem(item, 'set');
  }

}
