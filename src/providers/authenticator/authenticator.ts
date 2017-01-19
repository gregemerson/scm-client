import {Injectable, EventEmitter, Output} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';
import {ExerciseSets} from '../exercise-sets/exercise-sets';
import {HttpService} from '../http-service/http-service';
import {Observable} from 'rxjs/Observable';
import {Observer, Subscriber, Subscription} from "rxjs";
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import {BaseObservable} from '../../utilities/base-observable';
import {Config} from '../../utilities/config';
import {ScmErrors} from '../../utilities/errors'

@Injectable()
export class Authenticator {
  private static tokenKey = 'auth_token';
  private static uidKey = 'uid';
  private userLoadFilter = '?filter[include]=userSettings&filter[include]=exerciseSets&filter[include]=subscription';
  private _user: IAuthUser = null;
  errors: Object;

  constructor(private httpService: HttpService) {
  }

  onUserLoaded: (user: IAuthUser) => void;
  onUserUnloaded: () => void;

  get user(): IAuthUser {
    return this._user;
  }

  get isGuest(): boolean {
    return this.user.id == Config.guestUid;
  }

  private saveUserSettings(): Observable<Object> {
    return this.httpService.putPersistedObject(HttpService.
      userSettings(this.user.id), this.user.settings);
  }

  unsetUser() {
    this.setUser(null);
  }
  
  private setUser(user: IAuthUser) {
    if (this._user != null && this._user.id == user.id) {
      return;
    }
    if (user == null) {
      this.token = null;
      this.uid = null;
      if (this.onUserUnloaded) {
        this.onUserUnloaded();
      }
    }
    else {
      if (this.onUserLoaded) {
        this.onUserLoaded(user);
      }
    }
    this._user = user;
  }

  private get token(): string {
    return localStorage.getItem(Authenticator.tokenKey);
  }

  private set token(token: string ) {
    if (token == null) {
      localStorage.removeItem(Authenticator.tokenKey);
    }
    else {
      localStorage.setItem(Authenticator.tokenKey, token);
    }
  }

  private get uid(): number {
    let id = localStorage.getItem(Authenticator.uidKey);
    if (id != null) {
      return parseInt(id);
    }
    return null;
  }

  private set uid(id: number) {
    if (id == null) {
      localStorage.removeItem(Authenticator.uidKey);
    }
    else {
      localStorage.setItem(Authenticator.uidKey, id.toString());
    }
  }

  static newRequestOptions(): RequestOptionsArgs {
    return {
      headers: new Headers({
        'Authorization': localStorage.getItem(Authenticator.tokenKey),
        'Content-Type': 'application/json'
      })
    };
  }

  createUser(email: string, password: string, username: string): Observable<Object> {
    return this.httpService.postPersistedObject(HttpService.newUser, {
      username: username,
      password: password,
      email: email
    });
  }

  loginGuest(): Observable<IAuthUser> {
    this.token = Config.guestToken;
    this.uid = Config.guestUid;
    return this.loadUser();
  }

  tryPreviousLogin(): Observable<IAuthUser> {
    console.log('token is ' + this.token + ' uid is ' + this.uid);
    let hasLocalAuthData = (this.token != null && this.uid != null);
    if (!hasLocalAuthData) {
      return Observable.throw(ScmErrors.noLocalCredentials);
    }
    return this.loadUser();
  }

  login(email: String, password: String): Observable<IAuthUser> {
    return this.httpService.postPersistedObject(HttpService.ClientLogin, {
      email: email,
      password: password
    }).flatMap((loginData: Object, index: number) => {
      this.token = loginData['id'];
      this.uid = loginData['userId'];
      return this.loadUser();
    }).catch((err: any) => {
      return Observable.throw(ScmErrors.loginError);
    });
  }

  loadUser(): Observable<IAuthUser> {
    let url = HttpService.ClientsCollection + localStorage.getItem(
      Authenticator.uidKey) + this.userLoadFilter;
    return this.httpService.getPersistedObject(url).
      flatMap((user: Object, index: number) => {
        this.setUser(new AuthUser(user));
        return Observable.of(this.user);
      });
  }

  private createError (error: Object):  AuthErrors {
    let authErrors = new AuthErrors();
    if (error.hasOwnProperty('details') && error['details'].
        hasOwnProperty('messages')) {
      let messages = error['details']['messages'];
      for (let key in messages) {
        if (messages[key].length > 0) {
          authErrors.add(key, messages[key][0]);
        }
      }
    }
    else {
      authErrors.add('error', error['message']);
    }
    return authErrors;
  }

  logout(): Observable<void> {
    let options = Authenticator.newRequestOptions();
    let uid = this.uid;
    this.setUser(null);
    if (uid == Config.guestUid) {
      return Observable.of(null);
    } 
    return this.httpService.postPersistedObject(HttpService.logout(), {}, options)
    .map((res : any) => {
      return null;
    });
  }

  saveSettings(): Observable<void> {
    return this.httpService.putPersistedObject(
      HttpService.userSettings(this.user.id), this.user.settings)
      .map(result => null);
  }
}

export class AuthErrors {
  private _subjects: Array<string> = [];
  private _messages: Array<string> = [];
  private _count = 0;
  constructor() {
  }

  add(subject: string, message: string) {
    this._subjects.push(subject);
    this._messages.push(message);
  }

  get count(): number {
    return this._subjects.length;
  }

  subject(index: number): string {
    return this._subjects[index];
  }

  message(index: number): string {
    return this._messages[index];
  }
}

export interface IAuthUser {
  settings: IAuthUserSettings;
  id: number;
  username: string;
  membershipEnds: Date;
  email: string;
  emailVerified: boolean;
  rawExerciseSets: Array<Object>;
  subscription: Object;
}

class AuthUser implements IAuthUser {
  settings: IAuthUserSettings;
  id: number;
  username: string;
  membershipEnds: Date;
  email: string;
  emailVerified: boolean;
  rawExerciseSets: Array<Object>;
  subscription: Object;
  
  constructor(rawUser: Object) {
    Object.assign(this, rawUser);
    this.settings = new AuthUserSettings(rawUser['userSettings']);
    this.membershipEnds = new Date(rawUser['membershipExpiry']);
    this.rawExerciseSets = rawUser['exerciseSets'];
    this.subscription = rawUser['subscription'];
  }
}

export interface IAuthUserSettings {
  currentExerciseSet: number;
  numberOfRepititions: number;
  secondsBeforeStart: number;
  minTempo: number;
  maxTempo: number;
  tempoStep: number;
  id: number;
}

class AuthUserSettings implements IAuthUserSettings {
  currentExerciseSet: number;
  numberOfRepititions: number;
  secondsBeforeStart: number;
  minTempo: number;
  maxTempo: number;
  tempoStep: number;
  id: number;

  constructor(rawSettings: Object) {
    Object.assign(this, rawSettings);
  }
}

class LoginSubscription extends Subscription {
  constructor(unsubsribe: (id: string) => void, id: string) {
    super(() => {
      unsubsribe(id);
    });
  } 
}
