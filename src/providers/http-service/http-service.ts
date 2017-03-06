import {Injectable, isDevMode} from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Authenticator} from '../authenticator/authenticator';
import {Config} from '../../utilities/config'
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Observer, Subscriber, Subscription} from 'rxjs';
import {ScmErrors, IScmError, ScmErrorList} from '../../utilities/errors';
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
      .map(response => this.processResponse(response))
      .catch((error: Response | any) => {
        return this.processCatch(error, url);
      });
  }

  putPersistedObject(url: string,  data: any, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.patch(url, data, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .map(response => {
        return this.processResponse(response);
      })
      .catch((error: Response | any) => {
        return this.processCatch(error, url);
      });
  }
  
  getPersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.get(url, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .map(response => {
        return this.processResponse(response);
      })
      .catch((error: Response | any) => {
        return this.processCatch(error, url);
      });
  }

  deletePersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.delete(url, requestOptions)
      .timeout(HttpService.timeout, ScmErrors.httpError)
      .catch((error: Response | any) => {
        return this.processCatch(error, url);
      });
  }

  private processCatch(error: Response | any, url: string): ErrorObservable {
    if (error instanceof Response) {
      let errors = <ScmErrorList>this.processResponse(error);
      return Observable.throw(this.errorsAsString(errors));
    }
    else {
      this.debug(error, 'xxxx', url);
      return Observable.throw('Could not communicate with server');
    }
  }

  errorsAsString(errors: ScmErrorList): string {
    let message = '';
    for (let error of errors) {
      message += (error.message + '\n');
    }
    return message;
  }

  private processResponse(response: Response): ScmErrorList | PersistedObject {
    let obj: PersistedObject;
    let errors: ScmErrorList = [];
    try {
      obj = <Object>response.json();
      errors = this.parseForErrors(obj);
    }
    catch (err) {
        return obj;
    }
    if (errors.length > 0) {
      return errors;
    }
    return obj;
  }

  private handleError (error: Response | any) {
    return Observable.throw(ScmErrors.httpError);
  }

  private notifySubscribers(errors: ScmErrorList) {
    for (let id in this.subscribers) {
      this.subscribers[id].next(errors);
    }
  }

  // @todo Need to check for status 200
  private parseForErrors(obj: Object): ScmErrorList {
    let errors: ScmErrorList = [];
    if (!obj.hasOwnProperty('error')) {
      return <[IScmError]>[];
    }
    let error: Object = obj['error'];
    if (error.hasOwnProperty('code')) {
      let code = error['code'];
      for (let globalCode in HttpService.AuthErrorCodes) {
        if (globalCode == code) {
          errors.push(ScmErrors.authRequired);
          this.notifySubscribers(errors);
          return errors;
        }
      }
    }
    // Do generic error parsing here
    if (error.hasOwnProperty('details') && error['details'].
        hasOwnProperty('messages')) {
      let messages = error['details']['messages'];
      for (let key in messages) {
        errors.push({
          code: key,
          message: messages[key]
        });
      }
    }
    else {
      errors.push({
        code: 'Unknown',
        message: error['message']
      });
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