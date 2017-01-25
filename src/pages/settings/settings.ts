import {Component, ViewChild, isDevMode, ChangeDetectorRef} from '@angular/core';
import {NavController, ModalController, ToastController, LoadingController, Loading} from 'ionic-angular';
import {Authenticator, IAuthUser, IAuthUserSettings} from '../../providers/authenticator/authenticator';
import {ExerciseSetPreviewPage} from '../exercise-set-preview/exercise-set-preview';
import {MessagesPage, IMessage, MessageType} from '../messages/messages';
import {MessageItem} from '../message-item/message-item';
import {SettingsConstraints} from '../../utilities/constraints';

class LocalSettings {
  constructor(
    public numberOfRepititions = 0,
    public tempoStep = 0,
    public secondsBeforeStart = 0,
    public lower = 0,
    public upper = 0
  ) {}
}

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild(MessageItem) messageItem: MessageItem;
  authSettings: IAuthUserSettings;
  cnstr = new SettingsConstraints();
  isDirty = false;
  settings = new LocalSettings();

  constructor(private nav: NavController,
    private toaster: ToastController,
    private changeDetector: ChangeDetectorRef,
    private authenticator: Authenticator) {
      console.log('settings page constructed')
      this.onUserLoaded(authenticator.user);
  }

  onUserLoaded(user: IAuthUser) {
    this.authSettings = user.settings;
    this.copySettings(false);
  }

  private copySettings(localToAuth: boolean) {
    let source = localToAuth ? this.settings : this.authSettings;
    let target = localToAuth ? this.authSettings : this.settings;
    for (let localProp in this.settings) {
      let tName = localProp, sName = localProp;
      if (localProp == 'lower') {
        tName = localToAuth ? 'minTempo' : tName;
        sName = localToAuth ? sName : 'minTempo';
      }
      else if (localProp == 'upper') {
        tName = localToAuth ? 'maxTempo' : tName;
        sName = localToAuth ? sName : 'maxTempo';
      }
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