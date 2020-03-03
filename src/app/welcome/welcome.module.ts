import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeComponentRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeComponentRoutingModule,


  ],
  declarations: [WelcomeComponent]
})
export class WelcomeComponentModule {}
