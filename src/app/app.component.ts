import {Component, ViewChild} from '@angular/core';
import {Platform, Modal, ModalController, PopoverController, LoadingController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Authenticator, IAuthUser} from '../providers/authenticator/authenticator';
import {ExerciseSets} from '../providers/exercise-sets/exercise-sets';
import {LoginPage} from '../pages/login/login';
import {MessagesPage, IMessage, MessageType} from '../pages/messages/messages';
import {Observable} from 'rxjs/Observable';
import {HttpService, HttpServiceError, HttpServiceErrors} from '../providers/http-service/http-service';
import {AudioBuffers} from '../providers/audio-buffers/audio-buffers';
import {Metronome} from '../providers/metronome/metronome';
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {ExerciseSetPreviewPage} from '../pages/exercise-set-preview/exercise-set-preview';
import {GuidePage} from '../pages/guide/guide';

@Component({
  templateUrl: 'app.html',
  providers: [Metronome, AudioBuffers, ExerciseSets, Authenticator, ModalController, PopoverController, HttpService]
})
export class StickControlMetronome {
  // Set up pages
  pages: Array<{title: string, component: any}>  = [
    { title: 'Welcome', component: GuidePage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Play', component: HomePage },
    { title: 'Exercises', component: ExerciseSetPreviewPage }
  ];
  rootPage: any = GuidePage;
  @ViewChild(Nav) nav: Nav;

  loginPushed = false;
  servicesLoaded = false;
  
  constructor(private platform: Platform,
    public exerciseSets: ExerciseSets,
    public authenticator: Authenticator,
    public httpService: HttpService,
    public modalController: ModalController,
    private loadingCtrl: LoadingController,
    private audioBuffers: AudioBuffers,
    private metronome: Metronome) {

    platform.ready().then(() => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.authenticator.onUserLoaded = (user: IAuthUser) => {
        this.loadServices(user).subscribe({
          next: (result: any) => {
            loading.dismiss();
          },
          error: (err: any) => {
            loading.dismiss();
            this.login('Unable to load the application');
          }
        });
      };
      this.authenticator.onUserUnloaded = () => {
        this.unloadUserData();
      }
      // Listen for errors forcing navigation to login page
      this.httpService.subscribe(({next: (errors: HttpServiceErrors) => {
        console.log('---------------------------');
        console.dir(errors);
        let displayErrors: Array<HttpServiceError> = [];
        for (let error of errors) {
          if (error.code == 'INVALID_TOKEN' || error.code == 'AUTHORIZATION_REQUIRED') {
            authenticator.unsetUser();
            this.unloadUserData();
            displayErrors.length = 0;
            this.login('invalid or need auth');
            break;
          }
          else if (error.code == 'HTTP_ERROR' && !this.authenticator.user && !this.loginPushed) {
            displayErrors.length = 0;
            this.login(error.message);
            break;
          }
          else {
            displayErrors.push(error);
          }
        }
        if (displayErrors.length == 0) {
          return;
        }
        let display = new Array<IMessage>();
        for (let error of displayErrors) {
          console.log('error: ');
          console.dir(error);
          display.push(MessagesPage.createMessage(
            error.code, error.message, MessageType.Error));
        }
        this.modalController.create(
          MessagesPage, {messages: display}).present();
      }}));

      this.tryPreviousLogin();
      StatusBar.styleDefault();
    });
  }

  private tryPreviousLogin() {
    this.authenticator.tryPreviousLogin()
    .subscribe({
      next: (user: IAuthUser) => {
      },
      error: (err: any) => {
        if (err.name == 'NO_LOCAL_CREDENTIALS') {
          this.login('no locals');
        }
      }
    });
  }

  loadServices(user: IAuthUser): Observable<void> {
    return Observable.forkJoin([
      this.exerciseSets.load(user),
      this.audioBuffers.loadAll(new AudioContext())
        .map(() => {
          this.metronome.load(this.audioBuffers);
          return Observable.of();
        })
    ])
    .flatMap(() => {
      this.servicesLoaded = true;
      return Observable.of(null);
    }).retry(1);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // Goto login page
  private login(errorMessage: string) {
    if (!errorMessage) {
      errorMessage = 'from login method';
    }
    this.loginPushed = true;
    this.nav.push(LoginPage);
    if (errorMessage) {
      this.modalController.create(MessagesPage, {
        messages: [MessagesPage.createMessage(
          'Error', errorMessage, MessageType.Error)]
      }).present();
    }
  }

  private unloadUserData(): void {
    this.exerciseSets.unload();
  }
}
