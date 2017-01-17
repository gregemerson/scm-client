import {Component, Input } from '@angular/core';
import {NavController, ModalController, PopoverController, LoadingController, Loading} from 'ionic-angular';
import {Authenticator, IAuthUserSettings} from '../../providers/authenticator/authenticator';
import {ExerciseSetPreviewPage} from '../exercise-set-preview/exercise-set-preview';
import {MessagesPage, IMessage, MessageType} from '../messages/messages';
import {SettingsConstraints} from '../../utilities/constraints';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  settings: IAuthUserSettings;
  cnstr = new SettingsConstraints();
  minMaxTempos = {
    lower: 0,
    upper: 0
  }

  constructor(private nav: NavController, 
    private authenticator: Authenticator) {
    this.settings = authenticator.user.settings;
    this.minMaxTempos.lower = this.settings.minTempo;
    this.minMaxTempos.upper = this.settings.maxTempo;
  }

  saveClicked($event) {
    this.settings.minTempo = this.minMaxTempos.lower;
    this.settings.maxTempo = this.minMaxTempos.upper;
    this.authenticator.saveSettings({})
      .subscribe({
        next: () => {},
        error: (err: any) => {
          
        }
      })
  }
}