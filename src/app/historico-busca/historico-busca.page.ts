import { Component, OnInit } from '@angular/core';
import { HistoricoBusca } from '../core/models/historicoBusca';
import { Observable } from 'rxjs';
import { HistoricoBuscaService } from '../core/providers/historico-busca.service';
import { AuthService } from '../auth/auth.service';
import { OverlayService } from '../services/OverlayService';
import { take } from 'rxjs/operators';
import { TmdbService } from '../core/providers/tmdb.service';

@Component({
  selector: 'app-historico-busca',
  templateUrl: './historico-busca.page.html',
  styleUrls: ['./historico-busca.page.scss'],
})
export class HistoricoBuscaPage implements OnInit {

  historicoBusca$: Observable<HistoricoBusca[]>;

  constructor(private historicoBuscaService: HistoricoBuscaService,
              private authService: AuthService,
              private overlayService: OverlayService,
              private tmdbService: TmdbService) 
              { }

  ngOnInit() {
    
  }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();

    this.authService.authState$.pipe(take(1)).subscribe(user =>{
      this.historicoBusca$ = this.historicoBuscaService.getAll();
      this.historicoBusca$.pipe(take(1)).subscribe(historico => loading.dismiss());
    })
  }
}
