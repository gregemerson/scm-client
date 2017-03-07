export class AccountConstraints {
    static userNameMin = 5;
    static userNameMax = 20;
    static userNameRegEx = /^[A-Za-z0-9]*$/i;
    static passWordRegEx = /^[A-Za-z0-9?!@#$%^&*]*$/i;
    static passWordChars = 'letters, numerals, !, @, #, $, %, ^, & or *';
    static passWordMin = 8;
    static passWordMax = 16;
    static emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

export class ExerciseConstraints {
  readonly maxNameLength = 60;
  readonly maxCategoryLength = 100;
  readonly maxExerciseCommentsLength = 100;
  readonly maxExerciseSetCommentsLength = 200;
  readonly maxSharedExerciseComments = 100;
  readonly maxExercisesPerSet = 24;
  readonly maxEncodingLength = 600;
  readonly minRepeats = 1;
  readonly maxRepeats = 100;
  readonly minRepeatMeasures = 1;
}

export class SettingsConstraints {
  readonly minTempo = 30;
  readonly maxTempo = 220;
  readonly minStep = 0;
  readonly maxStep = 50;
  readonly minReps = 1;
  readonly maxReps = 100;
  readonly minDelay = 0;
  readonly maxDelay = 60;
}

export class Constraints {
  static ShareCheckInterval = 1000 * 60 * 10;
}