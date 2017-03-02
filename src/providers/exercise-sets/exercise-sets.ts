import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import {Authenticator, IAuthUser} from '../../providers/authenticator/authenticator';
import {HttpService} from '../../providers/http-service/http-service';
import {Observable} from 'rxjs/Observable';
import {Observer, Subject} from "rxjs";
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Config} from '../../utilities/config';
import {Constraints, ExerciseConstraints} from '../../utilities/constraints';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

export enum ShareListType {
  Shared,
  Received
}

@Injectable()
export class ExerciseSets {
  ready = false;
  private onReady = new Subject<void>();
  currentExerciseSet: IExerciseSet;
  remainingExerciseSetCount: number;
  private user: IAuthUser;
  items: Array<IExerciseSet> = [];
  shared: Array<ISharedExerciseSet> = [];
  received: Array<ISharedExerciseSet> = [];
  
  constructor(private httpService: HttpService) {
  }

  unload() {
    this.currentExerciseSet = null;
    this.user = null;
    this.items = null;
  }

  notifyOnReady(onReady: () => void) {
    if (this.ready) {
      onReady();
    }
    else {
      this.onReady.subscribe({
        next: onReady
      });
    }
  }

  private setReady() {
    this.ready = true;
    this.onReady.next();
    this.onReady = null;
  }

  load(user: IAuthUser): Observable<void> {
    this.user = user;
    this.currentExerciseSet = null;
    let currentId = user.settings.currentExerciseSet;
    let numberPrivateExerciseSets = 0;
    for (let key in user.rawExerciseSets) {
      numberPrivateExerciseSets += user.rawExerciseSets[key]['public'] ? 0 : 1;
      let newSet = new ExerciseSet(this.httpService, user,
        user.rawExerciseSets[key]);
      this.items.push(newSet);
      if (newSet.id == user.settings.currentExerciseSet) {
        this.currentExerciseSet = newSet;
      }
    }
    this.remainingExerciseSetCount = user.
      subscription['maxExerciseSets'] - numberPrivateExerciseSets;
    if (this.currentExerciseSet == null) {
      this.setReady();
      return Observable.of(null);
    }
    else {
      return (<ExerciseSet>this.currentExerciseSet).
        loadExercises(this.httpService, user)
        .map(() => {
          this.setReady();
        });
    }
  }

  loadShareLists(): Observable<void> {
    return this.httpService.getPersistedObject(HttpService.shareLists(this.user.id, false))
    .map((result) => {
      // Load shared and received ExerciseSets
      let sharedList = result['lists']['shared'];
      let receivedList = result['lists']['received'];
      this.shared.length = 0;
      for (let key in sharedList) {
        this.shared.push(<ISharedExerciseSet>sharedList[key]);
      }
      this.received.length = 0;
      for (let key in receivedList) {
        this.received.push(<ISharedExerciseSet>receivedList[key]);
      }
    });
  }

  pollExerciseSetSharing() {
    Observable.interval(Constraints.ShareCheckInterval).
      subscribe((value) => this.loadShareLists());
  }

  newExerciseSet(initializer: Object): Observable<number> {
    return this.httpService.postPersistedObject(
      HttpService.clientExerciseSets(this.user.id), initializer)
      .map(result => {
        let newSet = new ExerciseSet(this.httpService, this.user, result);
        this.items.push(newSet);
        this.remainingExerciseSetCount--;
        return newSet.id;
      });
  }

  updateCurrentExerciseSetMetadata(metadata: Object): Observable<Object> {
    let fields = ['name', 'category', 'comments']
    return this.httpService.putPersistedObject(HttpService.clientExerciseSet(
      this.user.id, this.currentExerciseSet.id), metadata).map(result => {
        for (let field of fields) {
          if (result.hasOwnProperty(field)) {
            this.currentExerciseSet[field] = result[field];
          }
        }
        return result;
      });
  }

  removeCurrentExerciseSet() {
    return this.httpService.deletePersistedObject(
        HttpService.removeExerciseSet(this.user.id, this.currentExerciseSet.id))
        .flatMap((result, index) => {
          this.remainingExerciseSetCount++;
          let indexToDelete: number;
          let newExerciseSetId = null;
          for (let index = 0; index < this.items.length; index++) {
            if (this.currentExerciseSet.id == this.items[index].id) {
              this.items = this.items.splice(index, 1);
              this.currentExerciseSet = null;
              if (this.items.length > 0) {
                newExerciseSetId = this.items[0].id;
              }
            }
          }
          return this.setCurrentExerciseSet(newExerciseSetId);
        });
  }

  public receiveExerciseSet(exerciseSetId: number) {
    return this.httpService.getPersistedObject(HttpService.receiveExerciseSet(this.user.id, exerciseSetId))
    .map((receivedExerciseSet) => {
      this.items.push(new ExerciseSet(this.httpService, this.user, receivedExerciseSet));
    })
  }
  
  public setCurrentExerciseSet(exerciseSetId: number): Observable<void> {
    if (this.currentExerciseSet && this.currentExerciseSet.id == exerciseSetId) {
      return Observable.of(null);
    }
    this.user.settings.currentExerciseSet = exerciseSetId;
    if (this.currentExerciseSet != null) {
      (<ExerciseSet>this.currentExerciseSet).unloadExercises();
    }
    this.currentExerciseSet = this.findExerciseSet(exerciseSetId);
    return this.httpService.putPersistedObject(
      HttpService.userSettings(this.user.id), 
        {
          id: this.user.settings.id,
          currentExerciseSet: exerciseSetId
        }).flatMap((obj: Object) => {
          if (exerciseSetId == null) {
            return Observable.of(null);
          }
          return (<ExerciseSet>this.currentExerciseSet).
            loadExercises(this.httpService, this.user);
      });
  }

  private findExerciseSet(exerciseSetId: number): ExerciseSet {
    for (let exerciseSet of this.items) {
      if (exerciseSet.id == exerciseSetId) {
        return <ExerciseSet>exerciseSet;
      }
    }
    return null;
  }
}

export interface ISharedExerciseSet {
  id: number;
  username: string;
  public: boolean;
  name: string;
  category: string;
  comments: string;
}

export interface IExerciseSet {
  id: number;
  currentExercise: IExercise;
  nextExercise: IExercise;
  isOwner: boolean;
  name: string;
  category: string;
  comments: string;
  readonly canAdd: boolean;
  next(): IExercise;
  initIterator(): void;
  newExercise(exerciseInitializer: Object): Observable<number>;
  save(exercise: IExercise, fieldsToSave: string []): Observable<Object>;
  delete(exercise: IExercise): Observable<Object>;
  shareExerciseSet(initializer: Object): Observable<Object>;
}

class ExerciseSet implements IExerciseSet {
  comments: string;
  currentExercise: IExercise;
  nextExercise: IExercise;
  name: string;
  category: string;
  id: number;
  private constraints = new ExerciseConstraints();
  private nextIndex: number = -1;
  private exercises: {[key: number]: Exercise} = {};
  private disabledExercises:  {[key: number]: boolean} = {};
  private exerciseOrdering: Array<number>;
  private filter = '?filter[include][exercises]';
  private _exercisesLoaded = false;
  private ignoreDisabled: boolean;
  private _isOwner = false;

  constructor(private httpService: HttpService, 
    private user: IAuthUser, 
    rawExerciseSet: Object) {
    this.name = rawExerciseSet['name'];
    this.id = rawExerciseSet['id'];
    this.category = rawExerciseSet['category'];
    this.comments = rawExerciseSet['comments'];
    this.exerciseOrdering = rawExerciseSet['exerciseOrdering'];
    for (let exerciseId of rawExerciseSet['disabledExercises']) {
      this.disabledExercises[<number>exerciseId] = true;
    }
    this._isOwner = user.id == rawExerciseSet['ownerId'];
  }

  get canAdd() {
    return Object.keys(this.exercises).length < 
      this.constraints.maxExercisesPerSet;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  shareExerciseSet(initializer: Object): Observable<Object> {
    initializer['exerciseSetId'] = this.id;
    return this.httpService.postPersistedObject(
      HttpService.shareExerciseSet(this.user.id), initializer);
  }

  newExercise(initializer: Object): Observable<number> {
    initializer['exerciseSetId'] = this.id;
    initializer['created'] = new Date();
    initializer['ownerId'] = this.user.id;
    return this.httpService.postPersistedObject(
      HttpService.createdExercises(this.id), initializer)
      .map(result => {
        let exercise = result['exercise'];
        this.exercises[exercise['id']] = new Exercise(exercise);
        this.exerciseOrdering.push(exercise['id']);
        return exercise['id'];
      });
  }

  save(exercise: IExercise, fieldsToSave: string[]): Observable<Object> {
    let newData = new Object();
    newData['id'] = exercise.id;
    for (let field of fieldsToSave) {
      if (field == 'notation') {
        newData[field] = Encoding.encode(exercise.display);
      }
      else {
        newData[field] = exercise[field];
      }
    }
    return this.httpService.putPersistedObject(
      HttpService.exercise(exercise.id), newData);
  }

  delete(exercise: IExercise): Observable<Object> {
    let url = HttpService.exercise(exercise.id);
    return this.httpService.deletePersistedObject(url);
  }

  disableExercise(exerciseId: number) {
    this.disabledExercises[exerciseId] = true;
  }

  enableExercise(exerciseId: number) {
    delete this.disabledExercises[exerciseId];
  }

  get exercisesLoaded() {
    return this._exercisesLoaded;
  }

  loadExercises(httpService: HttpService, user: IAuthUser): Observable<void> {
    return httpService.getPersistedObject(HttpService.ExerciseSetCollection + 
      this.id + this.filter, Authenticator.newRequestOptions())
    .map(exerciseSet => {
      let exercises = <Array<Object>>exerciseSet['exercises'];
      for (let exercise of exercises) {
        this.exercises[exercise['id']] = new Exercise(exercise);
      }
      this._exercisesLoaded = true;
    });
  }

  unloadExercises() {
    for (let key in this.exerciseOrdering) {
      delete this.exercises[key];
    }
    this._exercisesLoaded = false;
  }

  next() : IExercise {
    this.currentExercise = this.nextExercise;
    if (this.currentExercise != null) {
      this.setupNextExercise();
    }
    return this.currentExercise;
  }

  initIterator (ignoreDisabled = true) {
    this.ignoreDisabled = ignoreDisabled;
    this.currentExercise = null;
    this.nextIndex = -1;
    this.setupNextExercise();
  }

  private setupNextExercise() {
    this.nextIndex = this.getNextEnabledIndex(this.nextIndex);
    this.nextExercise = (this.nextIndex >= 0) ? 
      this.getExerciseByIndex(this.nextIndex) : null;
  }

  private getNextEnabledIndex(index: number): number {
    let nextIdx = index + 1;
    while (nextIdx < this.exerciseOrdering.length) {
      if (this.ignoreDisabled) {
        return nextIdx;
      }
      if (!this.disabledExercises.hasOwnProperty(nextIdx)) {
        return nextIdx;
      }
      nextIdx++;
    }
    return -1;
  }

  private getExerciseByIndex(index: number) {
    return this.exercises[this.exerciseOrdering[index]];
  }
}

export interface IExercise {
  id: number; 
  name: string;
  category: string;
  display: ExerciseElements;
  comments: string;
  getNumberOfBeats(): number;
}

// beats per measure must be bounded because of count in recording constraints
class Exercise implements IExercise {
  private _display: ExerciseElements;
  private _id: number;
  public name: string;
  public category: string;
  public comments: string;

  constructor(rawExercise: Object) {
    this._display = <ExerciseElements>Encoding.decode(rawExercise['notation']);
    this._id = rawExercise['id'];
    this.name = rawExercise['name'];
    this.category = rawExercise['category'];
    if (rawExercise.hasOwnProperty('comments')) {
      this.comments = rawExercise['comments'];
    }
  }

  get id(): number {
    return this._id;
  }

  get display(): ExerciseElements {
    return this._display;
  }

  getNumberOfBeats(): number {
    let numBeats = 0;
    let groupCount = 0;
    let measureBeats = [];
    let measureIndex = 0;
    // Skip first measure bar
    for (let i = 0; i < this.display.length; i++) {
      let element = this.display.getElement(i);
      if (element instanceof GroupSeparator) {
        groupCount++;
      }
      if (element instanceof MeasureSeparator) {
        measureBeats.push(groupCount);
        numBeats += groupCount;
        groupCount = 0;
      }
      if (element instanceof Repeat) {
        let last = measureBeats.length - 1;
        let repeat = <Repeat>element;
        let beatTotal = 0;
        for (let j = last; j >= last - repeat.numMeasures; --j) {
          beatTotal += measureBeats[j];
        }
        numBeats += beatTotal * repeat.numRepeats;
      }
    }
    return numBeats;
  }
}

export class ExerciseElements {
  private _cursorPosition;
  private _onCursorChange: () => void = null;
  private notationSnapshot: string;
  cursorChanged: () => void;

  constructor(private elements: ExerciseElement[]) {
    this.resetCursor();
  }

  encode() {
    return Encoding.encode(this.elements);
  }

  takeSnapShot() {
    this.notationSnapshot = Encoding.encode(this.elements);
  }

  get isDirty() {
    let newEncoding = Encoding.encode(this);
    return this.notationSnapshot != newEncoding;
  }

  get snapShot(): string {
    return this.snapShot;
  }

  revertToSnapShot() {
    this.elements = <ExerciseElement[]>Encoding.
      decode(this.notationSnapshot, true);
  }

  deleteSnapShot() {
    this.notationSnapshot = null;
  }

  get encoded(): string {
    return Encoding.encode(this.elements);
  }

  get cursorAtEnd(): boolean {
    return this._cursorPosition == this.length;
  }

  get length(): number {
    return this.elements.length;
  }

  getElement(index: number): ExerciseElement {
    return this.elements[index];
  }

  measuresBeforeCursor(): number {
    let count = 0;
    for (let i = this.cursorPosition - 1; i > 0; i--) {
      if (this.elements[i] instanceof Repeat) {
        count--;
        break;
      }
      if (this.elements[i] instanceof MeasureSeparator) {
        count++;
      }
    }
    return count;
  }

  elementAtCursorIs(type: any): boolean {
    if (this.cursorPosition == 0) {
      return false;
    }
    return this.elementAtCursor() instanceof type;
  }

  elementAfterCursorIs(type: any): boolean {
    if (this.cursorPosition == this.length) {
      return false;
    }
    return this.getElement(this.cursorPosition) instanceof type;
  }

  // At the zero position, there is nothing at (before) the cursor
  // otherwise test the character before the cursor.
  elementAtCursor(): ExerciseElement {
    if (this.cursorPosition == 0) {
      return null;
    }
    return this.elements[this.cursorPosition - 1];
  }

  resetCursor() {
    this.cursorPosition = 0;
  }

  // Delete the element behind the cursor
  deleteAtCursor() {
    if (this.cursorPosition == 0) {
      return;
    }
    this.elements.splice(this.cursorPosition - 1, 1);
    this.cursorBack();
    if (this.elementAtCursorIs(Repeat)) {
      this.deleteAtCursor();
    }
  }

  // Insert an element in front of the cursor past the new element.
  insertAtCursor(element: ExerciseElement) {
    let elementAfterCursor = this.cursorPosition < this.length ? 
      this.getElement(this.cursorPosition) : '';
    if (element instanceof GroupSeparator)  {
      if (!this.elementAtCursorIs(Stroke))  
      if (!(this.cursorAtEnd || this.elementAfterCursorIs(Stroke))) {
        return; 
      }
    }
    this.elements.splice(this.cursorPosition, 0, element);
    this.cursorForward();
    if (element instanceof Repeat) {
      this.insertAtCursor(new MeasureSeparator());     
    }
    // See if we are substituting measure for group separator
    if (element instanceof MeasureSeparator && 
      this.cursorPosition < this.length &&
      this.getElement(this.cursorPosition) instanceof GroupSeparator) {
        this.cursorForward();
        this.deleteAtCursor();
      }
  }

  cursorForward() {
    this.cursorPosition = Math.min(
      this.length, this.cursorPosition + 1);
  }

  cursorBack() {
    this.cursorPosition = Math.max(
      0, this._cursorPosition - 1);
  }

  set cursorPosition(position: number) {
    this._cursorPosition = position;
    if (this.cursorChanged) {
      this.cursorChanged();
    }
  }

  get cursorPosition(): number {
    return this._cursorPosition;
  }

  longestStrokeGroup(): number {
    let currentGroupCount = 0;
    let inGroup = false;
    let groupCounts: number[] = [];
    for (let element of this.elements) {
      if (element instanceof Stroke) {
        if (!inGroup) {
          inGroup = true;
          groupCounts.push(1);
        }
        else {
          groupCounts[groupCounts.length - 1] += 1;
        }
      }
      else {
        inGroup = false;
      }
    }
    return Math.max.apply(null, groupCounts);
  }
}

export class Encoding {
  static right = 'r';
  static left = 'l';
  static both = 'b';
  static accectedRight = 'R';
  static accentedLeft = 'L';
  static accentedBoth = 'B';
  static rest = '-';
  static measureSeparator = '|';
  static groupSeparator = ' ';
  static exerciseStart = '#';
  static graceStart = '[';
  static graceEnd = ']';
  static noGrace = 0;
  static flam = 1;
  static drag = 2;
  static ruff = 3;
  static buzz = 4;
  // Keep this up-to-date!!!
  static graceCount = 5;
  static repeatStart = '<';
  static repeatEnd = '>';
  static repeatDivider = ':';
  static strokes = 'rlbRLB-';
  static graces = '123z';

  private static exerciseElements: ExerciseElement[];

  static encode(elements: ExerciseElements | ExerciseElement[]): string {
    let encoding = Encoding.exerciseStart;
    for (let i = 0; i < elements.length; i++) {
      if (elements instanceof ExerciseElements) {
        encoding += elements.getElement(i).encoding;
      }
      else {
        encoding += elements[i].encoding;
      }
    }
    return encoding;
  }

  static decode(encoded: string, asArray = false): ExerciseElements | ExerciseElement[] {
    let elements: Array<ExerciseElement> = [];
    let beginExercise = false;
    let encodedIndex = 0;
    if (Encoding.exerciseElements == null) {
      Encoding.exerciseElements = [
          new Repeat(),
          new Stroke(),
          new GroupSeparator(),
          new MeasureSeparator()
        ];
    }

    while (encodedIndex < encoded.length) {
      // Move to the playable portion of the display
      if (!beginExercise) {
        if (encoded[encodedIndex] == this.exerciseStart) {
          beginExercise = true;
        }
        encodedIndex++;
        continue;
      }
      let element: ExerciseElement = null;
      for (let elementObj of this.exerciseElements) {
        element = elementObj.tryParse(encoded, encodedIndex);
        if (element != null) {
          elements.push(element);
          break;
        }
      }
      if (element == null) {
        throw encoded[encodedIndex] + 
          ` isn't the start of an exercise element`;
      }
      encodedIndex += element.length;
    }
    if (asArray) {
      return elements;
    }
    return new ExerciseElements(elements);
  }

  static getMeasureCount(encoding: string) {
    if (encoding.length == 0) {
      return 0;
    }
    let count = 1;
    for (let i = 0; i < encoding.length; i++) {
      if (encoding[i] == Encoding.measureSeparator) {
        count++;
      }
    }
    return count;
  }

  static satisfiesBeatsPerMeasureConstraint(encoding: string): boolean {
    // @todo
    return false;
  }
}

export class ExerciseElement {
  private _length = 1;

  get length(): number {
    return this._length;
  }

  protected setLength(l: number) {
    this._length = l;
  }

  tryParse(encoded: string, index: number): ExerciseElement {
    return null;
  }
  
  get encoding(): string {
    return '';
  }
}

export class MeasureSeparator extends ExerciseElement {
  tryParse(encoding: string, index: number): MeasureSeparator {
    if (encoding[index] == Encoding.measureSeparator) {
      return new MeasureSeparator();
    }
    return null;
  }

  get encoding(): string {
    return Encoding.measureSeparator;
  }
}

export class GroupSeparator extends ExerciseElement {
  tryParse(encoding: string, index: number): GroupSeparator {
    if (encoding[index] == Encoding.groupSeparator) {
      return new GroupSeparator();
    }
    return null;
  }
  
  get encoding(): string {
    return Encoding.groupSeparator;
  }
}

export class Repeat extends ExerciseElement {
  numMeasures: number;
  numRepeats: number;

  tryParse(encoding: string, index: number): Repeat {
    if (encoding[index] == Encoding.repeatStart) {
      let start = index;
      let end = encoding.indexOf(Encoding.repeatEnd, index);
      let components = encoding.substring(start + 1, end).
          split(Encoding.repeatDivider);
      let repeat = new Repeat();
      repeat.numMeasures = parseInt(components[0]);
      repeat.numRepeats = parseInt(components[1]);
      repeat.setLength(end - start + 1);
      return repeat;
    }
    return null;
  }

  get encoding(): string {
    return Encoding.repeatStart + this.numMeasures + 
          Encoding.repeatDivider + this.numRepeats + Encoding.repeatEnd;
  }
}

export class Stroke extends ExerciseElement {
    hand: string;
    accented: boolean;
    grace: number;


    tryParse(encoding: string, index: number): Stroke {
      let char = encoding[index];
      if (!Encoding.strokes.includes(char) && (char != Encoding.graceStart)) {
        return null;
      }
      let strokeIndex = index;
      let grace = Encoding.noGrace;
      if (char == Encoding.graceStart) {
        grace = parseInt(encoding[strokeIndex + 1]);
        strokeIndex += 3;
      }
      let encodedStroke = encoding[strokeIndex]; 
      let upperStroke = encodedStroke.toUpperCase();
      let stroke = new Stroke();
      stroke.accented = encodedStroke == upperStroke && encodedStroke != Encoding.rest;
      stroke.grace = grace;
      stroke.hand = upperStroke;
      strokeIndex++;
      stroke.setLength(strokeIndex - index);
      return stroke;
    }

    cycleGrace() {
      this.grace = (this.grace + 1)%Encoding.graceCount;
    }
 
    get encoding(): string {
      let encoded = '';
      if (this.grace != Encoding.noGrace) {
        encoded = Encoding.graceStart + this.grace + Encoding.graceEnd;
      }
      encoded += this.accented ? this.hand : this.hand.toLowerCase();
      return encoded;
    }
  }