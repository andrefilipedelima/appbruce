import { NgModule, OnInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeComponentRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { TmdbService } from '../core/providers/tmdb.service';

import {map, take} from 'rxjs/operators';
import { OverlayService } from '../services/OverlayService';
import { Producao } from '../core/models/producao';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeComponentRoutingModule,


  ],
  declarations: [WelcomeComponent]
})

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponentModule {

  items = [];

  constructor(private tmdbService: TmdbService, private overlayService: OverlayService){
  }

}
