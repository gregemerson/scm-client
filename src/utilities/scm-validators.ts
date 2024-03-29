import {FormControl, AbstractControl, ValidatorFn} from '@angular/forms';
import {AccountConstraints} from './constraints'

export class ScmValidators {

  static email(ctrl: AbstractControl): Object {
    if (ctrl.value.length == 0) {
      return {error: 'Email address is required'}
    }
    if (ctrl.value.length > 254) {
      return {error: 'Email address too long'}
    }
    return AccountConstraints.emailRegEx.test(ctrl.value) ? null : {error: 'Invalid email address'};
  }

  static userName(ctrl: AbstractControl): Object {
    if (ctrl.value.length == 0) {
      return {error: 'User name is required'}
    }
    let lengthError = ScmValidators.minMaxLengths('User name', 
      ctrl.value, AccountConstraints.userNameMin, AccountConstraints.userNameMax);
    if (lengthError) {
      return lengthError;
    }
    if (!AccountConstraints.userNameRegEx.test(ctrl.value)) {
      return {error: 'User name can only contain numerals and letters'};
    }
    return null;
  }

  static password(ctrl: AbstractControl): Object {
    if (ctrl.value.length == 0) {
      return {error: 'Password is required'}
    }
    let lengthError = ScmValidators.minMaxLengths('Password', ctrl.value, 
      AccountConstraints.passWordMin, AccountConstraints.passWordMax);
    if (lengthError) {
      return lengthError;
    }
    if (!AccountConstraints.passWordRegEx.test(ctrl.value)) {
      return {error: 'Password can only contain ' + AccountConstraints.passWordChars};
    }
    return null;
  }

  static verificaton(otherCtrl: AbstractControl) : (ctrl: AbstractControl) => Object {
    return (ctrl: AbstractControl) => {
      return otherCtrl.value == ctrl.value ? null : {error: "Values don't match"};
    }
  }

  private static checkForEmptyValue(ctrl: AbstractControl, emptyHandled: Object): boolean {
    if (!ctrl.value) {
      emptyHandled['validation'] = {error: 'Value not set'};
    }
    else if (ctrl.value.length == 0) {
      emptyHandled['validation'] = null;
    }
    return emptyHandled.hasOwnProperty('validation');
  }

  static minMaxLengths(what: string, value: string, min: number, max: number): Object {
    if (value.length < min || value.length > max) {
      return {error: what + ' must contain between ' +
         min + ' and ' + max + ' characters'};
    }
    return null;
  }
}