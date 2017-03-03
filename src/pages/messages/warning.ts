import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'warning',
  templateUrl: 'warning.html',
  styles: [`
    .warning-box {
      max-height: 300px;
      max-width: 500px;
    }
  `]
})
export class WarningPage {
  message: string;
  okCallback: () => void;
  constructor(private navCtrl: NavController, private params: NavParams) {
    this.message = params.get('message');
    this.okCallback = params.get('okCallback');
  }

  onOk() {
    this.okCallback();
    this.navCtrl.pop();
  }

  onCancel() {
    this.navCtrl.pop();
  }
}