import {Injectable} from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Authenticator} from '../authenticator/authenticator';
import {Config} from '../../utilities/config'
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Observer, Subscriber, Subscription} from 'rxjs';
import 'rxjs/add/operator/map';

export type HttpServiceErrors = Array<HttpServiceError>;

@Injectable()
export class HttpService extends Observable<HttpServiceErrors> {
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
  static userSettings(userId: number): string {
    return this.addRoot('Clients/' + userId.toString() + '/userSettings');
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
    return this.addRoot('Clients/' + clientId.toString() + '/sharedExerciseSets');
  }

  private subscribers: {[key: string]: Subscriber<HttpServiceErrors>} = {};
  private static globalErrorCodes = {
    INVALID_TOKEN: 'Your session has expired, please re-log in.',
    AUTHORIZATION_REQUIRED: 'Unauthorized access attempt.'
  }

  constructor(private http: Http) {
    super((subscriber: Subscriber<HttpServiceErrors>) => {
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
      .map(response => this.processResponse(response))
      .catch((error: Response | any) => {
        return this.handleError(error);
      });
  }

  putPersistedObject(url: string,  data: any, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.put(url, data, requestOptions)
      .map(response => this.processResponse(response))
      .catch((error: Response | any) => {
        return this.handleError(error);
      });
  }
  
  getPersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.get(url, requestOptions)
      .map(response => this.processResponse(response))
      .catch((error: Response | any) => {
        return this.handleError(error);
      });
  }

  deletePersistedObject(url: string, requestOptions = Authenticator.newRequestOptions()): Observable<Object> {
    return this.http.delete(url, requestOptions)
      .map(response => this.processResponse(response))
      .catch((error: Response | any) => {
        return this.handleError(error);
      });
  }

  private processResponse(response: Response): HttpServiceError[] | PersistedObject {
    let obj: PersistedObject;
    let errors: HttpServiceError[] = [];
    try {
      obj = <Object>response.json();
      errors = this.parseForErrors(obj);
    }
    catch (err) {
        return new PersistedObject();
    }
    if (errors.length > 0) {
      throw errors;
    }
    return obj;
  }

  private handleError (error: Response | any) {
    this.notifySubscribers([{
      code: 'HTTP_ERROR',
      message: 'Server communication failure'
    }]);
    return Observable.throw('');
  }

  private notifySubscribers(errors: Array<HttpServiceError>) {
    console.log('-----subscribers-------');
    console.dir(this.subscribers);
    for (let id in this.subscribers) {
      this.subscribers[id].next(errors);
    }
  }

  // @todo Need to check for status 200
  private parseForErrors(obj: Object): Array<HttpServiceError> {
    let errors: Array<HttpServiceError> = [];
    if (!obj.hasOwnProperty('error')) {
      return <[HttpServiceError]>[];
    }
    let error: Object = obj['error'];
    if (error.hasOwnProperty('code')) {
      let code = error['code'];
      for (let globalCode in HttpService.globalErrorCodes) {
        if (globalCode == code) {
          errors.push({
              code: globalCode,
              message: HttpService.globalErrorCodes[code]
          });
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
        message: (<Object>error['error']).toString()
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

export class HttpServiceError {
  code: string;
  message : string;
}

export class PersistedObject extends Object {
}