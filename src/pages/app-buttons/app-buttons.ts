import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Authenticator} from '../../providers/authenticator/authenticator'
import {LoginPage} from '../login/login'

@Component({
  selector: 'app-buttons',
  templateUrl: 'app-buttons.html'
})
export class AppButtons {

  constructor(public navCtrl: NavController, 
    private authenticator: Authenticator) {
  }

  logout() {
    this.navCtrl.push(LoginPage);
    this.authenticator.logout().subscribe({
      next: () => {
      },
      error: (err: any) => {
        console.dir(err);
      }
    });
  }
}
