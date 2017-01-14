import {Component, ViewChild} from '@angular/core';
import {Platform, Modal, ModalController, PopoverController, LoadingController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ResourceLibrary} from '../providers/resource-library/resource-library';
import {Authenticator, IAuthUser} from '../providers/authenticator/authenticator';
import {ExerciseSets} from '../providers/exercise-sets/exercise-sets';
import {LoginPage} from '../pages/login/login';
import {MessagesPage, IMessage, MessageType} from '../pages/messages/messages';
import {Observable} from 'rxjs/Observable';
import {HttpService, HttpServiceError, HttpServiceErrors} from '../providers/http-service/http-service';
// Pages
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {ExerciseSetPreviewPage} from '../pages/exercise-set-preview/exercise-set-preview';
import {GuidePage} from '../pages/guide/guide';

@Component({
  templateUrl: 'app.html',
  providers: [ResourceLibrary, ExerciseSets, Authenticator, ModalController, PopoverController, HttpService]
})
export class StickControlMetronome {
  // Set up pages
  pages: Array<{title: string, component: any}>  = [
    { title: 'Welcome', component: GuidePage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Welcome', component: GuidePage },
    { title: 'Exercises', component: ExerciseSetPreviewPage }
  ];
  rootPage: any = GuidePage;
  @ViewChild(Nav) nav: Nav;

  userReady = false;
  exerciseSetsReady = false;
  
  constructor(private platform: Platform, 
    public resourceLibrary: ResourceLibrary,
    public exerciseSets: ExerciseSets,
    public authenticator: Authenticator,
    public httpService: HttpService,
    public modalController: ModalController,
    private loadingCtrl: LoadingController) {

    platform.ready().then(() => {
      // Listen for errors forcing navigation to login page
      this.httpService.subscribe(({next: (errors: HttpServiceErrors) => {
        console.log('---------------------------');
        console.dir(errors);
        let displayErrors: Array<HttpServiceError> = [];
        for (let error of errors) {
          if (error.code == 'INVALID_TOKEN' || error.code == 'AUTHORIZATION_REQUIRED') {
            displayErrors.length = 0;
            this.login('invalid or need auth');
            break;
          }
          else if (error.code == 'HTTP_ERROR') {
            if (!this.authenticator.user) {
              this.login(error.message);
            }
            else if (!this.exerciseSetsReady) {

            }
            else {
              // display error message
            }
          }
          else {
            displayErrors.push(error);
          }
        }
        /*
        let display = new Array<IMessage>();
        for (let error of displayErrors) {
          console.log('error: ');
          console.dir(error);
          display.push(MessagesPage.createMessage(
            error.code, error.message, MessageType.Error));
        }
        this.modalController.create(
          MessagesPage, {messages: displayErrors}).present();
          */
      }}));

      this.tryPreviousLogin();
      StatusBar.styleDefault();
    });
  }

  private tryPreviousLogin() {
    this.authenticator.tryPreviousLogin()
    .flatMap((user: IAuthUser, index: number) => {
      this.userReady = true;
      return this.exerciseSets.load(user);
    })
    .subscribe({
      next: () => {
        this.exerciseSetsReady = true;
      },
      error: (err: any) => {
        if (err == 'NO_LOCAL_CREDENTIALS') {
          this.login('no locals');
        }
      }
    });
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

  private loadUserData(user: IAuthUser): void {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.exerciseSets.load(user).subscribe({
      next: () => {
        loading.dismiss();
      },
      error: (err: any) => {
        console.log('error: ');
        console.dir(err);
        loading.dismiss();
        this.modalController.create(MessagesPage, {
          messages: [MessagesPage.createMessage(
            'Error', err, MessageType.Error)]
        }).present();
      }
    });
  }
}
