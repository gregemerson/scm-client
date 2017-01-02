var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
var MetronomeState;
(function (MetronomeState) {
    MetronomeState[MetronomeState["Started"] = 0] = "Started";
    MetronomeState[MetronomeState["Stopped"] = 1] = "Stopped";
    MetronomeState[MetronomeState["Paused"] = 2] = "Paused";
})(MetronomeState || (MetronomeState = {}));
export var Metronome = (function () {
    function Metronome(http) {
        this.http = http;
        this.startExerciseSet = new EventEmitter();
        this.startDelay = new EventEmitter();
        this.countdown = new EventEmitter();
        this.endDelay = new EventEmitter();
        this.startCountIn = new EventEmitter();
        this.countInBeat = new EventEmitter();
        this.endCountIn = new EventEmitter();
        this.startExercises = new EventEmitter();
        this.startExercise = new EventEmitter();
        this.exerciseBeat = new EventEmitter();
        this.repitition = new EventEmitter();
        this.endExercise = new EventEmitter();
        this.endExerciseSet = new EventEmitter();
        this.state = MetronomeState.Stopped;
        this.scheduledClicks = new Array();
        this.scheduledEvents = new Array();
        this.audioBuffers = null;
    }
    Metronome.prototype.load = function (audioBuffers) {
        this.audioBuffers = audioBuffers;
        this.audioContext = audioBuffers.audioContext;
        this.silence = audioBuffers.buffers['silence'];
    };
    Metronome.prototype.schedule = function (time, audioBuffer, emitter) {
        // Schedule clicks and events
        var clickNode = this.audioContext.createBufferSource();
        this.scheduledClicks.push(new StartedNode(clickNode, time));
        clickNode.buffer = audioBuffer;
        clickNode.connect(this.audioBuffers.audioContext.destination);
        clickNode.start(time);
        var eventNode = this.audioContext.createBufferSource();
        this.scheduledEvents.push(new StartedNode(eventNode, time));
        eventNode.buffer = this.audioBuffers.silence;
        eventNode.connect(this.audioBuffers.audioContext.destination);
        eventNode.start(time);
        eventNode.onended = emitter;
    };
    Metronome.prototype.play = function (exerciseSet, bpm, repititions, delaySeconds) {
        var _this = this;
        this.state = MetronomeState.Started;
        exerciseSet.initIterator();
        var currentExercise = exerciseSet.next();
        if (currentExercise == null) {
            this.endExerciseSet.emit({});
            return;
        }
        var tempoInterval = 60 / bpm;
        var now = this.audioContext.currentTime;
        var nextStartTime = now;
        // Schedule countdown
        var _loop_1 = function(s) {
            var onended_1 = function () {
                if (s == 0) {
                    _this.startDelay.emit(null);
                }
                _this.countdown.emit(delaySeconds - s);
            };
            this_1.schedule(nextStartTime, this_1.audioBuffers.silence, onended_1);
            nextStartTime += 1;
        };
        var this_1 = this;
        for (var s = 0; s < delaySeconds; s++) {
            _loop_1(s);
        }
        // Perform count-in
        var beatCount = currentExercise.getNumberOfBeats();
        var c = currentExercise;
        var n = exerciseSet.nextExercise;
        this.schedule(nextStartTime - .01, this.audioBuffers.silence, function () { return _this.startExercises.emit([c, n]); });
        var _loop_2 = function(beat) {
            var onended_2 = function () {
                if (beat == 1) {
                    _this.startCountIn.emit(null);
                }
                _this.countInBeat.emit(beat);
                if (beat == beatCount) {
                    _this.endCountIn.emit(null);
                }
            };
            this_2.schedule(nextStartTime, this_2.audioBuffers.buffers[(beat) + '-count'], onended_2);
            nextStartTime += tempoInterval;
        };
        var this_2 = this;
        for (var beat = 1; beat <= beatCount; beat++) {
            _loop_2(beat);
        }
        // Play exercises
        this.playExercise(exerciseSet, nextStartTime, tempoInterval, repititions, 1);
    };
    Metronome.prototype.playExercise = function (exerciseSet, nextStartTime, interval, totalRepititions, currentReptition) {
        var _this = this;
        if (this.state) {
            return;
        }
        var currentExercise = exerciseSet.currentExercise;
        var nextExercise = exerciseSet.nextExercise;
        var normalClick = this.audioBuffers.buffers['cowbell 1'];
        var endClick = this.audioBuffers.buffers['hip-hop snare'];
        var beatsPerExercise = currentExercise.getNumberOfBeats();
        var click = currentReptition == totalRepititions ? endClick : normalClick;
        var startTime = nextStartTime;
        // Play a repitition of the exercise
        if (currentReptition == 1) {
            this.schedule(startTime - .001, this.audioBuffers.silence, function () { return _this.startExercise.emit([currentExercise, nextExercise]); });
        }
        this.schedule(startTime - .001, this.audioBuffers.silence, function () { return _this.repitition.emit(currentReptition); });
        var _loop_3 = function(beat) {
            if (beat == beatsPerExercise) {
                this_3.schedule(startTime, click, function () {
                    _this.exerciseBeat.emit(beat);
                    // Repeat exercise if there are more repititions to play
                    if (currentReptition < totalRepititions) {
                        _this.playExercise(exerciseSet, startTime, interval, totalRepititions, currentReptition + 1);
                    }
                    else {
                        // Start next exercise if there is one.
                        if (exerciseSet.next() != null) {
                            _this.schedule(startTime - .1, _this.audioBuffers.silence, function () {
                                return _this.endExercise.emit([exerciseSet.currentExercise,
                                    exerciseSet.nextExercise]);
                            });
                            _this.playExercise(exerciseSet, startTime, interval, totalRepititions, 1);
                        }
                        else {
                            _this.schedule(nextStartTime, _this.audioBuffers.silence, function () { return _this.endExerciseSet.emit({}); });
                        }
                    }
                });
            }
            else {
                this_3.schedule(startTime, click, function () { return _this.exerciseBeat.emit(beat); });
            }
            startTime += interval;
        };
        var this_3 = this;
        for (var beat = 1; beat <= beatsPerExercise; beat++) {
            _loop_3(beat);
        }
    };
    /*
      pause() {
        // will have to change the start time of the call back
        // in the last measure beat
        this.state = MetronomeState.Paused;
        this.pauseTime = this.audioContext.currentTime;
        let clicks = this.scheduledClicks;
        let events = this.scheduledEvents;
        //this.scheduledClicks = new Array<StartedNode>();
        //this.scheduledEvents = new Array<StartedNode>();
        for (let started of clicks) {
          started.node.stop();
          // put unplayed clicks in new schedule
          if (started.startTime > this.pauseTime) {
            this.resetSourceNode(started);
            this.scheduledClicks.push(started);
          }
        }
        for (let started of events) {
          started.node.stop();
          if (started.startTime > this.pauseTime) {
            this.resetSourceNode(started);
            this.scheduledEvents.push(started);
          }
        }
    
      }
    
      resetSourceNode(oldNode: StartedNode) {
        let newNode = this.audioContext.createBufferSource();
        newNode.connect(this.audioBuffers.audioContext.destination);
        newNode.buffer = oldNode.node.buffer;
        newNode.onended = oldNode.node.onended;
        oldNode.node = newNode;
      }
    
      resume() {
    
      }
    */
    Metronome.prototype.stop = function () {
        this.state = MetronomeState.Stopped;
        for (var _i = 0, _a = this.scheduledClicks; _i < _a.length; _i++) {
            var started = _a[_i];
            started.node.stop();
        }
        for (var _b = 0, _c = this.scheduledEvents; _b < _c.length; _b++) {
            var started = _c[_b];
            started.node.stop();
        }
        this.scheduledClicks = new Array();
        this.scheduledEvents = new Array();
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "startExerciseSet", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "startDelay", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "countdown", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "endDelay", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "startCountIn", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "countInBeat", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "endCountIn", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "startExercises", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "startExercise", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "exerciseBeat", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "repitition", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "endExercise", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], Metronome.prototype, "endExerciseSet", void 0);
    Metronome = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], Metronome);
    return Metronome;
}());
var StartedNode = (function () {
    function StartedNode(node, startTime) {
        this.node = node;
        this.startTime = startTime;
    }
    return StartedNode;
}());
var DelayBeat = (function () {
    function DelayBeat(countdownValue) {
        this.countdownValue = countdownValue;
    }
    return DelayBeat;
}());
//# sourceMappingURL=metronome.js.map