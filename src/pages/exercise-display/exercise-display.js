var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as ES from '../../providers/exercise-sets/exercise-sets';
export var ExerciseDisplay = (function () {
    function ExerciseDisplay(navCtrl) {
        this.navCtrl = navCtrl;
        this.exerciseFont = "px Courier, monospace";
        this.measureBar = '|';
        this.cursorWidth = 2;
        this.defaultLineWidth = -1;
        this._exerciseContext = null;
        this._cursorContext = null;
        this.endOfLineIndices = new Array();
        this.genericNote = 'X';
        this.graceColor = '#FF0000';
        this.buzzColor = '#3F9FBF';
        this.restFillColor = '#9d9ea0';
    }
    ExerciseDisplay.prototype.setNoteEndPosition = function (note) {
        if (note === void 0) { note = this.genericNote; }
        var widths = this.noteWidths;
        var lastWidth = (widths.length == 0) ? 0 : widths[widths.length - 1];
        var width = note == '' ? 0 : this.getTotalNoteWidth(note);
        this.noteWidths.push(lastWidth + width);
        return width;
    };
    ExerciseDisplay.prototype.getTotalNoteWidth = function (note) {
        if (note === void 0) { note = this.genericNote; }
        return this.getNoteWidth(note) + this.noteSpacing;
    };
    ExerciseDisplay.prototype.getNoteWidth = function (note) {
        if (note === void 0) { note = this.genericNote; }
        this.setNoteFont();
        return Math.ceil(this.getExerciseContext().
            measureText(note).width);
    };
    ExerciseDisplay.prototype.hide = function () {
        if (this.exerciseCanvas != undefined) {
            this.exerciseCanvas.width = 0;
            this.exerciseCanvas.height = 0;
        }
    };
    ExerciseDisplay.prototype.getExerciseContext = function () {
        if (this._exerciseContext == null) {
            this._exerciseContext = this.exerciseCanvas.getContext('2d');
            this._exerciseContext.textAlign = 'left';
            this.defaultLineWidth = this._exerciseContext.lineWidth;
        }
        return this._exerciseContext;
    };
    ExerciseDisplay.prototype.getCursorContext = function () {
        if (this._cursorContext == null) {
            this._cursorContext = this.cursorCanvas.getContext('2d');
        }
        return this._cursorContext;
    };
    ExerciseDisplay.prototype.getDisplayWidth = function () {
        var left = Number.parseFloat(getComputedStyle(this.container.nativeElement).paddingLeft);
        var right = Number.parseFloat(getComputedStyle(this.container.nativeElement).paddingRight);
        return this.container.nativeElement.clientWidth - Math.ceil(left + right);
    };
    ExerciseDisplay.prototype.positionInContainer = function () {
        var width = this.getDisplayWidth();
        this.exerciseCanvas.width = width;
        this.cursorCanvas.width = width;
        this.cursorCanvas.style.top = getComputedStyle(this.container.nativeElement).paddingTop;
        this.cursorCanvas.style.left = getComputedStyle(this.container.nativeElement).paddingLeft;
    };
    ExerciseDisplay.prototype.drawCursor = function (position) {
        this.setupRegions();
        var widthIndexOffset = 0;
        for (var _i = 0, _a = this.endOfLineIndices; _i < _a.length; _i++) {
            var endOfLine = _a[_i];
            if (position > endOfLine + 1) {
                this.moveNextLine();
                widthIndexOffset++;
            }
            else {
                break;
            }
        }
        this.clearCanvas(this.cursorCanvas);
        var context = this.getCursorContext();
        var x = this.noteWidths[position + widthIndexOffset] - this.noteSpacing / 2;
        var y = this.topPaddingY;
        context.lineWidth = this.cursorWidth;
        context.beginPath();
        context.moveTo(x, y);
        y = this.letterY;
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    };
    ExerciseDisplay.prototype.hideCursor = function () {
        this.clearCanvas(this.cursorCanvas);
    };
    ExerciseDisplay.prototype.clearCanvas = function (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    Object.defineProperty(ExerciseDisplay.prototype, "noteSpacing", {
        // Make sure that 1/2 of the spacing is an integer
        get: function () {
            this.setNoteFont();
            var lower = Math.ceil(0.25 * this.getExerciseContext().
                measureText(this.genericNote).width);
            return (lower % 2 == 0) ? lower : lower + 1;
        },
        enumerable: true,
        configurable: true
    });
    ExerciseDisplay.prototype.setNoteFont = function () {
        this.getExerciseContext().font = this.
            selectedFontSize.toString() + this.exerciseFont;
    };
    ExerciseDisplay.prototype.drawNoteFont = function (note, x, y, textColor, baseLine) {
        if (note === void 0) { note = ''; }
        if (x === void 0) { x = -1; }
        if (y === void 0) { y = -1; }
        if (textColor === void 0) { textColor = 'rgba(0, 0, 0, 1)'; }
        if (baseLine === void 0) { baseLine = 'bottom'; }
        this.setNoteFont();
        var context = this.getExerciseContext();
        context.strokeStyle = textColor;
        context.lineWidth = this.defaultLineWidth;
        context.textBaseline = baseLine;
        context.fillRect;
        if (note != '') {
            context.strokeText(note, x, y);
        }
    };
    ExerciseDisplay.prototype.setFontVerticalSpacing = function () {
        this.clearCanvas(this.exerciseCanvas);
        var width = this.getNoteWidth('R');
        var height = this.selectedFontSize;
        var ctx = this.getExerciseContext();
        ctx.fillStyle = 'rgba(200, 0, 0, .8)';
        ctx.fillRect(0, 0, width, height);
        this.drawNoteFont('R', 0, height, 'rgba(0, 0, 0, 1)');
        var imageData = ctx.getImageData(0, 0, width, height).data;
        var upper = 0;
        var lower = 0;
        var middle = 0;
        var rowLength = 4 * width;
        for (var row = 0; row < height; row++) {
            // Scan row
            var hasNote = false;
            for (var column = 0; column < width; column++) {
                if (imageData[(4 * column) + (row * rowLength)] == 0) {
                    hasNote = true;
                    break;
                }
            }
            if (hasNote) {
                middle++;
            }
            else {
                upper += middle == 0 ? 1 : 0;
                lower += middle != 0 ? 1 : 0;
            }
        }
        this.noteTopSpacing = upper - 1;
        this.noteBottomSpacing = lower + 3;
        this.clearCanvas(this.exerciseCanvas);
    };
    ExerciseDisplay.prototype.draw = function (exercise, container, maxHeight, desiredFontSize) {
        this.container = container;
        this.clearCanvas(this.exerciseCanvas);
        this.clearCanvas(this.cursorCanvas);
        this.positionInContainer();
        this.createLayout(exercise, maxHeight, desiredFontSize);
        this.exerciseCanvas.height = this.endOfLineIndices.length * this.bottomPaddingY;
        this.cursorCanvas.height = this.exerciseCanvas.height;
        var context = this.getExerciseContext();
        var elementIndex = 0;
        var display = exercise.display;
        this.noteWidths = [];
        this.setFontVerticalSpacing();
        for (var lineIdx = 0; lineIdx < this.endOfLineIndices.length; lineIdx++) {
            this.noteWidths.push(this.noteSpacing);
            this.resetNoteX();
            var lineStart = this.noteX;
            var lastIndex = this.endOfLineIndices[lineIdx];
            var firstWrite = true;
            while (elementIndex <= lastIndex) {
                var element = display.getElement(elementIndex);
                if (element instanceof ES.Stroke) {
                    var drawInfo = this.drawNotes(display, elementIndex);
                    // Move index to end of stroke group
                    elementIndex += drawInfo.noteCount - 1;
                    this.noteX = drawInfo.endX;
                }
                else if (element instanceof ES.MeasureSeparator) {
                    this.noteX += this.drawMeasureSeparator();
                }
                else if (element instanceof ES.GroupSeparator) {
                    this.noteX += this.drawGroupSeparator(firstWrite);
                }
                else if (element instanceof ES.Repeat) {
                    this.noteX += this.drawRepeat(element);
                }
                firstWrite = false;
                elementIndex++;
            }
            this.moveNextLine();
        }
        return this.exerciseCanvas.height;
    };
    ExerciseDisplay.prototype.createLayout = function (exercise, maxHeight, fontSize) {
        var context = this.getExerciseContext();
        this.selectedFontSize = fontSize;
        var noteWidth;
        var longestGroupLength = exercise.display.longestStrokeGroup();
        // Guarantee that the longest stroke group will fit within a line
        while (true) {
            this.setNoteFont();
            noteWidth = this.getTotalNoteWidth();
            var currentWidthNeeded = (longestGroupLength * noteWidth) + this.noteSpacing;
            if (currentWidthNeeded <= this.exerciseCanvas.width) {
                break;
            }
            else {
                if (this.selectedFontSize == 0) {
                    break;
                }
                this.selectedFontSize--;
            }
        }
        // Now find line breaks which can only be ' ' or '|'
        this.endOfLineIndices.length = 0;
        var usedWidth = 0;
        var breakCandidate = 0;
        var previousBreak = -1;
        var lastNewLine = -1;
        for (var elementIndex = 0; elementIndex < exercise.display.length; elementIndex++) {
            var element = exercise.display.getElement(elementIndex);
            // @todo note type widths should be encapsulated
            var currentWidth = (element instanceof ES.Repeat) ? 2 * noteWidth : noteWidth;
            if ((usedWidth + currentWidth) <= this.exerciseCanvas.width) {
                // See if element can be an eol
                if (!(element instanceof ES.Stroke)) {
                    lastNewLine = elementIndex;
                }
                usedWidth += currentWidth;
            }
            else {
                this.endOfLineIndices.push(lastNewLine - 1);
                elementIndex = lastNewLine;
                usedWidth = currentWidth;
            }
        }
        this.endOfLineIndices.push(exercise.display.length - 1);
        this.setupRegions();
    };
    ExerciseDisplay.prototype.setupRegions = function () {
        var fontSize = this.selectedFontSize;
        var context = this.getExerciseContext();
        var groupingFontSize = 0.6 * fontSize;
        this.topPaddingY = 0.1 * fontSize;
        this.accentY = this.topPaddingY + (0.2 * fontSize);
        this.accentPaddingY = this.accentY + (0.05 * fontSize);
        this.letterY = this.accentPaddingY + fontSize;
        this.graceNoteY = this.letterY + (0.3 * fontSize);
        this.groupingY = this.graceNoteY + (0.5 * fontSize);
        this.bottomPaddingY = this.groupingY + (0.1 * fontSize);
        this.resetNoteX();
    };
    ExerciseDisplay.prototype.resetNoteX = function () {
        this.noteX = this.noteSpacing;
    };
    ExerciseDisplay.prototype.moveNextLine = function () {
        var distanceY = this.bottomPaddingY;
        this.topPaddingY += distanceY;
        this.accentY += distanceY;
        this.accentPaddingY += distanceY;
        this.letterY += distanceY;
        this.graceNoteY += distanceY;
        this.underscoreY += distanceY;
        this.groupingY += distanceY;
        this.bottomPaddingY += distanceY;
        this.resetNoteX();
    };
    ExerciseDisplay.prototype.drawNotes = function (elements, startIndex) {
        var x = this.noteX;
        var context = this.getExerciseContext();
        var regionHeight = this.graceNoteY - this.letterY;
        var verticalCenter = this.letterY + (regionHeight / 2);
        var end = startIndex;
        while (end < elements.length) {
            end++;
            if (!(elements.getElement(end) instanceof ES.Stroke)) {
                break;
            }
        }
        for (var strokeIndex = startIndex; strokeIndex < end; strokeIndex++) {
            var stroke = elements.getElement(strokeIndex);
            if (stroke.accented) {
                this.drawAccent(x);
            }
            if (stroke.hand == ES.Encoding.rest) {
                this.drawRest(stroke.hand, x);
            }
            else {
                this.drawNoteFont(stroke.hand, x, this.letterY);
            }
            var endPosition = this.setNoteEndPosition(stroke.hand);
            var noteWidth = this.getNoteWidth(stroke.hand);
            if (stroke.grace != 0) {
                if (stroke.grace == ES.Encoding.buzz) {
                    context.lineWidth = regionHeight / 2;
                    context.strokeStyle = this.buzzColor;
                    context.beginPath();
                    context.moveTo(x, this.letterY - this.noteBottomSpacing);
                    context.lineTo(x + noteWidth, this.letterY - this.noteBottomSpacing);
                    context.stroke();
                    context.closePath();
                }
                else {
                    context.lineWidth = regionHeight / 4;
                    context.strokeStyle = this.graceColor;
                    context.beginPath();
                    for (var i = 0; i < stroke.grace; i++) {
                        var y = this.letterY + (2 * i * context.lineWidth) - this.noteBottomSpacing;
                        context.moveTo(x, y);
                        context.lineTo(x + noteWidth, y);
                    }
                    context.stroke();
                    context.closePath();
                }
            }
            x += endPosition;
        }
        this.drawGroupLines(x - this.noteX - this.noteSpacing, end - startIndex);
        return new NoteDrawInfo(end - startIndex, x);
    };
    ExerciseDisplay.prototype.drawRepeat = function (repeat) {
        var endPosition = this.setNoteEndPosition('XX');
        var noteWidth = this.getNoteWidth('XX');
        var startX = this.noteX;
        var endX = startX + noteWidth;
        var halfHeight = (this.groupingY - this.accentPaddingY) / 2;
        var verticalCenter = this.groupingY - halfHeight;
        var context = this.getExerciseContext();
        // Draw divider
        context.lineWidth = 0.06 * this.selectedFontSize;
        context.beginPath();
        context.moveTo(startX, verticalCenter);
        context.lineTo(endX, verticalCenter);
        context.stroke();
        context.closePath();
        // Draw values
        context.font = (0.8 * halfHeight) + this.exerciseFont;
        var top = repeat.numMeasures.toString();
        var bottom = repeat.numRepeats.toString();
        var topWidth = context.measureText(repeat.numMeasures.toString()).width;
        var bottomWidth = context.measureText(repeat.numRepeats.toString()).width;
        var offsetX = (noteWidth - context.measureText(top).width) / 2;
        context.textBaseline = 'top';
        context.strokeText(top, startX + offsetX, this.accentY);
        offsetX = (noteWidth - context.measureText(bottom).width) / 2;
        context.textBaseline = 'bottom';
        context.strokeText(bottom, startX + offsetX, this.letterY);
        return endPosition;
    };
    ExerciseDisplay.prototype.drawGroupSeparator = function (isFirstPositionOnLine) {
        if (isFirstPositionOnLine === void 0) { isFirstPositionOnLine = false; }
        var char = isFirstPositionOnLine ? '' : 'X';
        return this.setNoteEndPosition(char);
    };
    ExerciseDisplay.prototype.drawMeasureSeparator = function () {
        var noteWidth = this.getNoteWidth();
        var context = this.getExerciseContext();
        var middleX = this.noteX + (noteWidth / 2);
        context.lineWidth = noteWidth * 0.1;
        context.beginPath();
        context.moveTo(middleX, this.accentPaddingY);
        context.lineTo(middleX, this.groupingY);
        context.stroke();
        context.closePath();
        return this.setNoteEndPosition();
    };
    ExerciseDisplay.prototype.drawRest = function (noteChar, xPos) {
        var context = this.getExerciseContext();
        var restWidth = this.getNoteWidth(noteChar);
        var restHeight = this.selectedFontSize -
            this.noteBottomSpacing - this.noteTopSpacing;
        var centerX = xPos + (restWidth / 2);
        var centerY = ((this.letterY - this.noteBottomSpacing) +
            (this.accentPaddingY + this.noteTopSpacing)) / 2;
        var radius = .8 * Math.min(restWidth / 2, restHeight / 2);
        context.fillStyle = this.restFillColor;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
    };
    ExerciseDisplay.prototype.drawGroupLines = function (groupWidth, numNotes) {
        var context = this.getExerciseContext();
        context.textBaseline = 'middle';
        context.strokeStyle = 'black';
        var regionHeight = this.groupingY - this.graceNoteY;
        // Account for notes and note spacing
        var regionWidth = groupWidth;
        context.font = regionHeight + this.exerciseFont;
        var halfCharWidth = context.measureText(numNotes.toString()).width / 2;
        var beginNumX = this.noteX + (regionWidth / 2) - halfCharWidth;
        var endNumX = this.noteX + (regionWidth / 2) + halfCharWidth;
        var lineY = this.graceNoteY + (regionHeight / 2) - this.noteBottomSpacing;
        context.strokeText(numNotes.toString(), beginNumX, lineY);
        context.lineWidth = 0.1 * regionHeight;
        context.beginPath();
        context.moveTo(this.noteX, lineY);
        context.lineTo(beginNumX, lineY);
        context.moveTo(endNumX, lineY);
        context.lineTo(this.noteX + regionWidth, lineY);
        context.stroke();
        context.closePath();
    };
    ExerciseDisplay.prototype.drawAccent = function (x) {
        var context = this.getExerciseContext();
        var middleY = (this.topPaddingY + this.accentY) / 2;
        var accentWidth = .80 * this.getNoteWidth();
        context.lineWidth = .05 * this.selectedFontSize;
        context.beginPath();
        context.strokeStyle = "black";
        context.moveTo(x, this.topPaddingY);
        context.lineTo(x + accentWidth, middleY);
        context.lineTo(x, this.accentY);
        context.stroke();
        context.closePath();
    };
    ExerciseDisplay.prototype.ngAfterViewInit = function () {
        this.exerciseCanvas = this.canvasElement.nativeElement;
        this.cursorCanvas = this.cursorElement.nativeElement;
        this.exerciseCanvas.width = 0;
        this.exerciseCanvas.height = 0;
        this.cursorCanvas.width = 0;
        this.exerciseCanvas.height = 0;
    };
    __decorate([
        ViewChild("exerciseCanvas"), 
        __metadata('design:type', ElementRef)
    ], ExerciseDisplay.prototype, "canvasElement", void 0);
    __decorate([
        ViewChild("cursorCanvas"), 
        __metadata('design:type', ElementRef)
    ], ExerciseDisplay.prototype, "cursorElement", void 0);
    ExerciseDisplay = __decorate([
        Component({
            selector: 'exercise-display',
            styles: [
                ".exercise-canvas {\n        z-index: 2;\n        border-style: solid;\n        border-color: green;       \n     }",
                ".cursor-canvas {\n        z-index: 3;\n        position: absolute;\n        border-style: dotted;\n        border-color: red;\n     }"
            ],
            template: "<canvas #exerciseCanvas class=\"exercise-canvas\"></canvas>\n             <canvas #cursorCanvas class=\"cursor-canvas\"></canvas>",
        }), 
        __metadata('design:paramtypes', [NavController])
    ], ExerciseDisplay);
    return ExerciseDisplay;
}());
var NoteDrawInfo = (function () {
    function NoteDrawInfo(noteCount, endX) {
        this.noteCount = noteCount;
        this.endX = endX;
    }
    return NoteDrawInfo;
}());
//# sourceMappingURL=exercise-display.js.map