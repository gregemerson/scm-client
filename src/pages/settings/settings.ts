import {Component, ViewChild, isDevMode} from '@angular/core';
import {NavController, ModalController, PopoverController, LoadingController, Loading} from 'ionic-angular';
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
  settings: IAuthUserSettings;
  cnstr = new SettingsConstraints();
  isDirty = false;
  isGuest = true;
  minMaxTempos = {
    lower: 0,
    upper: 0
  };

  constructor(private nav: NavController, 
    private authenticator: Authenticator) {
    this.settings = authenticator.user.settings;
    this.minMaxTempos.lower = this.settings.minTempo;
    this.minMaxTempos.upper = this.settings.maxTempo;
    this.isGuest = this.authenticator.isGuest;
  }

  onChange(event) {
    this.isDirty = true;
  }

  saveClicked($event) {
    this.settings.minTempo = this.minMaxTempos.lower;
    this.settings.maxTempo = this.minMaxTempos.upper;
    this.authenticator.saveSettings()
      .subscribe({
        next: () => {
          this.messageItem.hide();
          this.isDirty = false;
        },
        error: (err: any) => {
          // err has type ScmError
          if (isDevMode()) {
            this.messageItem.show(err.toString())
          }
          else {
            this.messageItem.show(err.message);
          }
        }
      })
  }
}