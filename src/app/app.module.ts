import {NgModule} from '@angular/core';
import {IonicApp, IonicModule, ModalController, PopoverController} from 'ionic-angular';
import {StickControlMetronome} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {CountDownPage} from '../pages/countdown/countdown';
import {ExerciseDisplay} from '../pages/exercise-display/exercise-display';
import {ExerciseSetPreviewPage} from '../pages/exercise-set-preview/exercise-set-preview'
import {GuidePage} from '../pages/guide/guide';
import {LoginPage} from '../pages/login/login';
import {ExerciseSetSelectorPage} from '../pages/exercise-set-preview/exercise-set-selector';
import {NewExerciseSetForm} from '../pages/exercise-set-preview/new-exercise-set';
import {MessagesPage} from '../pages/messages/messages';
import {WarningPage} from '../pages/messages/warning';
import {SettingsPage} from '../pages/settings/settings';
import {AudioBuffers} from '../providers/audio-buffers/audio-buffers';
import {Authenticator} from '../providers/authenticator/authenticator';
import {ExerciseSets} from '../providers/exercise-sets/exercise-sets';
import {HttpService} from '../providers/http-service/http-service';
import {Metronome} from '../providers/metronome/metronome';
import {NewExerciseForm} from '../pages/exercise-set-preview/new-exercise';
import {ShareExerciseSetForm} from '../pages/exercise-set-preview/share-exercise-set';
import {RepeatForm} from '../pages/exercise-set-preview/repeat';
import {AppButtons} from '../pages/app-buttons/app-buttons';
import {MessageItem} from '../pages/message-item/message-item'

@NgModule({
  declarations: [
    StickControlMetronome,
    AboutPage,
    ContactPage,
    HomePage,
    CountDownPage,
    ExerciseDisplay,
    ExerciseSetPreviewPage,
    ExerciseSetSelectorPage,
    RepeatForm,
    GuidePage,
    LoginPage,
    MessagesPage,
    WarningPage,
    SettingsPage,
    NewExerciseSetForm,
    ShareExerciseSetForm,
    NewExerciseForm,
    AppButtons,
    MessageItem
  ],
  imports: [
    IonicModule.forRoot(StickControlMetronome, {prodMode: false})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    StickControlMetronome,
    AboutPage,
    ContactPage,
    HomePage,
    CountDownPage,
    ExerciseDisplay,
    ExerciseSetPreviewPage,
    ExerciseSetSelectorPage,
    RepeatForm,
    GuidePage,
    LoginPage,
    MessagesPage,
    WarningPage,
    SettingsPage,
    NewExerciseSetForm,
    ShareExerciseSetForm,
    NewExerciseForm,
    AppButtons
  ],
  providers: [
    AudioBuffers,
    Authenticator,
    ExerciseSets,
    HttpService,
    Metronome
  ]
})
export class AppModule {}
