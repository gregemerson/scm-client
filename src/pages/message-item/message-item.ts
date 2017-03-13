import {Component, Input} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'message-item',
  templateUrl: 'message-item.html'
})
export class MessageItem {
  message = '';
  title = '';
  @Input() isError = false;
  isHidden = true;

  constructor(public navCtrl: NavController) {

  }

  hide() {
    this.isHidden = true;
    this.message = '';
  }

  show(message: string, title = '') {
    this.isHidden = false;
    this.message = message;
    this.title = title;
    console.log('here is message ' + message)
  }
}
