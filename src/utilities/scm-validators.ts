import {FormControl, AbstractControl, ValidatorFn} from '@angular/forms';

export class ScmValidators {

  readonly minUserNameLength = 5;
  readonly maxUserNameLength = 20;
  readonly maxEmailLength = 254;
  readonly minPasswordLength = 8;
  readonly maxPasswordLength = 12;

  static email(ctrl: AbstractControl): Object {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (ctrl.value.length == 0) {
      return {error: 'Email address is required'}
    }
    if (ctrl.value.length > 254) {
      return {error: 'Email address too long'}
    }
    return regex.test(ctrl.value) ? null : {error: 'Invalid email address'};
  }

  static userName(ctrl: AbstractControl): Object {
    if (ctrl.value.length == 0) {
      return {error: 'User name is required'}
    }
    const regex = /^[a-z0-9]+$/i;
    let lengthError = ScmValidators.minMaxLengths('User name', ctrl.value, 5, 20);
    if (lengthError) {
      return lengthError;
    }
    if (!regex.test(ctrl.value)) {
      return {error: 'User name can only contain numerals and letters'};
    }
    return null;
  }

  static password(ctrl: AbstractControl): Object {
    if (ctrl.value.length == 0) {
      return {error: 'Password is required'}
    }
    const regex = /^[a-z0-9!@#$%^&*]+$/i;
    let lengthError = ScmValidators.minMaxLengths('Password', ctrl.value, 8, 12);
    if (lengthError) {
      return lengthError;
    }
    if (!regex.test(ctrl.value)) {
      return {error: 'Password can only contain numerals, letters, !, @, #, $, %, ^, & or *'};
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