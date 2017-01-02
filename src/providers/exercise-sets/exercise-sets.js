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
import { Injectable } from '@angular/core';
import { Authenticator } from '../../providers/authenticator/authenticator';
import { HttpService } from '../../providers/http-service/http-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
export var ExerciseSets = (function () {
    function ExerciseSets(httpService) {
        this.httpService = httpService;
    }
    ExerciseSets.prototype.unload = function () {
        this.currentExerciseSet = null;
        this.user = null;
        this.items = null;
    };
    ExerciseSets.prototype.load = function (user) {
        this.user = user;
        this.items = [];
        this.currentExerciseSet = null;
        var currentId = user.settings.currentExerciseSet;
        for (var key in user.rawExerciseSets) {
            var isOwner = user.rawExerciseSets[key]['ownerId'] == user.id;
            var newSet = new ExerciseSet(this.httpService, user, user.rawExerciseSets[key], isOwner);
            this.items.push(newSet);
            if (newSet.id == user.settings.currentExerciseSet) {
                this.currentExerciseSet = newSet;
            }
        }
        if (this.currentExerciseSet == null) {
            return Observable.create(function (observer) { return observer.next(); });
        }
        else {
            return this.currentExerciseSet.
                loadExercises(this.httpService, user);
        }
    };
    ExerciseSets.prototype.newExerciseSet = function (initializer) {
        var _this = this;
        return this.httpService.postPersistedObject(HttpService.clientExerciseSets(this.user.id), initializer)
            .map(function (result) {
            var newSet = new ExerciseSet(_this.httpService, _this.user, result, true);
            _this.items.push(newSet);
            return newSet.id;
        });
    };
    ExerciseSets.prototype.updateCurrentExerciseSetMetadata = function (metadata) {
        var _this = this;
        var fields = ['name', 'category', 'comments'];
        return this.httpService.putPersistedObject(HttpService.clientExerciseSet(this.user.id, this.currentExerciseSet.id), metadata).map(function (result) {
            for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                var field = fields_1[_i];
                if (result.hasOwnProperty(field)) {
                    _this.currentExerciseSet[field] = result[field];
                }
            }
            return result;
        });
    };
    ExerciseSets.prototype.removeCurrentExerciseSet = function () {
        return this.httpService.deletePersistedObject(HttpService.removeExerciseSet(this.user.id, this.currentExerciseSet.id))
            .map(function (result) {
            // need to slice out removed set then set current set to a random 
            // one if it exists....see server comments
        });
    };
    ExerciseSets.prototype.setCurrentExerciseSet = function (exerciseSetId) {
        var _this = this;
        this.user.settings.currentExerciseSet = exerciseSetId;
        if (this.currentExerciseSet != null) {
            this.currentExerciseSet.unloadExercises();
        }
        this.currentExerciseSet = this.findExerciseSet(exerciseSetId);
        return this.httpService.putPersistedObject(HttpService.userSettings(this.user.id), {
            id: this.user.settings.id,
            currentExerciseSet: exerciseSetId
        }).flatMap(function (obj) {
            if (exerciseSetId == null) {
                return Observable.of(null);
            }
            return _this.currentExerciseSet.
                loadExercises(_this.httpService, _this.user);
        });
    };
    ExerciseSets.prototype.findExerciseSet = function (exerciseSetId) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var exerciseSet = _a[_i];
            if (exerciseSet.id == exerciseSetId) {
                return exerciseSet;
            }
        }
        return null;
    };
    ExerciseSets = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpService])
    ], ExerciseSets);
    return ExerciseSets;
}());
var ExerciseSet = (function () {
    function ExerciseSet(httpService, user, rawExerciseSet, isOwner) {
        this.httpService = httpService;
        this.user = user;
        this.nextIndex = -1;
        this.exercises = {};
        this.disabledExercises = {};
        this.filter = '?filter[include][exercises]';
        this._exercisesLoaded = false;
        this._isOwner = false;
        this.name = rawExerciseSet['name'];
        this.id = rawExerciseSet['id'];
        this.category = rawExerciseSet['category'];
        this.comments = rawExerciseSet['comments'];
        this.exerciseOrdering = rawExerciseSet['exerciseOrdering'];
        for (var _i = 0, _a = rawExerciseSet['disabledExercises']; _i < _a.length; _i++) {
            var exerciseId = _a[_i];
            this.disabledExercises[exerciseId] = true;
        }
        this._isOwner = isOwner;
    }
    Object.defineProperty(ExerciseSet.prototype, "isOwner", {
        get: function () {
            return this._isOwner;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseSet.prototype.shareExerciseSet = function (email) {
        return this.httpService.postPersistedObject(HttpService.shareExerciseSet(this.user.id), {
            comments: "here are my comments",
            shareWith: 5,
            exerciseSetId: 1,
        });
    };
    ExerciseSet.prototype.newExercise = function (initializer) {
        var _this = this;
        initializer['exerciseSetId'] = this.id;
        initializer['created'] = new Date();
        return this.httpService.postPersistedObject(HttpService.createdExercises(this.id), initializer)
            .map(function (result) {
            var exercise = result['exercise'];
            console.log('exercise: ' + exercise["id"]);
            console.dir(exercise);
            _this.exercises[exercise['id']] = new Exercise(exercise);
            _this.exerciseOrdering.push(exercise['id']);
            return exercise['id'];
        });
    };
    ExerciseSet.prototype.save = function (exercise, fieldsToSave) {
        var newData = new Object();
        newData['id'] = exercise.id;
        for (var _i = 0, fieldsToSave_1 = fieldsToSave; _i < fieldsToSave_1.length; _i++) {
            var field = fieldsToSave_1[_i];
            if (field == 'notation') {
                newData[field] = Encoding.encode(exercise.display);
            }
            else {
                newData[field] = exercise[field];
            }
        }
        return this.httpService.putPersistedObject(HttpService.exercise(exercise.id), newData);
    };
    ExerciseSet.prototype.delete = function (exercise) {
        var url = HttpService.exerciseSetExercise(this.id, exercise.id);
        return this.httpService.deletePersistedObject(url);
    };
    ExerciseSet.prototype.disableExercise = function (exerciseId) {
        this.disabledExercises[exerciseId] = true;
    };
    ExerciseSet.prototype.enableExercise = function (exerciseId) {
        delete this.disabledExercises[exerciseId];
    };
    Object.defineProperty(ExerciseSet.prototype, "exercisesLoaded", {
        get: function () {
            return this._exercisesLoaded;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseSet.prototype.loadExercises = function (httpService, user) {
        var _this = this;
        return httpService.getPersistedObject(HttpService.ExerciseSetCollection +
            this.id + this.filter, Authenticator.newRequestOptions())
            .map(function (exerciseSet) {
            var exercises = exerciseSet['exercises'];
            for (var _i = 0, exercises_1 = exercises; _i < exercises_1.length; _i++) {
                var exercise = exercises_1[_i];
                _this.exercises[exercise['id']] = new Exercise(exercise);
            }
            _this._exercisesLoaded = true;
        });
    };
    ExerciseSet.prototype.unloadExercises = function () {
        for (var key in this.exerciseOrdering) {
            delete this.exercises[key];
        }
        this._exercisesLoaded = false;
    };
    ExerciseSet.prototype.next = function () {
        this.currentExercise = this.nextExercise;
        if (this.currentExercise != null) {
            this.setupNextExercise();
        }
        return this.currentExercise;
    };
    ExerciseSet.prototype.initIterator = function (ignoreDisabled) {
        if (ignoreDisabled === void 0) { ignoreDisabled = true; }
        this.ignoreDisabled = ignoreDisabled;
        this.currentExercise = null;
        this.nextIndex = -1;
        this.setupNextExercise();
    };
    ExerciseSet.prototype.setupNextExercise = function () {
        this.nextIndex = this.getNextEnabledIndex(this.nextIndex);
        this.nextExercise = (this.nextIndex >= 0) ?
            this.getExerciseByIndex(this.nextIndex) : null;
    };
    ExerciseSet.prototype.getNextEnabledIndex = function (index) {
        var nextIdx = index + 1;
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
    };
    ExerciseSet.prototype.getExerciseByIndex = function (index) {
        return this.exercises[this.exerciseOrdering[index]];
    };
    return ExerciseSet;
}());
// beats per measure must be bounded because of count in recording constraints
var Exercise = (function () {
    function Exercise(rawExercise) {
        this._display = Encoding.decode(rawExercise['notation']);
        this._id = rawExercise['id'];
        this.name = rawExercise['name'];
        this.category = rawExercise['category'];
        if (rawExercise.hasOwnProperty('comments')) {
            this.comments = rawExercise['comments'];
        }
    }
    Object.defineProperty(Exercise.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exercise.prototype, "display", {
        get: function () {
            return this._display;
        },
        enumerable: true,
        configurable: true
    });
    Exercise.prototype.getNumberOfBeats = function () {
        var numBeats = 0;
        var groupCount = 0;
        var measureBeats = [];
        var measureIndex = 0;
        // Skip first measure bar
        for (var i = 0; i < this.display.length; i++) {
            var element = this.display.getElement(i);
            if (element instanceof GroupSeparator) {
                groupCount++;
            }
            if (element instanceof MeasureSeparator) {
                measureBeats.push(groupCount);
                numBeats += groupCount;
                groupCount = 0;
            }
            if (element instanceof Repeat) {
                var last = measureBeats.length - 1;
                var repeat = element;
                var beatTotal = 0;
                for (var j = last; j >= last - repeat.numMeasures; --j) {
                    beatTotal += measureBeats[j];
                }
                numBeats += beatTotal * repeat.numRepeats;
            }
        }
        return numBeats;
    };
    return Exercise;
}());
export var ExerciseElements = (function () {
    function ExerciseElements(elements) {
        this.elements = elements;
        this._onCursorChange = null;
        this.resetCursor();
    }
    ExerciseElements.prototype.encode = function () {
        return Encoding.encode(this.elements);
    };
    ExerciseElements.prototype.takeSnapShot = function () {
        this.notationSnapshot = Encoding.encode(this.elements);
    };
    Object.defineProperty(ExerciseElements.prototype, "isDirty", {
        get: function () {
            var newEncoding = Encoding.encode(this);
            return this.notationSnapshot != newEncoding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExerciseElements.prototype, "snapShot", {
        get: function () {
            return this.snapShot;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseElements.prototype.revertToSnapShot = function () {
        this.elements = Encoding.
            decode(this.notationSnapshot, true);
    };
    ExerciseElements.prototype.deleteSnapShot = function () {
        this.notationSnapshot = null;
    };
    Object.defineProperty(ExerciseElements.prototype, "encoded", {
        get: function () {
            return Encoding.encode(this.elements);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExerciseElements.prototype, "cursorAtEnd", {
        get: function () {
            return this._cursorPosition == this.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExerciseElements.prototype, "length", {
        get: function () {
            return this.elements.length;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseElements.prototype.getElement = function (index) {
        return this.elements[index];
    };
    ExerciseElements.prototype.measuresBeforeCursor = function () {
        var count = 0;
        for (var i = this.cursorPosition - 1; i > 0; i--) {
            if (this.elements[i] instanceof Repeat) {
                count--;
                break;
            }
            if (this.elements[i] instanceof MeasureSeparator) {
                count++;
            }
        }
        return count;
    };
    ExerciseElements.prototype.elementAtCursorIs = function (type) {
        if (this.cursorPosition == 0) {
            return false;
        }
        return this.elementAtCursor() instanceof type;
    };
    ExerciseElements.prototype.elementAfterCursorIs = function (type) {
        if (this.cursorPosition == this.length) {
            return false;
        }
        return this.getElement(this.cursorPosition) instanceof type;
    };
    // At the zero position, there is nothing at (before) the cursor
    // otherwise test the character before the cursor.
    ExerciseElements.prototype.elementAtCursor = function () {
        if (this.cursorPosition == 0) {
            return null;
        }
        return this.elements[this.cursorPosition - 1];
    };
    ExerciseElements.prototype.resetCursor = function () {
        this.cursorPosition = 0;
    };
    // Delete the element behind the cursor
    ExerciseElements.prototype.deleteAtCursor = function () {
        if (this.cursorPosition == 0) {
            return;
        }
        this.elements.splice(this.cursorPosition - 1, 1);
        this.cursorBack();
        if (this.elementAtCursorIs(Repeat)) {
            this.deleteAtCursor();
        }
    };
    // Insert an element in front of the cursor past the new element.
    ExerciseElements.prototype.insertAtCursor = function (element) {
        var elementAfterCursor = this.cursorPosition < this.length ?
            this.getElement(this.cursorPosition) : '';
        if (element instanceof GroupSeparator) {
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
    };
    ExerciseElements.prototype.cursorForward = function () {
        this.cursorPosition = Math.min(this.length, this.cursorPosition + 1);
    };
    ExerciseElements.prototype.cursorBack = function () {
        this.cursorPosition = Math.max(0, this._cursorPosition - 1);
    };
    Object.defineProperty(ExerciseElements.prototype, "cursorPosition", {
        get: function () {
            return this._cursorPosition;
        },
        set: function (position) {
            this._cursorPosition = position;
            if (this.cursorChanged) {
                this.cursorChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    ExerciseElements.prototype.longestStrokeGroup = function () {
        var longestGroup = 0;
        var currentGroupCount = 0;
        var inGroup = false;
        var groupCounts = [];
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
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
        return longestGroup;
    };
    return ExerciseElements;
}());
export var Encoding = (function () {
    function Encoding() {
    }
    Encoding.encode = function (elements) {
        var encoding = Encoding.exerciseStart;
        for (var i = 0; i < elements.length; i++) {
            if (elements instanceof ExerciseElements) {
                encoding += elements.getElement(i).encoding;
            }
            else {
                encoding += elements[i].encoding;
            }
        }
        return encoding;
    };
    Encoding.decode = function (encoded, asArray) {
        if (asArray === void 0) { asArray = false; }
        var elements = [];
        var beginExercise = false;
        var encodedIndex = 0;
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
            var element = null;
            for (var _i = 0, _a = this.exerciseElements; _i < _a.length; _i++) {
                var elementObj = _a[_i];
                element = elementObj.tryParse(encoded, encodedIndex);
                if (element != null) {
                    elements.push(element);
                    break;
                }
            }
            if (element == null) {
                throw encoded[encodedIndex] +
                    " isn't the start of an exercise element";
            }
            encodedIndex += element.length;
        }
        if (asArray) {
            return elements;
        }
        return new ExerciseElements(elements);
    };
    Encoding.getMeasureCount = function (encoding) {
        if (encoding.length == 0) {
            return 0;
        }
        var count = 1;
        for (var i = 0; i < encoding.length; i++) {
            if (encoding[i] == Encoding.measureSeparator) {
                count++;
            }
        }
        return count;
    };
    Encoding.satisfiesBeatsPerMeasureConstraint = function (encoding) {
        // @todo
        return false;
    };
    Encoding.right = 'r';
    Encoding.left = 'l';
    Encoding.both = 'b';
    Encoding.accectedRight = 'R';
    Encoding.accentedLeft = 'L';
    Encoding.accentedBoth = 'B';
    Encoding.rest = '-';
    Encoding.measureSeparator = '|';
    Encoding.groupSeparator = ' ';
    Encoding.exerciseStart = '#';
    Encoding.graceStart = '[';
    Encoding.graceEnd = ']';
    Encoding.noGrace = 0;
    Encoding.flam = 1;
    Encoding.drag = 2;
    Encoding.ruff = 3;
    Encoding.buzz = 4;
    // Keep this up-to-date!!!
    Encoding.graceCount = 5;
    Encoding.repeatStart = '<';
    Encoding.repeatEnd = '>';
    Encoding.repeatDivider = ':';
    Encoding.strokes = 'rlbRLB-';
    Encoding.graces = '123z';
    return Encoding;
}());
export var ExerciseElement = (function () {
    function ExerciseElement() {
        this._length = 1;
    }
    Object.defineProperty(ExerciseElement.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseElement.prototype.setLength = function (l) {
        this._length = l;
    };
    ExerciseElement.prototype.tryParse = function (encoded, index) {
        return null;
    };
    Object.defineProperty(ExerciseElement.prototype, "encoding", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    return ExerciseElement;
}());
export var MeasureSeparator = (function (_super) {
    __extends(MeasureSeparator, _super);
    function MeasureSeparator() {
        _super.apply(this, arguments);
    }
    MeasureSeparator.prototype.tryParse = function (encoding, index) {
        if (encoding[index] == Encoding.measureSeparator) {
            return new MeasureSeparator();
        }
        return null;
    };
    Object.defineProperty(MeasureSeparator.prototype, "encoding", {
        get: function () {
            return Encoding.measureSeparator;
        },
        enumerable: true,
        configurable: true
    });
    return MeasureSeparator;
}(ExerciseElement));
export var GroupSeparator = (function (_super) {
    __extends(GroupSeparator, _super);
    function GroupSeparator() {
        _super.apply(this, arguments);
    }
    GroupSeparator.prototype.tryParse = function (encoding, index) {
        if (encoding[index] == Encoding.groupSeparator) {
            return new GroupSeparator();
        }
        return null;
    };
    Object.defineProperty(GroupSeparator.prototype, "encoding", {
        get: function () {
            return Encoding.groupSeparator;
        },
        enumerable: true,
        configurable: true
    });
    return GroupSeparator;
}(ExerciseElement));
export var Repeat = (function (_super) {
    __extends(Repeat, _super);
    function Repeat() {
        _super.apply(this, arguments);
    }
    Repeat.prototype.tryParse = function (encoding, index) {
        if (encoding[index] == Encoding.repeatStart) {
            var start = index;
            var end = encoding.indexOf(Encoding.repeatEnd);
            var components = encoding.substring(start + 1, end - 1).
                split(Encoding.repeatDivider);
            var repeat = new Repeat();
            repeat.numMeasures = parseInt(components[0]);
            repeat.numRepeats = parseInt(components[1]);
            repeat.setLength(end - start + 1);
            return repeat;
        }
        return null;
    };
    Object.defineProperty(Repeat.prototype, "encoding", {
        get: function () {
            return Encoding.repeatStart + this.numMeasures +
                Encoding.repeatDivider + this.numRepeats + Encoding.repeatEnd;
        },
        enumerable: true,
        configurable: true
    });
    return Repeat;
}(ExerciseElement));
export var Stroke = (function (_super) {
    __extends(Stroke, _super);
    function Stroke() {
        _super.apply(this, arguments);
    }
    Stroke.prototype.tryParse = function (encoding, index) {
        var char = encoding[index];
        if (!Encoding.strokes.includes(char) && (char != Encoding.graceStart)) {
            return null;
        }
        var strokeIndex = index;
        var grace = Encoding.noGrace;
        if (char == Encoding.graceStart) {
            grace = parseInt(encoding[strokeIndex + 1]);
            strokeIndex += 3;
        }
        var encodedStroke = encoding[strokeIndex];
        var upperStroke = encodedStroke.toUpperCase();
        var stroke = new Stroke();
        stroke.accented = encodedStroke == upperStroke && encodedStroke != Encoding.rest;
        stroke.grace = grace;
        stroke.hand = upperStroke;
        strokeIndex++;
        stroke.setLength(strokeIndex - index);
        return stroke;
    };
    Stroke.prototype.cycleGrace = function () {
        this.grace = (this.grace + 1) % Encoding.graceCount;
    };
    Object.defineProperty(Stroke.prototype, "encoding", {
        get: function () {
            var encoded = '';
            if (this.grace != Encoding.noGrace) {
                encoded = Encoding.graceStart + this.grace + Encoding.graceEnd;
            }
            encoded += this.accented ? this.hand : this.hand.toLowerCase();
            return encoded;
        },
        enumerable: true,
        configurable: true
    });
    return Stroke;
}(ExerciseElement));
//# sourceMappingURL=exercise-sets.js.map