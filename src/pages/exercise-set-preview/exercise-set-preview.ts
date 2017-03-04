import {ChangeDetectorRef, Component, ViewChildren, ViewChild, ElementRef, QueryList, Output} from '@angular/core';
import {NavController, NavParams, LoadingController, Loading, ModalController, PopoverController, Content} from 'ionic-angular';
import * as ES from '../../providers/exercise-sets/exercise-sets';
import {Authenticator} from '../../providers/authenticator/authenticator'
import {ExerciseDisplay} from '../exercise-display/exercise-display';
import {MessagesPage, MessageType, IMessage} from '../messages/messages';
import {NewExerciseSetForm} from './new-exercise-set';
import {NewExerciseForm} from './new-exercise';
import {RepeatForm} from './repeat';
import {ExerciseConstraints} from '../../utilities/constraints';
import {WarningPage} from '../messages/warning';
import {ExerciseSetSelectorPage} from './exercise-set-selector';
import {ShareExerciseSetForm} from './share-exercise-set';
import {Validators, FormBuilder, FormGroup, FormControl, FormsModule} from '@angular/forms';
import {Toaster} from '../toaster/toaster';
import {MessageItem} from '../message-item/message-item';

@Component({
  selector: 'exercise-set-preview',
  templateUrl: 'exercise-set-preview.html',
  styles: [`.exercise-container {
    position: relative;
    padding: 10px;
  }`]
})
export class ExerciseSetPreviewPage {
  title = '';
  constraints = new ExerciseConstraints();
  exercises: Array<ES.IExercise> = [];
  exerciseSet: ES.IExerciseSet = null;
  editor: ExerciseEditor = null;
  editing = false;
  editIndex: number = null;
  exerciseSetDetails: string;
  hideMenu = false;
  @ViewChild(Content) content: Content;
  @ViewChild(Toaster) toaster: Toaster;
  @ViewChildren(ExerciseDisplay) displays: QueryList<ExerciseDisplay>;
  @ViewChildren('displayContainer') contents: QueryList<ElementRef>;
  @ViewChild(MessageItem) errorDisplay: MessageItem;
  private fontFactor = 1.75;
  private saveFields = ['notation', 'name', 'comments'];
  private loading: Loading;

  constructor(private navCtrl: NavController, 
    public exerciseSets: ES.ExerciseSets,
    public authenticator: Authenticator,
    private params: NavParams,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private modal: ModalController,
    private popover: PopoverController,
    private changeDetect: ChangeDetectorRef) {
  }

  onResize($event) {
    this.displayExercises();
    if (this.editor) {
      this.editor.onResize();
    }
  }

  private empty(s: string) {
    return (!s && s.length == 0);
  }

  private formatExerciseSetDetails() {
    if (!this.exerciseSet) {
      this.exerciseSetDetails = '';
      return;
    }
    let set = this.exerciseSet;
    let category = (this.empty(set.category)) ? '' : ' (category: ' + set.category + ')';
    let comments = (this.empty(set.comments)) ? '' : set.comments;
    this.exerciseSetDetails = comments + category;
  }

  selectExerciseSet(mainFab: any) {
    console.dir(this.exerciseSets.items)
    mainFab.close();
    this.modalCtrl.create(ExerciseSetSelectorPage,
      {
        onSelect: (id: number) => {
          this.changeCurrentExerciseSet(id);
        },
        currentSelectionId: this.exerciseSet ? this.exerciseSet.id : null,
        exerciseSets: this.exerciseSets.items
      }).present();
  }

  private dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
    this.loading = null;   
  }

  private onSuccessfulOperations(message: string = null) {
    if (message) {
      this.toaster.present(message);
    }
    this.errorDisplay.hide();
    this.dismissLoading();
  }

  private onFailedOperation(message: string = null) {
    if (message) {
      this.errorDisplay.show(message);
    }
    this.dismissLoading();
  }
  
  updateExerciseSetMetadata(mainFab: any) {
    mainFab.close();
    this.modalCtrl.create(NewExerciseSetForm, {
      create: (formData: Object) => {
          if (!formData) {
            return;
          }
          this.exerciseSets.updateCurrentExerciseSetMetadata(formData).subscribe({
            next: () => {
              this.formatExerciseSetDetails();
              this.onSuccessfulOperations('Saved successfully');
            },
            error: (err: any) => {
              this.onFailedOperation(err);
            }
          });
      },
      initializer: {
        name: this.exerciseSet.name,
        category: this.exerciseSet.category,
        comments: this.exerciseSet.comments
      }
    }).present();
  }

  shareExerciseSet(mainFab: any) {
    mainFab.close();
    this.modalCtrl.create(ShareExerciseSetForm, {
      callback: (initializer: Object) => {
          if (!initializer) {
            return;
          }
          this.exerciseSet.shareExerciseSet(initializer).subscribe(
            (result: Object) => {
              this.onSuccessfulOperations('Shared with ' + initializer['username']);
            },
            (err: any) => {
              this.onFailedOperation(err);
            }
          );
      }
    }).present();
  }

  newExerciseSet(mainFab: any) {
    mainFab.close();
    this.modalCtrl.create(NewExerciseSetForm, {
      create: (formData: Object) => {
          if (!formData) {
            return;
          }
          this.exerciseSets.newExerciseSet(formData).subscribe(
            (setId: number) => {
              this.changeCurrentExerciseSet(setId);
              this.onSuccessfulOperations();
            },
            (err: any) => {
              this.onFailedOperation(err);
            }
          );
      }
    }).present();
  }

  newExercise(mainFab: any) {
    mainFab.close();
    this.modal.create(NewExerciseForm, {
      create: (formData: Object) => {
          let exerciseSet = this.exerciseSets.currentExerciseSet;
          if (!formData) {
            return;
          }
          exerciseSet.newExercise(formData).subscribe(
            (exerciseId: number) => {
              this.content.scrollToBottom();
              this.onSuccessfulOperations();
            },
            (err: any) => {
              this.onFailedOperation(err);
            }
          );
      }
    }).present();    
  }

  private onChangedExerciseSet() {
    this.assignExerciseSet();
    this.loadExercises();
    this.formatExerciseSetDetails();
  }

  changeCurrentExerciseSet(exerciseSetId: number) {
    this.changeDetect.detectChanges();
    this.loading = this.showLoading();
    this.exerciseSets.setCurrentExerciseSet(exerciseSetId).subscribe(
      (x: any) => {
        this.onSuccessfulOperations();
        this.onChangedExerciseSet();
      },
      (err: any) => {
        this.onFailedOperation(err);
      }
    )
  }

  private assignExerciseSet() {
    this.exerciseSet = this.exerciseSets.currentExerciseSet;
  }

  ngAfterViewInit() {
    this.contents.changes.subscribe((changes: any) => this.displayExercises());
    this.exerciseSets.notifyOnReady(() => {
        this.onChangedExerciseSet();
    });
  }

  private loadExercises() {
    if (!this.exerciseSets.currentExerciseSet) {
      return;
    }
    this.exercises = this.exerciseSets.currentExerciseSet.exercises;
  }

  private displayExercises(index = -1) {
    let containers = this.contents.toArray();
    let displays = this.displays.toArray();
    let exercises = this.exercises;
    if (index == -1) {
      for (let i = 0; i < displays.length; i++) {
        this.drawExercise(exercises[i], displays[i], containers[i]);
      }
    }
    else {
      this.drawExercise(exercises[index], displays[index], containers[index]);
    }
  }

  private drawExercise(exercise: ES.IExercise, 
    display: ExerciseDisplay, container: ElementRef): number {
      let fontSize = this.fontFactor * Number.parseInt(
        getComputedStyle(container.nativeElement).fontSize);
      return display.draw(exercise, container, 
        Number.MAX_SAFE_INTEGER, fontSize);
    }

  private showMessages(messages: Array<IMessage>) {
    this.modalCtrl.create(MessagesPage, {
      messages: messages
    }).present();
  }

  private showLoading(): Loading {
    let loading = this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  private createSnapshot(exercise: ES.IExercise): Object {
    return {
      name: exercise.name,
      comments: exercise.comments
    }
  }

  editExercise(idx: number) {
    let display = <ExerciseDisplay>this.displays.toArray()[idx];
    let container = this.contents.toArray()[idx];
    let exercise = this.exercises[idx];
    let draw = () => this.drawExercise(exercise, display, container);
    exercise.display.takeSnapShot();
    this.setEditMode(true, idx);
    this.editor = new 
      ExerciseEditor(exercise.display, draw, (position: number) => {
        if (position < 0) {
          display.hideCursor();
          return;
        }
        display.drawCursor(position);
      }, (snapShot: Object) => {
        // Save
        let loading = this.showLoading();
        let fieldsToSave: string[] = [];
        for (let field of this.saveFields) {
          if (field == 'notation' && exercise.display.isDirty) {
            fieldsToSave.push(field);
          }
          else {
            if (exercise[field] != snapShot[field]) {
              exercise[field] = snapShot[field];
              fieldsToSave.push(field);
            }
          }
        }
        this.exerciseSets.currentExerciseSet.
          save(exercise, fieldsToSave).subscribe(
            () => {
                this.setEditMode(false);
                this.onSuccessfulOperations('Exercise saved successfully');
                display.hideCursor();
                loading.dismiss();
            },
            (err: any) => {
              this.revertExerciseValues(exercise, draw);
              display.hideCursor();
              loading.dismiss();
              this.errorDisplay.show(err);
            }
          );
      }, () => {
        // Cancel
        this.revertExerciseValues(exercise, draw);
        display.hideCursor();
      }, this.modal, this.createSnapshot(exercise));
  }

  revertExerciseValues(exercise: ES.IExercise, draw: () => void) {
    let snapShot = this.editor.snapShot;
    exercise.name = snapShot['name'];
    exercise.comments = snapShot['comments'];
    exercise.display.revertToSnapShot();
    draw();
    this.setEditMode(false);
  }

  deleteExercise(idx: number) {
    this.modal.create(WarningPage, {
      message: 'Do you want to permanantly delete this exercise?',
      okCallback: () => {
        this.exerciseSets.currentExerciseSet.delete(
          this.exercises[idx]).subscribe({
            next: (obj: Object) => {
              this.exercises.splice(idx, 1);
            },
            error: (message: any) => {
              this.onFailedOperation(message);
            }
          });
      }
    }).present();
  }

  removeExerciseSet(mainFab: any) {
    mainFab.close();
    this.modal.create(WarningPage, {
      message: 'Do you want to permanantly delete this exercise set?',
      okCallback:() => {
        this.exerciseSets.removeCurrentExerciseSet().subscribe({
          next: () => {
            this.onSuccessfulOperations();
            this.onChangedExerciseSet();
          },
          error: (err: any) => {
          this.onFailedOperation(err);
          }
        });
      }
    }).present();
  }

  setEditMode(editing: boolean, editIndex?: number) {
    this.editing = editing;
    this.editIndex = editing ? editIndex : null;
    this.editor = !editing ? null : this.editor;
    this.hideMainMenu(editing);
  }

  private hideMainMenu(hide: boolean) {
    this.hideMenu = hide;
  }
}

export class ExerciseEditor {
  // Need caps versions of these strokes
  rightHand = ES.Encoding.accectedRight;
  leftHand = ES.Encoding.accentedLeft;
  bothHands = ES.Encoding.accentedBoth;
  noHands = ES.Encoding.rest;
  buttonHelp = false;
  enableStroke = false;
  atStroke = false;
  enableRepeat = false;
  enableAccent = false;
  enableGrace = false;
  enableSpace = false;
  
  constructor(private elements: ES.ExerciseElements,
    private drawExercise: () => number,
    private drawCursor: (position: number) => void,
    private onSave: (snapShot: Object) => void,
    private onCancel: () => void,
    private modal: ModalController,
    public snapShot: Object) {
    elements.cursorChanged = () => this.enforceRules();
    elements.resetCursor();
    this.drawCursor(this.elements.cursorPosition);
  }

  onResize() {
    this.drawAll();
  }

  enforceRules() {
    this.enableRepeat = (this.elements.elementAtCursorIs(ES.MeasureSeparator)) &&
       (this.elements.measuresBeforeCursor() > 0);
    this.atStroke = this.elements.elementAtCursorIs(ES.Stroke);
    this.enableStroke = !this.elements.elementAtCursorIs(ES.Repeat);
    this.enableAccent = false;
    let element = this.elements.elementAtCursor();
    if (element instanceof ES.Stroke) {
      this.enableAccent = (<ES.Stroke>element).hand != ES.Encoding.rest;
    }
    this.enableGrace = this.enableAccent;
    this.enableSpace = element instanceof ES.Stroke;
  }

  private drawAll(): number {
    let height = this.drawExercise();
    this.drawCursor(this.elements.cursorPosition);
    return height;
  }

  backspace() {
    this.elements.deleteAtCursor();
    this.drawAll();
  }

  forward() {
    if (this.elements.cursorPosition == this.elements.length) {
      return;
    }
    this.elements.cursorForward();
    this.drawCursor(this.elements.cursorPosition);
  }

  back() {
    if (this.elements.cursorPosition == 0) {
      return;
    }
    this.elements.cursorBack();
    this.drawCursor(this.elements.cursorPosition);
  }

  repeat() {
    this.modal.create(RepeatForm, {
      maxMeasures: this.elements.measuresBeforeCursor(),
      create: (numMeasures: number, numRepeats: number) => {
        let newRepeat = new ES.Repeat();
        newRepeat.numMeasures = numMeasures;
        newRepeat.numRepeats = numRepeats;
        this.elements.insertAtCursor(newRepeat);
        this.drawAll();
      }
    }).present();
  }

  accent() {
    let stroke = <ES.Stroke>this.elements.elementAtCursor(); 
    stroke.accented = !stroke.accented;
    this.drawAll();
  }

  grace() {
    (<ES.Stroke>this.elements.elementAtCursor()).cycleGrace();
    this.drawAll();
  }

  measure() {
    this.elements.insertAtCursor(new ES.MeasureSeparator());
    this.drawAll();
  }

  space() {
    this.elements.insertAtCursor(new ES.GroupSeparator());
    this.drawAll();
  }
  
  stroke(hand: string) {
    let stroke = new ES.Stroke();
    stroke.accented = false;
    stroke.grace = ES.Encoding.noGrace;
    stroke.hand = hand;
    this.elements.insertAtCursor(stroke);
    if (this.drawAll() == -1) {
      //this.back();
    }
  }

  saveExerciseEditing() {
    this.drawCursor(-1);
    this.elements.cursorChanged = null;
    this.onSave(this.snapShot);
  }

  editExerciseProperties() {
    this.modal.create(NewExerciseForm, {
      create: (formData: Object) => {
        this.snapShot['name'] = formData['name'];
        this.snapShot['comments'] = formData['comments'];
      },
      initializer: this.snapShot
    }).present();
  }

  cancelExerciseEditing() {
    this.drawCursor(-1);
    this.elements.cursorChanged = null;
    this.onCancel();
  }
}
