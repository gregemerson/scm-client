import {Injectable, isDevMode} from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Authenticator} from '../authenticator/authenticator';
import {Config} from '../../utilities/config'
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Observer, Subscriber, Subscription} from 'rxjs';
import {ScmErrors, ScmError, ScmErrorList} from '../../utilities/errors';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService extends Observable<ScmErrorList> {
  static timeout = 12000;
  static get ClientsCollection(): string {return this.addRoot('Clients/')}
  static get ClientLogin(): string {return this.addRoot('Clients/login')}
  static get newUser(): string {return this.addRoot('Clients/createNewUser')}
  static get ExerciseSetCollection(): string {return this.addRoot('ExerciseSets/');}
  static get ExerciseCollection(): string {return this.addRoot('Exercises/');}
  
  static exerciseSetExercises(exerciseSetId: number): string {
    return this.addRoot('ExerciseSets/' + exerciseSetId.toString() + '/exercises');
  }
  static createdExercises(exerciseSetId: number): string {
    return this.addRoot('ExerciseSets/' + exerciseSetId.toString() + '/createdExercises');
  }
  static exercise(exerciseId: number): string {
    return this.addRoot('Exercises/' + exerciseId.toString());
  }
  static userSettings(settingsId: number): string {
    return this.addRoot('UserSettings/' + settingsId.toString());
  }
  static exerciseSetExercise(exerciseSetId: number, exerciseId: number): string {
    return this.addRoot('ExerciseSets/' + exerciseSetId.toString() + '/exercises/' + exerciseId.toString());
  }
  static clientExerciseSets(clientId: number): string {
    return this.addRoot('Clients/' + clientId.toString() + '/exerciseSets');
  }
  static clientExerciseSet(clientId: number, exerciseSetId: number): string {
    return this.addRoot('Clients/' + clientId.toString() + '/exerciseSets/' + exerciseSetId);
  }
  static logout(): string {
    return this.addRoot('Clients/logout');
  }
  static removeExerciseSet(clientId: number, exerciseSetId: number): string {
    return this.addRoot('Clients/' + clientId.toString() + '/exerciseSets/rel/' + exerciseSetId);
  }
  static shareExerciseSet(clientId: number): string {
    return this.addRoot('Clients/' + clientId.toString() + '/shareExerciseSet');
  }
  static shareLists(clientId: number): string {
    return this.addRoot('Clients/' + clientId.toString() + '/exerciseSetSharing');
  }
  static receiveExerciseSet(clientId: number, exerciseSetId: number): string {
    return this.addRoot('Clients/' + clientId + '/receiveExerciseSet/' + exerciseSetId);
  }
  static deleteShare(shareId: number): string {
    return this.addRoot('SharedExerciseSets/' + shareId);
  }

  private debug(err: any, op: string, url: string) {
    if (isDevMode()) {
      console.log(op + ': ' + url);
      console.dir(err);
    }
  }

  private subscribers: {[key: string]: Subscriber<ScmErrorList>} = {};
  private static AuthErrorCodes = {
    INVALID_TOKEN: 'Your session has expired, please re-log in.',
    AUTHORIZATION_REQUIRED: 'Unauthorized access attempt.'
  }

  constructor(private http: Http) {
    super((subscriber: Subscriber<ScmErrorList>) => {
      let key = Math.random().toString();
      this.subscribers[key] = subscriber;
      return new HttpServiceErrorSubscription(() => {
        delete this.subscribers[key];
      });
    });
  }

  private static addRoot(relUrl: string): string {
    return Config.apiRoot + relUrl;
  }

  postPersistedObject(url: string,  data: any, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.post(url, data, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .flatMap((response) => {
        console.log('response is ')
        console.dir(response)
        return this.processResponse(response);
      })
      .catch((err) => {
        console.log('this was caught ' + (err instanceof ErrorObservable))
        console.dir (err)
        if (typeof err == 'string') {
          return Observable.throw(err);
        }
        if (err instanceof ScmError) {
          return Observable.throw(err.message);
        }
        if (err instanceof Response) {
          let processed = this.processResponse(err);
          if (processed instanceof ErrorObservable) {
            return processed;
          }
          return Observable.throw('Could not communicate with server');
        }
        return Observable.throw(err.toString());
      });
  }

  putPersistedObject(url: string,  data: any, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.patch(url, data, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .flatMap(response => {
        return this.processResponse(response);
      })
      .catch((err) => {
        return Observable.throw('error caught' + err);
      });
  }
  
  getPersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.get(url, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .flatMap(response => {
        return this.processResponse(response);
      })
      .catch((err) => {
        return Observable.throw('error caught' + err);
      });
  }

  deletePersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.delete(url, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .flatMap(response => {
        return this.processResponse(response);
      })
      .catch((err) => {
        return Observable.throw('error caught  ' + err);
      });
  }
/*
  private processCatch(error: any, url: string): ErrorObservable {
    //@todo logging
    return Observable.throw('Could not communicate with server');
  }
*/
  errorsAsString(errors: ScmErrorList): string {
    let message = '';
    for (let error of errors) {
      message += (error.message + '\n');
    }
    return message;
  }

  private processResponse(response: Response): ErrorObservable | Observable<Object> {
    let obj: Object = {};
    let errors: ScmErrorList = [];
    try {
      obj = <Object>response.json();
      errors = this.parseForErrors(obj);
    }
    catch (err) {
    }
    console.log('errors found ' + this.errorsAsString(errors))
    console.dir(errors)
    if (errors.length > 0) {
      return Observable.throw(this.errorsAsString(errors));
    }
    return Observable.of(obj);
  }

  private notifySubscribers(errors: ScmErrorList) {
    for (let id in this.subscribers) {
      this.subscribers[id].next(errors);
    }
  }

  private parseForErrors(obj: Object): ScmErrorList {
    let errors: ScmErrorList = new ScmErrorList();
    if (!obj.hasOwnProperty('error')) {
      return errors;
    }
    let error: Object = obj['error'];
    if (error.hasOwnProperty('code')) {
      for (let globalCode in HttpService.AuthErrorCodes) {
        if (globalCode == error['code']) {
          errors.push(ScmErrors.authRequired);
          this.notifySubscribers(errors);
          return errors;
        }
      }
    }
    // Do generic error parsing
    if (error.hasOwnProperty('details') && error['details'].
        hasOwnProperty('messages')) {
      let messages = error['details']['messages'];
      for (let key in messages) {
        errors.push(new ScmError(key, messages[key]));
      }
    }
    else {
      errors.push(new ScmError('Unknown', error['message']));
    }
    return errors;
  }
}

class HttpServiceErrorSubscription extends Subscription {
  constructor(unsubsribe: () => void) {
    super(() => {
      unsubsribe();
    });
  } 
}

export class PersistedObject extends Object {
}