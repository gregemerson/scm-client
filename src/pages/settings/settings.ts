import {Component, ViewChild, isDevMode} from '@angular/core';
import {NavController, ModalController, ToastController, LoadingController, Loading} from 'ionic-angular';
import {Authenticator, IAuthUserSettings} from '../../providers/authenticator/authenticator';
import {ExerciseSetPreviewPage} from '../exercise-set-preview/exercise-set-preview';
import {MessagesPage, IMessage, MessageType} from '../messages/messages';
import {MessageItem} from '../message-item/message-item';
import {SettingsConstraints} from '../../utilities/constraints';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild(MessageItem) messageItem: MessageItem;
  authSettings: IAuthUserSettings;
  cnstr = new SettingsConstraints();
  isDirty = false;
  settings = {
    numberOfRepititions: null,
    tempoStep: null,
    secondsBeforeStart: null,
    upper: null,
    lower: null
  }

  constructor(private nav: NavController,
    private toaster: ToastController,
    private authenticator: Authenticator) {
    this.authSettings = authenticator.user.settings;
    this.copySettings(false);
  }

  ngAfterViewInit() {
    
  }

  private copySettings(localToAuth: boolean) {
    let source = localToAuth ? this.settings : this.authSettings;
    let target = localToAuth ? this.authSettings : this.settings;
    for (let name in this.settings) {
      let tName = name, sName = name;
      tName = localToAuth && name == 'lower' ? 'minTempo' : name;
      sName = !localToAuth && name == 'lower' ? 'minTempo' : name;
      tName = localToAuth && name == 'upper' ? 'maxTempo' : name;
      sName = !localToAuth && name == 'upper' ? 'maxTempo' : name;
      target[tName] = source[sName];
    }
  }

  onChange(event) {
    this.isDirty = true;
  }

  applySettings($event) {
    this.copySettings(true);
    if (this.authenticator.isGuest) {
      return;
    }
    this.authenticator.saveSettings()
      .subscribe({
        next: () => {
          this.messageItem.hide();
          this.isDirty = false;
          this.toaster.create({
              message: 'Settings saved successfully',
              duration: 2500,
              position: 'middle'
            }).present();
        },
        error: (err: any) => {
          // err has type ScmError
          this.messageItem.show(err.message);
        }
      })
  }
}