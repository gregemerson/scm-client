var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ElementRef, Component, Output, ChangeDetectorRef, EventEmitter, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import { NavController, PopoverController, ModalController, LoadingController, Content } from 'ionic-angular';
import { AudioBuffers } from '../../providers/audio-buffers/audio-buffers';
import { Metronome } from '../../providers/metronome/metronome';
import { ExerciseSets } from '../../providers/exercise-sets/exercise-sets';
import { ExerciseDisplay } from '../exercise-display/exercise-display';
import { CountDownPage } from '../countdown/countdown';
import { LoginPage } from '../login/login';
import { ResourceLibrary } from '../../providers/resource-library/resource-library';
import { Authenticator } from '../../providers/authenticator/authenticator';
export var HomePage = (function () {
    function HomePage(navCtrl, metronome, exerciseSets, audioBuffers, changeDetect, popoverController, modalController, authenticator, resourceLibrary, loadingController) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.metronome = metronome;
        this.exerciseSets = exerciseSets;
        this.audioBuffers = audioBuffers;
        this.changeDetect = changeDetect;
        this.popoverController = popoverController;
        this.modalController = modalController;
        this.authenticator = authenticator;
        this.resourceLibrary = resourceLibrary;
        this.loadingController = loadingController;
        this.isPaused = false;
        this.canDetectChanges = false;
        this.pauseButtonText = '';
        this.isStarted = false;
        this.message = HomePage.welcomeText;
        this.currentExercise = null;
        this.nextExercise = null;
        this.startButtonText = HomePage.startText;
        this.pauseButtonHidden = true;
        // Communication with countdown popover
        this.countdown = new EventEmitter();
        this.animateExercises = new EventEmitter();
        this.loaded = false;
        // Info properties
        this.count = 0;
        this.repetition = 0;
        this.bpm = 0;
        // this all needs to be moved to onInitView or something
        this.initializeDisplay();
        this.loading = loadingController.create();
        resourceLibrary.load()
            .then(function (resolve) { return audioBuffers.loadAll('library.json', new AudioContext()); })
            .then(function (resolve) { return metronome.load(audioBuffers); })
            .then(function (resolve) {
            // Set up metronome event handlers
            metronome.startDelay.subscribe(function (count) {
                _this.countdownDialog = popoverController.create(CountDownPage, { countdown: _this.countdown });
                _this.countdownPromise =
                    _this.countdownDialog.present();
            });
            metronome.countdown.subscribe(function (count) {
                _this.countdownPromise.then(function (value) {
                    _this.countdown.emit(count);
                });
            });
            metronome.startCountIn.subscribe(function () {
                _this.changeProperties(['message'], ['Count-In']);
            });
            metronome.countInBeat.subscribe(function (count) {
                _this.changeProperties(['count'], [count]);
            });
            metronome.startExercises.subscribe(function (exercise) {
                _this.setDisplays(exercise[0], exercise[1]);
                _this.changeProperties(['message'], ['Beat']);
            });
            metronome.endExercise.subscribe(function (exercise) {
                _this.setDisplays(exercise[0], exercise[1]);
                _this.changeProperties(['currentExercise', 'nextExercise'], [exercise[0], exercise[1]]);
            });
            metronome.exerciseBeat.subscribe(function (count) {
                _this.changeProperties(['count'], [count]);
            });
            metronome.repitition.subscribe(function (repitition) {
                _this.changeProperties(['repitition'], [repitition]);
            });
            metronome.endExerciseSet.subscribe(function () {
                _this.resetPage();
            });
        })
            .then(function (resolved) {
            //this.loading.dismiss();
            _this.loaded = true;
            _this.loading = null;
        })
            .catch(function (reason) {
            // @todo need real error reporting
            //this.loading.dismiss();
            _this.loading = null;
            alert(reason);
        });
    }
    HomePage.prototype.detectChanges = function () {
        if (this.canDetectChanges) {
            this.changeDetect.detectChanges();
        }
    };
    HomePage.prototype.initializeDisplay = function () {
        this.startButtonText = HomePage.startText;
        this.isStarted = false;
        this.topDisplayState = new DummyDisplayState();
        this.bottomDisplayState = new DummyDisplayState();
        this.repetition = 0;
        this.count = 0;
        this.bpm = 0;
        if (this.topExerciseDisplay) {
            this.topExerciseDisplay.hide();
        }
        if (this.bottomExerciseDisplay) {
            this.bottomExerciseDisplay.hide();
        }
        this.detectChanges();
    };
    HomePage.prototype.setDisplays = function (currentExercise, nextExercise) {
        if (!this.isStarted) {
            return;
        }
        if (this.topDisplayState.isDummy()) {
            this.topDisplayState = new DisplayState(false, this.topContainer, this.topExerciseDisplay);
            this.bottomDisplayState = new DisplayState(true, this.bottomContainer, this.bottomExerciseDisplay);
        }
        for (var _i = 0, _a = [this.topDisplayState, this.bottomDisplayState]; _i < _a.length; _i++) {
            var display = _a[_i];
            display.exercise = display.isActive ? nextExercise : currentExercise;
            display.isActive = !display.isActive;
        }
        var topFontSize = 1.5 * Number.parseInt(getComputedStyle(this.topContainer.nativeElement).fontSize);
        var bottomFontSize = 1.5 * Number.parseInt(getComputedStyle(this.bottomContainer.nativeElement).fontSize);
        var maxHeight = this.content.height() * 0.4;
        this.topDisplayState.draw(maxHeight, topFontSize);
        this.bottomDisplayState.draw(maxHeight, bottomFontSize);
        this.topContainer.nativeElement.height = this.topDisplayState.height;
        this.bottomContainer.nativeElement.height = this.bottomDisplayState.height;
        this.changeDetect.detectChanges();
    };
    HomePage.prototype.resetPage = function () {
        var _this = this;
        // Don't even ask...
        setTimeout(function () { return _this.initializeDisplay(); }, 1000);
    };
    HomePage.prototype.startClicked = function (event) {
        if (this.isStarted) {
            // Stop clicked
            this.metronome.stop();
            this.resetPage();
        }
        else {
            // Start clicked
            if (!this.userSettings) {
                this.userSettings = this.authenticator.user.settings;
            }
            this.startButtonText = HomePage.stopText;
            this.pauseButtonText = HomePage.pauseText;
            this.bpm = this.userSettings.minTempo;
            this.metronome.play(this.exerciseSets.currentExerciseSet, this.bpm, this.userSettings.numberOfRepititions, this.userSettings.secondsBeforeStart);
        }
        this.isStarted = !this.isStarted;
    };
    HomePage.prototype.pauseClicked = function (event) {
        this.pauseButtonText = this.isPaused ?
            HomePage.pauseText : HomePage.continueText;
        this.isPaused = !this.isPaused;
    };
    HomePage.prototype.loginClicked = function (event) {
        this.loginDialog = this.modalController.create(LoginPage);
        this.loginDialog.present();
    };
    HomePage.prototype.changeProperties = function (properties, values) {
        for (var i = 0; i < properties.length; i++) {
            this[properties[i]] = values[i];
        }
        this.detectChanges();
    };
    HomePage.startText = 'Start';
    HomePage.stopText = 'Stop';
    HomePage.pauseText = 'Pause';
    HomePage.continueText = 'Continue';
    HomePage.welcomeText = '';
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], HomePage.prototype, "countdown", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], HomePage.prototype, "animateExercises", void 0);
    __decorate([
        ViewChild(Content), 
        __metadata('design:type', Content)
    ], HomePage.prototype, "content", void 0);
    __decorate([
        ViewChild('topDisplay'), 
        __metadata('design:type', ExerciseDisplay)
    ], HomePage.prototype, "topExerciseDisplay", void 0);
    __decorate([
        ViewChild('bottomDisplay'), 
        __metadata('design:type', ExerciseDisplay)
    ], HomePage.prototype, "bottomExerciseDisplay", void 0);
    __decorate([
        ViewChild('topContainer'), 
        __metadata('design:type', ElementRef)
    ], HomePage.prototype, "topContainer", void 0);
    __decorate([
        ViewChild('bottomContainer'), 
        __metadata('design:type', ElementRef)
    ], HomePage.prototype, "bottomContainer", void 0);
    HomePage = __decorate([
        Component({
            selector: 'home',
            styles: [
                ".info-label {\n      color: #a6a6a6;\n      font-size: .9em\n    }",
                ".info-value {\n      padding-left: .5em;\n      font-size: 1em;\n    }"
            ],template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Stick Control Metronome{{ exerciseSets.currentExerciseSet != null ? \':\' : \'\'}}\n      <span color="primary">{{ exerciseSets.currentExerciseSet?.name }}</span>\n    </ion-title>\n    <app-buttons></app-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content #contentContainer padding class="home">\n  <span class="info-label">BPM</span>\n  <ion-badge>\n      <span class="info-value" color="primary">{{ bpm }}</span>\n  </ion-badge>\n    <span class="info-label">Count</span>\n  <ion-badge>\n    <span class="info-value" color="primary">{{ count }}</span>\n  </ion-badge>\n    <span class="info-label">Repetition</span>\n  <ion-badge>\n    <span class="info-value" color="primary">{{ repetition }}</span>\n  </ion-badge>\n\n  <ion-list>\n    <ion-item  [@activation]="topDisplayState.activationStyle">\n      <div #topContainer class="exercise-container">\n        <exercise-display #topDisplay></exercise-display>\n      </div>\n    </ion-item>\n    <ion-item  [@activation]="bottomDisplayState.activationStyle">\n      <div #bottomContainer class="exercise-container">\n        <exercise-display #bottomDisplay></exercise-display>\n      </div>\n    </ion-item>\n  </ion-list>\n  <button [disabled]="!loaded" ion-button (click)="startClicked($event)">{{ startButtonText }}</button>\n  <button [disabled]="!loaded" ion-button (click)="pauseClicked($event)" [hidden]="!isStarted">{{ pauseButtonText }}</button>\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\home\home.html"*/,
            animations: [
                trigger('activation', [
                    state('inactive', style({
                        backgroundColor: '#eee',
                        transform: 'scale(0.9)'
                    })),
                    state('active', style({
                        backgroundColor: '#cfd8dc',
                        transform: 'scale(1.0)',
                    })),
                    state('off', style({
                        backgroundColor: '#a8b0b3',
                        transform: 'scale(1.0)'
                    })),
                    transition('inactive => active', animate('100ms ease-in')),
                    transition('active => inactive', animate('100ms ease-out'))
                ])
            ]
        }), 
        __metadata('design:paramtypes', [NavController, Metronome, ExerciseSets, AudioBuffers, ChangeDetectorRef, PopoverController, ModalController, Authenticator, ResourceLibrary, LoadingController])
    ], HomePage);
    return HomePage;
}());
export var DisplayState = (function () {
    function DisplayState(active, container, display) {
        this.container = container;
        this.display = display;
        this.height = 0;
        this.isActive = active;
    }
    Object.defineProperty(DisplayState.prototype, "exercise", {
        set: function (exercise) {
            this._exercise = exercise;
        },
        enumerable: true,
        configurable: true
    });
    DisplayState.prototype.draw = function (maxHeight, fontSize) {
        if (this._exercise != null) {
            this.height = this.display.draw(this._exercise, this.container, maxHeight, fontSize);
        }
    };
    Object.defineProperty(DisplayState.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        set: function (state) {
            this._isActive = state;
            this.heading = state ?
                DisplayState.currentText : DisplayState.nextText;
            this.activationStyle = state ?
                DisplayState.activeStyle : DisplayState.inactiveStyle;
        },
        enumerable: true,
        configurable: true
    });
    DisplayState.prototype.isDummy = function () {
        return false;
    };
    DisplayState.currentText = 'Current Exercise';
    DisplayState.nextText = 'Next Exercise';
    DisplayState.activeStyle = 'active';
    DisplayState.inactiveStyle = 'inactive';
    return DisplayState;
}());
var DummyDisplayState = (function (_super) {
    __extends(DummyDisplayState, _super);
    function DummyDisplayState() {
        _super.call(this, false, null, null);
        this.heading = '';
        this.activationStyle = 'off';
    }
    DummyDisplayState.prototype.isDummy = function () {
        return true;
    };
    return DummyDisplayState;
}(DisplayState));
//# sourceMappingURL=home.js.map