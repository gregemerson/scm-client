var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, PopoverController, Content } from 'ionic-angular';
import * as ES from '../../providers/exercise-sets/exercise-sets';
import { ExerciseDisplay } from '../exercise-display/exercise-display';
import { MessagesPage, MessageType } from '../messages/messages';
import { NewExerciseSetForm } from './new-exercise-set';
import { NewExerciseForm } from './new-exercise';
import { RepeatForm } from './repeat';
import { ExerciseConstraints } from './exercise-constraints';
import { WarningPage } from '../messages/warning';
import { ExerciseSetSelectorPage } from './exercise-set-selector';
import { ShareExerciseSetForm } from './share-exercise-set';
import { FormBuilder } from '@angular/forms';
export var ExerciseSetPreviewPage = (function () {
    function ExerciseSetPreviewPage(navCtrl, exerciseSets, params, loadingCtrl, modalCtrl, modal, popover, changeDetect, formBuilder) {
        this.navCtrl = navCtrl;
        this.exerciseSets = exerciseSets;
        this.params = params;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.modal = modal;
        this.popover = popover;
        this.changeDetect = changeDetect;
        this.formBuilder = formBuilder;
        this.title = '';
        this.constraints = new ExerciseConstraints();
        this.exercises = [];
        this.selectedExerciseSet = null;
        this.editor = null;
        this.editing = false;
        this.editIndex = null;
        this.fontFactor = 1.75;
        this.saveFields = ['notation', 'name', 'category', 'comments'];
    }
    ExerciseSetPreviewPage.prototype.onResize = function ($event) {
        this.displayExercises();
        if (this.editor) {
            this.editor.onResize();
        }
    };
    Object.defineProperty(ExerciseSetPreviewPage.prototype, "currentExerciseSetId", {
        get: function () {
            return this.exerciseSets.currentExerciseSet ?
                this.exerciseSets.currentExerciseSet.id : null;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseSetPreviewPage.prototype.empty = function (s) {
        return (!s && s.length == 0);
    };
    ExerciseSetPreviewPage.prototype.formatExerciseSetDetails = function () {
        if (!this.exerciseSets.currentExerciseSet) {
            this.isOwner = false;
            this.exerciseSetDetails = null;
            this.exerciseSetName = null;
            return;
        }
        this.isOwner = this.exerciseSets.currentExerciseSet.isOwner;
        this.exerciseSetName = this.exerciseSets.currentExerciseSet.name;
        var set = this.exerciseSets.currentExerciseSet;
        var category = (this.empty(set.category)) ? '' : ' (category: ' + set.category + ')';
        var comments = (this.empty(set.comments)) ? '' : set.comments;
        this.exerciseSetDetails = comments + category;
    };
    ExerciseSetPreviewPage.prototype.selectExerciseSet = function () {
        var _this = this;
        this.modalCtrl.create(ExerciseSetSelectorPage, {
            onSelect: function (id) {
                _this.changeCurrentExerciseSet(id);
            },
            currentSelectionId: this.currentExerciseSetId,
            exerciseSets: this.exerciseSets.items
        }).present();
    };
    ExerciseSetPreviewPage.prototype.updateExerciseSetMetadata = function () {
        var _this = this;
        this.modalCtrl.create(NewExerciseSetForm, {
            create: function (formData) {
                if (!formData) {
                    return;
                }
                _this.exerciseSets.updateCurrentExerciseSetMetadata(formData).subscribe({
                    next: function () {
                        _this.formatExerciseSetDetails();
                    },
                    error: function (err) {
                        _this.showMessages([MessagesPage.createMessage('Error', 'Could not edit exercise set.', MessageType.Error)]);
                    }
                });
            },
            initializer: {
                name: this.exerciseSets.currentExerciseSet.name,
                category: this.exerciseSets.currentExerciseSet.category,
                comments: this.exerciseSets.currentExerciseSet.comments
            }
        }).present();
    };
    ExerciseSetPreviewPage.prototype.shareExerciseSet = function () {
        var _this = this;
        this.modalCtrl.create(ShareExerciseSetForm, {
            emailCallback: function (email) {
                if (!email) {
                    return;
                }
                _this.exerciseSets.currentExerciseSet.shareExerciseSet(email).subscribe({
                    next: function (result) {
                        console.dir(result);
                    },
                    error: function (err) {
                        _this.showMessages([MessagesPage.createMessage('Error', 'Could not share exercise set.', MessageType.Error)]);
                    }
                });
            }
        }).present();
    };
    ExerciseSetPreviewPage.prototype.newExerciseSet = function () {
        var _this = this;
        this.modalCtrl.create(NewExerciseSetForm, {
            create: function (formData) {
                if (!formData) {
                    return;
                }
                _this.exerciseSets.newExerciseSet(formData).subscribe({
                    next: function (setId) {
                        _this.changeCurrentExerciseSet(setId);
                    },
                    error: function (err) {
                        _this.showMessages([MessagesPage.createMessage('Error', 'Could not create exercise set.', MessageType.Error)]);
                    }
                });
            }
        }).present();
    };
    ExerciseSetPreviewPage.prototype.newExercise = function () {
        var _this = this;
        this.modal.create(NewExerciseForm, {
            create: function (formData) {
                var exerciseSet = _this.exerciseSets.currentExerciseSet;
                if (!formData) {
                    return;
                }
                exerciseSet.newExercise(formData).subscribe({
                    next: function (exerciseId) {
                        var index = 0;
                        var exercise = null;
                        exerciseSet.initIterator();
                        while (exerciseSet.next() != null) {
                            if (exerciseSet.currentExercise.id == exerciseId) {
                                exercise = exerciseSet.currentExercise;
                                break;
                            }
                            index++;
                        }
                        _this.exercises.push(exercise);
                        _this.content.scrollToBottom();
                    },
                    error: function (err) {
                        _this.showMessages([MessagesPage.createMessage('Error', 'Could not create exercise set.', MessageType.Error)]);
                    }
                });
            }
        }).present();
    };
    ExerciseSetPreviewPage.prototype.changeCurrentExerciseSet = function (exerciseSetId) {
        var _this = this;
        this.changeDetect.detectChanges();
        if (!exerciseSetId) {
            this.selectedExerciseSet = null;
            this.formatExerciseSetDetails();
            return;
        }
        var loading = this.showLoading();
        this.exerciseSets.setCurrentExerciseSet(exerciseSetId).subscribe(function (x) {
            loading.dismiss();
            _this.loadExercises();
            _this.formatExerciseSetDetails();
        }, function (error) {
            loading.dismiss();
            _this.modal.create(MessagesPage, {
                messages: [MessagesPage.createMessage('Error', error, MessageType.Error)]
            }).present();
        });
    };
    ExerciseSetPreviewPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.contents.changes.subscribe(function (changes) { return _this.displayExercises(); });
        this.formatExerciseSetDetails();
        this.loadExercises();
    };
    ExerciseSetPreviewPage.prototype.loadExercises = function () {
        if (!this.exerciseSets.currentExerciseSet) {
            return;
        }
        this.exercises.length = 0;
        var exerciseSet = this.exerciseSets.currentExerciseSet;
        exerciseSet.initIterator();
        while (exerciseSet.next() != null) {
            this.exercises.push(exerciseSet.currentExercise);
        }
    };
    ExerciseSetPreviewPage.prototype.displayExercises = function (index) {
        if (index === void 0) { index = -1; }
        var containers = this.contents.toArray();
        var displays = this.displays.toArray();
        var exercises = this.exercises;
        if (index == -1) {
            for (var i = 0; i < displays.length; i++) {
                this.drawExercise(exercises[i], displays[i], containers[i]);
            }
        }
        else {
            this.drawExercise(exercises[index], displays[index], containers[index]);
        }
    };
    ExerciseSetPreviewPage.prototype.drawExercise = function (exercise, display, container) {
        var fontSize = this.fontFactor * Number.parseInt(getComputedStyle(container.nativeElement).fontSize);
        var height = display.draw(exercise, container, Number.MAX_SAFE_INTEGER, fontSize);
    };
    ExerciseSetPreviewPage.prototype.showMessages = function (messages) {
        this.modalCtrl.create(MessagesPage, {
            messages: messages
        }).present();
    };
    ExerciseSetPreviewPage.prototype.showLoading = function () {
        var loading = this.loadingCtrl.create();
        loading.present();
        return loading;
    };
    ExerciseSetPreviewPage.prototype.createSnapshot = function (exercise) {
        return {
            name: exercise.name,
            category: exercise.category,
            comments: exercise.comments
        };
    };
    ExerciseSetPreviewPage.prototype.editExercise = function (idx) {
        var _this = this;
        var display = this.displays.toArray()[idx];
        var container = this.contents.toArray()[idx];
        var exercise = this.exercises[idx];
        exercise.display.takeSnapShot();
        this.setEditMode(true, idx);
        this.editor = new ExerciseEditor(exercise.display, function () {
            _this.drawExercise(exercise, display, container);
        }, function (position) {
            if (position < 0) {
                display.hideCursor();
                return;
            }
            display.drawCursor(position);
        }, function (snapShot) {
            // Save
            var loading = _this.showLoading();
            _this.setEditMode(false);
            var fieldsToSave = [];
            for (var _i = 0, _a = _this.saveFields; _i < _a.length; _i++) {
                var field = _a[_i];
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
            _this.exerciseSets.currentExerciseSet.
                save(exercise, fieldsToSave).subscribe({
                next: function () {
                    loading.dismiss();
                },
                error: function (err) {
                    loading.dismiss();
                    var message = MessagesPage.createMessage('Error', err, MessageType.Error);
                    _this.showMessages([message]);
                }
            });
        }, function () {
            // Cancel
            var snapShot = _this.editor.snapShot;
            exercise.name = snapShot['name'];
            exercise.comments = snapShot['comments'];
            exercise.category = snapShot['category'];
            exercise.display.revertToSnapShot();
            display.hideCursor();
            _this.setEditMode(false);
        }, this.modal, this.createSnapshot(exercise));
    };
    ExerciseSetPreviewPage.prototype.deleteExerciseSet = function () {
        this.exerciseSets.removeCurrentExerciseSet().subscribe({
            next: function () {
                console.log('ok ');
            },
            error: function (err) {
                console.log('error ');
                console.dir(err);
            }
        });
    };
    ExerciseSetPreviewPage.prototype.deleteExercise = function (idx) {
        var _this = this;
        this.popover.create(WarningPage, {
            message: 'Do you want to permanantly delete this exercise?',
            okCallback: function () {
                _this.exerciseSets.currentExerciseSet.delete(_this.exercises[idx]).subscribe({
                    next: function (obj) {
                        console.log('delete next for index' + idx);
                        _this.exercises.splice(idx, 1);
                    },
                    error: function (err) {
                        var message = MessagesPage.createMessage("Error", "could not delete exercise", MessageType.Error);
                    }
                });
            }
        }).present();
    };
    ExerciseSetPreviewPage.prototype.removeExerciseSet = function () {
    };
    ExerciseSetPreviewPage.prototype.setEditMode = function (editing, editIndex) {
        this.editing = editing;
        this.editIndex = editing ? editIndex : null;
        this.editor = !editing ? null : this.editor;
    };
    __decorate([
        ViewChild(Content), 
        __metadata('design:type', Content)
    ], ExerciseSetPreviewPage.prototype, "content", void 0);
    __decorate([
        ViewChildren(ExerciseDisplay), 
        __metadata('design:type', QueryList)
    ], ExerciseSetPreviewPage.prototype, "displays", void 0);
    __decorate([
        ViewChildren('displayContainer'), 
        __metadata('design:type', QueryList)
    ], ExerciseSetPreviewPage.prototype, "contents", void 0);
    ExerciseSetPreviewPage = __decorate([
        Component({
            selector: 'exercise-set-preview',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\exercise-set-preview.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Exercise Sets</ion-title>\n    <app-buttons></app-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding (window:resize)="onResize($event)">\n  <ion-list no-lines>\n    <ion-card [hidden]="!exerciseSets.currentExerciseSet">\n        <ion-card-header>{{ exerciseSetName }}</ion-card-header>\n        <ion-card-content>{{ exerciseSetDetails }}</ion-card-content>\n    </ion-card>\n    <ion-item>\n      <ion-buttons>\n        <button ion-button (click)="selectExerciseSet()" [disabled]="editing" color="primary" outline small>Select Set</button>\n        <button ion-button (click)="newExerciseSet()" [disabled]="editing" color="primary" outline small>New Set</button>\n        <button ion-button (click)="updateExerciseSetMetadata()" [hidden]="!exerciseSets.currentExerciseSet || !isOwner" [disabled]="editing" color="primary" outline small>Edit Set</button>\n        <button ion-button (click)="deleteExerciseSet()" [hidden]="!exerciseSets.currentExerciseSet || !isOwner" [disabled]="editing" color="danger" outline small>Remove Set</button>\n        <button ion-button (click)="newExercise()" [hidden]="!exerciseSets.currentExerciseSet || !isOwner" [disabled]="editing" color="primary" outline small>New Exercise</button>\n        <button ion-button (click)="shareExerciseSet()" [hidden]="!exerciseSets.currentExerciseSet" [disabled]="editing" color="primary" outline small>Share Set</button> \n      </ion-buttons>\n    </ion-item>\n  </ion-list>\n  <ion-list>\n    <ion-item *ngFor="let exercise of exercises; let idx = index">\n      <div [hidden]="editIndex == idx">\n        {{ (exercise.name ? exercise.name : \'\') +\n          (exercise.category ? (\' (\' + exercise.category + \')\') : \'\')  +\n          (exercise.comments ? (\': \' + exercise.comments) : \'\') }}\n      </div>\n      <div #displayContainer class="exercise-container" [class.editing-on]="editIndex == idx">\n        <exercise-display #exerciseDisplay></exercise-display>\n      </div> \n      <ion-buttons [hidden]="editIndex == idx || !isOwner">\n        <button ion-button (click)="editExercise(idx)" [hidden]="!isOwner" [disabled]="editing" color="primary" small>\n          <ion-icon name="open"></ion-icon>\n        </button>\n        <button ion-button (click)="deleteExercise(idx)" [hidden]="!isOwner" [disabled]="editing" color="danger" small>\n          <ion-icon name="trash"></ion-icon>\n        </button>\n      </ion-buttons>\n      <ion-buttons [hidden]="editIndex != idx">\n        <button ion-button (click)="editor.saveExerciseEditing()" color="primary" small>\n          <ion-icon name="checkmark-circle"></ion-icon>\n        </button>\n        <button ion-button (click)="editor.editExerciseProperties()" color="secondary" small>\n          <ion-icon name="information-circle"></ion-icon>\n        </button>\n        <button ion-button (click)="editor.cancelExerciseEditing()" color="danger" small>\n          <ion-icon name="trash"></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-item>\n  </ion-list>\n</ion-content>\n\n<ion-footer [hidden]="!editing">\n  <ion-toolbar>\n    <ion-buttons left class="editor-buttons">\n      <button ion-button outline [disabled]="!(editing && editor?.enableStroke)" (click)="editor.stroke(editor.rightHand)">R</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableStroke)" (click)="editor.stroke(editor.leftHand)">L</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableStroke)" (click)="editor.stroke(editor.bothHands)">B</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableStroke)" (click)="editor.stroke(editor.noHands)"><ion-icon name="radio-button-off"></ion-icon></button>      \n      <button ion-button outline [disabled]="!(editing && editor?.atStroke)" (click)="editor.measure()">|</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableRepeat)" (click)="editor.repeat()">/</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableGrace)" (click)="editor.grace()">G</button>\n      <button ion-button outline [disabled]="!(editing && editor?.enableAccent)" (click)="editor.accent()">></button>\n      <button ion-button outline [disabled]="!(editing && editor?.atStroke)" (click)="editor.space()"><ion-icon name="square-outline"></ion-icon></button>\n      <button ion-button outline (click)="editor.back()"><ion-icon name="arrow-back"></ion-icon></button>\n      <button ion-button outline (click)="editor.forward()"><ion-icon name="arrow-forward"></ion-icon></button>\n      <button ion-button outline (click)="editor.backspace()"><ion-icon name="backspace"></ion-icon></button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-footer>'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\exercise-set-preview.html"*/,
            styles: [".exercise-container {\n    position: relative;\n    padding: 10px;\n  }"]
        }), 
        __metadata('design:paramtypes', [NavController, ES.ExerciseSets, NavParams, LoadingController, ModalController, ModalController, PopoverController, ChangeDetectorRef, FormBuilder])
    ], ExerciseSetPreviewPage);
    return ExerciseSetPreviewPage;
}());
export var ExerciseEditor = (function () {
    function ExerciseEditor(elements, drawExercise, drawCursor, onSave, onCancel, modal, snapShot) {
        var _this = this;
        this.elements = elements;
        this.drawExercise = drawExercise;
        this.drawCursor = drawCursor;
        this.onSave = onSave;
        this.onCancel = onCancel;
        this.modal = modal;
        this.snapShot = snapShot;
        // Need caps versions of these strokes
        this.rightHand = ES.Encoding.accectedRight;
        this.leftHand = ES.Encoding.accentedLeft;
        this.bothHands = ES.Encoding.accentedBoth;
        this.noHands = ES.Encoding.rest;
        this.enableStroke = false;
        this.atStroke = false;
        this.enableRepeat = false;
        this.enableAccent = false;
        this.enableGrace = false;
        elements.cursorChanged = function () { return _this.enforceRules(); };
        elements.resetCursor();
        this.drawCursor(this.elements.cursorPosition);
    }
    ExerciseEditor.prototype.onResize = function () {
        this.drawAll();
    };
    ExerciseEditor.prototype.enforceRules = function () {
        this.enableRepeat = (this.elements.elementAtCursorIs(ES.MeasureSeparator)) &&
            (this.elements.measuresBeforeCursor() > 0);
        this.atStroke = this.elements.elementAtCursorIs(ES.Stroke);
        this.enableStroke = !this.elements.elementAtCursorIs(ES.Repeat);
        this.enableAccent = false;
        var element = this.elements.elementAtCursor();
        if (element instanceof ES.Stroke) {
            this.enableAccent = element.hand != ES.Encoding.rest;
        }
        this.enableGrace = this.enableAccent;
    };
    ExerciseEditor.prototype.drawAll = function () {
        this.drawExercise();
        this.drawCursor(this.elements.cursorPosition);
    };
    ExerciseEditor.prototype.backspace = function () {
        this.elements.deleteAtCursor();
        this.drawAll();
    };
    ExerciseEditor.prototype.forward = function () {
        if (this.elements.cursorPosition == this.elements.length) {
            return;
        }
        this.elements.cursorForward();
        this.drawCursor(this.elements.cursorPosition);
    };
    ExerciseEditor.prototype.back = function () {
        if (this.elements.cursorPosition == 0) {
            return;
        }
        this.elements.cursorBack();
        this.drawCursor(this.elements.cursorPosition);
    };
    ExerciseEditor.prototype.repeat = function () {
        var _this = this;
        this.modal.create(RepeatForm, {
            maxMeasures: this.elements.measuresBeforeCursor(),
            create: function (numMeasures, numRepeats) {
                var newRepeat = new ES.Repeat();
                newRepeat.numMeasures = numMeasures;
                newRepeat.numRepeats = numRepeats;
                _this.elements.insertAtCursor(newRepeat);
                _this.drawAll();
            }
        }).present();
    };
    ExerciseEditor.prototype.accent = function () {
        var stroke = this.elements.elementAtCursor();
        stroke.accented = !stroke.accented;
        this.drawAll();
    };
    ExerciseEditor.prototype.grace = function () {
        this.elements.elementAtCursor().cycleGrace();
        this.drawAll();
    };
    ExerciseEditor.prototype.measure = function () {
        this.elements.insertAtCursor(new ES.MeasureSeparator());
        this.drawAll();
    };
    ExerciseEditor.prototype.space = function () {
        this.elements.insertAtCursor(new ES.GroupSeparator());
        this.drawAll();
    };
    ExerciseEditor.prototype.stroke = function (hand) {
        var stroke = new ES.Stroke();
        stroke.accented = false;
        stroke.grace = ES.Encoding.noGrace;
        stroke.hand = hand;
        this.elements.insertAtCursor(stroke);
        this.drawAll();
    };
    ExerciseEditor.prototype.saveExerciseEditing = function () {
        this.drawCursor(-1);
        this.elements.cursorChanged = null;
        this.onSave(this.snapShot);
    };
    ExerciseEditor.prototype.editExerciseProperties = function () {
        var _this = this;
        this.modal.create(NewExerciseForm, {
            create: function (formData) {
                _this.snapShot['name'] = formData['name'];
                _this.snapShot['category'] = formData['category'];
                _this.snapShot['comments'] = formData['comments'];
            },
            initializer: this.snapShot
        }).present();
    };
    ExerciseEditor.prototype.cancelExerciseEditing = function () {
        this.drawCursor(-1);
        this.elements.cursorChanged = null;
        this.onCancel();
    };
    return ExerciseEditor;
}());
//# sourceMappingURL=exercise-set-preview.js.map