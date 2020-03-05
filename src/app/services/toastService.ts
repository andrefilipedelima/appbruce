import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService{

    constructor(public toastController: ToastController) {}
    
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          position: 'top',
          duration: 2000
        });
        toast.present();
      }



}