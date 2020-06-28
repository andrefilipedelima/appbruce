import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore.class';
import { HistoricoBusca } from '../models/historicoBusca';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricoBuscaService extends Firestore<HistoricoBusca> {
  private readonly limiteRegistros = 10;
  private qtdeRegistros: number;
  private ultimoRegistro: HistoricoBusca;

  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe(user => {
      if (user){
        this.setCollection(`/users/${user.uid}/historico`, (ref: firestore.CollectionReference) => {
          return ref.orderBy('dataBusca', 'desc');
        });

        this.collection.valueChanges().pipe(take(1)).subscribe(historico =>{
          this.qtdeRegistros = historico.length;
          this.ultimoRegistro = historico[this.qtdeRegistros - 1];
        })
      }
      else this.setCollection(null);
    });
  }

  create(item: HistoricoBusca): Promise<HistoricoBusca> {
    this.qtdeRegistros++;
    if(this.qtdeRegistros >= this.limiteRegistros){
     this.delete(this.ultimoRegistro);
     this.qtdeRegistros--;
    }

    item.id = this.db.createId();
    return this.setItem(item, 'set');
  }

}
