import {Component, OnChanges, isDevMode} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Authenticator, IAuthUser} from '../../providers/authenticator/authenticator';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ScmValidators} from '../../utilities/scm-validators';

interface InvisibilityMap {
  menu: boolean,
  logIn: boolean,
  createAccount: boolean
}

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  errorMessage: string = null;
  constraints = new ScmValidators();
  accountGroup: FormGroup;
  errorFontEm = .8;

  // Current accounts
  password = '';
  email = '';

  // For new accounts
  newUsernameCtrl: FormControl;
  newEmailCtrl: FormControl;
  newPassword1Ctrl: FormControl;
  newPassword2Ctrl: FormControl;
  newUserNameError = '';
  newEmailError = '';
  newPassword1Error = '';
  newPassword2Error = '';
  passwordMismatch = false;
  
  // Used to switch between different control groups
  invisibilityMap: InvisibilityMap = {
      menu: false,
      logIn: true,
      createAccount: true
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private authenticator: Authenticator) {
                
    this.newUsernameCtrl = new FormControl('', [Validators.required, ScmValidators.userName]);
    this.newEmailCtrl = new FormControl('', [Validators.required, ScmValidators.email]);
    this.newPassword1Ctrl = new FormControl('', [Validators.required, ScmValidators.password]);
    this.newPassword2Ctrl = new FormControl('', [Validators.required, 
      ScmValidators.verificaton(this.newPassword1Ctrl)]);
  
    this.accountGroup = this.formBuilder.group({
      newUsername: this.newUsernameCtrl,
      newEmail: this.newEmailCtrl,
      newPassword1: this.newPassword1Ctrl,
      newPassword2: this.newPassword2Ctrl
    });
  }

  errorOn(message: string) {
    this.errorMessage = message;
  }

  errorOff() {
    this.errorMessage = null;
  }

  makeVisible(controlGroup: string) {
    for (let ctrl in this.invisibilityMap) {
      this.invisibilityMap[ctrl] = ctrl != controlGroup;
    }
    // Login
    this.email = '';
    this.password = '';
    // New account
    this.newUsernameCtrl.setValue('');
    this.newEmailCtrl.setValue('');
    this.newPassword1Ctrl.setValue('');
    this.newPassword2Ctrl.setValue('');
    this.errorOff();
  }

  logIn() {
    this.authenticator.login(this.email, this.password)
    .subscribe(
      () => {
        this.navCtrl.pop();
      }, 
      (err: any) => {
        if (isDevMode()) {
          console.dir(err);
        }
        this.errorOn('Invalid credentials');
      }
    );
  }

  createAccount() {
    if (!this.accountGroup.valid) {
      return;
    }
    this.authenticator.createUser(this.newEmailCtrl.value, 
      this.newPassword1Ctrl.value, this.newUsernameCtrl.value)
      .subscribe(
      () => {
        this.makeVisible('logIn');
      }, 
      (err: any) => {
        if (isDevMode()) {
          console.dir(err);
        }
        this.errorOn('Could not create account');
      }
    );
  }

  loginGuest() {
    this.authenticator.loginGuest().subscribe(
      next => {
          this.navCtrl.pop();
      }, 
      err => {
        if (isDevMode()) {
          console.log(err);
        }
        this.errorOn('Could not log in as guest')
      }
    );
  }
}
