import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoricoBusca } from '../core/models/historicoBusca';
import { Observable } from 'rxjs';
import { HistoricoBuscaService } from '../core/providers/historico-busca.service';
import { AuthService } from '../auth/auth.service';
import { OverlayService } from '../services/OverlayService';
import { take } from 'rxjs/operators';
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-historico-busca',
  templateUrl: './historico-busca.page.html',
  styleUrls: ['./historico-busca.page.scss'],
})
export class HistoricoBuscaPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  historicoBusca$: Observable<HistoricoBusca[]>;

  public porTitulo = [];
  public porFiltro = [];

  public segment:number = 0;

  slideOpts = {
    autoHeight: true,
  };

  constructor(private historicoBuscaService: HistoricoBuscaService,
              private authService: AuthService,
              private overlayService: OverlayService,
              private navCtrl: NavController)
              { }

  ngOnInit() {
    
  }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();

    this.authService.authState$.pipe(take(1)).subscribe(user =>{
      this.historicoBusca$ = this.historicoBuscaService.getAll();
      this.historicoBusca$.subscribe(historico => {
        loading.dismiss()
        const historicoTotal = historico;
        this.porTitulo = [];
        this.porFiltro = [];
        historicoTotal.forEach(item =>{
          if (item.porTitulo === true) {
            this.porTitulo.push(item)
          } else {
            this.porFiltro.push(item)
          }
        })
      })
    })
  }

  async realizaBusca(historico: HistoricoBusca):Promise<void>{
    let historicoJson = JSON.stringify(historico);

    this.navCtrl.navigateForward(['welcome/buscar',historicoJson]);
  }

  async deletaHistorico(historico: HistoricoBusca) {
    const loading = await this.overlayService.loading();
    await this.historicoBuscaService.delete(historico);
    await loading.dismiss()

  }

  slideChanged() {
    this.slides.getActiveIndex().then((index: number) => {
      this.segment = index;
    });
  }

}
