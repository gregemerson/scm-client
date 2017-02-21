import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Platform, Modal, ModalController, PopoverController, LoadingController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Authenticator, IAuthUser} from '../providers/authenticator/authenticator';
import {ExerciseSets} from '../providers/exercise-sets/exercise-sets';
import {LoginPage} from '../pages/login/login';
import {MessagesPage, IMessage, MessageType} from '../pages/messages/messages';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../providers/http-service/http-service';
import {AudioBuffers} from '../providers/audio-buffers/audio-buffers';
import {Metronome} from '../providers/metronome/metronome';
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {ExerciseSetPreviewPage} from '../pages/exercise-set-preview/exercise-set-preview';
import {GuidePage} from '../pages/guide/guide';
import {ScmErrors, ScmErrorList, IScmError} from '../utilities/errors';

@Component({
  templateUrl: 'app.html',
  providers: [Metronome, AudioBuffers, ExerciseSets, Authenticator, HttpService]
})
export class StickControlMetronome {
  // Set up pages
  pages: Array<{title: string, component: any}>  = [
    { title: 'Welcome', component: GuidePage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Play', component: HomePage },
    { title: 'Exercise Sets', component: ExerciseSetPreviewPage }
  ];
  rootPage: any = GuidePage;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(GuidePage) guide: GuidePage;
  @ViewChild(SettingsPage) settings: SettingsPage;

  loginPushed = false;
  servicesLoaded = false;
  
  constructor(private platform: Platform,
    public exerciseSets: ExerciseSets,
    public authenticator: Authenticator,
    public httpService: HttpService,
    public modalController: ModalController,
    private loadingCtrl: LoadingController,
    private audioBuffers: AudioBuffers,
    private metronome: Metronome,
    private changeDetector: ChangeDetectorRef) {

    platform.ready().then(() => {
      this.authenticator.onUserLoaded.subscribe((user: IAuthUser) => {
        let loading = this.loadingCtrl.create({content: 'loading user data...'});
        loading.present();

        this.loadServices(user).subscribe({
          next: (result: any) => {
            loading.dismiss();
          },
          error: (err: any) => {
            loading.dismiss();
            this.login(err);
          }
        });
      });

      this.authenticator.onUserUnloaded.subscribe(() => {
        this.unloadUserData();
      });

      // Listen for errors forcing navigation to login page
      this.httpService.subscribe(({next: (errors: ScmErrorList) => {
        let displayErrors: ScmErrorList = [];
        for (let error of errors) {
          if (error.code == ScmErrors.AuthRequired) {
            authenticator.unsetUser();
            this.unloadUserData();
            displayErrors.length = 0;
            this.login();
            break;
          }
        }
      }}));

      this.tryPreviousLogin();
      StatusBar.styleDefault();
    });
  }

  private tryPreviousLogin() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authenticator.tryPreviousLogin()
    .subscribe({
      next: (user: IAuthUser) => {
        loading.dismiss();
      },
      error: (err: any) => {
        loading.dismiss();
        // err of type IScmError
        if (err.code == ScmErrors.NoLocalCredentials) {
          this.login();
        }
        else {
          this.login(err);
        }
      }
    });
  }

  // Goto login page
  private login(error: IScmError = null) {
    this.loginPushed = true;
    this.nav.push(LoginPage, {
      error: error
    });
  }

  loadServices(user: IAuthUser): Observable<void> {
    return Observable.forkJoin([
      this.exerciseSets.load(user),
      this.exerciseSets.loadShareLists(),
      this.audioBuffers.loadAll(new AudioContext())
    ])
    .flatMap(() => {
      console.log('fork join completed...');
      this.metronome.load(this.audioBuffers);
      this.servicesLoaded = true;
      this.exerciseSets.pollExerciseSetSharing();
      return Observable.of(null);
    })
    .retry(1)
    .catch((error: any, caught: Observable<any>) => {
      return Observable.throw(error);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private unloadUserData(): void {
    this.exerciseSets.unload();
  }
}
