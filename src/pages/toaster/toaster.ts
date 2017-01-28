import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';

@Component({
  selector: 'toaster',
  template: ''
})
export class Toaster {

  constructor(public navCtrl: NavController,
             public navParams: NavParams,
             private toastCtrl: ToastController) {
  }

  present(message: string) {
    this.toastCtrl.create({
                  message: message,
                  duration: 2500,
                  position: 'middle'
                }).present();
  }
}
