var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ExerciseConstraints } from './exercise-constraints';
export var NewExerciseSetForm = (function () {
    function NewExerciseSetForm(formBuilder, navCtrl, params) {
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.constraints = new ExerciseConstraints();
        this.callback = params.get('create');
        var initializer = params.get('initializer');
        var defaults = this.getDefaultValues();
        if (initializer) {
            for (var key in defaults) {
                if (initializer.hasOwnProperty(key)) {
                    defaults[key] = initializer[key];
                }
            }
        }
        this.newExerciseSet = this.formBuilder.group({
            name: [defaults['name'], Validators.maxLength(this.constraints.maxNameLength)],
            category: [defaults['category'], Validators.maxLength(this.constraints.maxCategoryLength)],
            comments: [defaults['comments'], Validators.maxLength(this.constraints.maxExerciseSetCommentsLength)],
        });
    }
    NewExerciseSetForm.prototype.ionViewLoaded = function () {
    };
    NewExerciseSetForm.prototype.create = function () {
        this.callback(this.newExerciseSet.value);
        this.navCtrl.pop();
    };
    NewExerciseSetForm.prototype.cancel = function () {
        this.navCtrl.pop();
    };
    NewExerciseSetForm.prototype.getDefaultValues = function () {
        return {
            name: '',
            category: '',
            comments: ''
        };
    };
    NewExerciseSetForm = __decorate([
        Component({
            selector: 'new-exercise-set',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\new-exercise-set.html"*/'<form [formGroup]="newExerciseSet">\n\n    <ion-item>\n\n        <ion-label>Name</ion-label>\n\n        <ion-input maxlength="constraints.maxNameLength" type="text" formControlName="name"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-label>Category</ion-label>\n\n        <ion-input maxlength="constraints.maxCategoryLength" type="text" formControlName="category"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-label>Comments</ion-label>\n\n        <ion-textarea maxlength="constraints.maxExerciseSetCommentsLength" formControlName="comments"></ion-textarea>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-buttons start>\n\n            <button ion-button type="submit" [disabled]="!newExerciseSet.valid" (click)="create()" color="primary" small>\n\n                <ion-icon name="checkmark"></ion-icon>\n\n            </button>\n\n            <button ion-button (click)="cancel()" color="danger" small>\n\n                <ion-icon name="trash"></ion-icon>\n\n            </button>\n\n        </ion-buttons>\n\n    </ion-item>\n\n</form>'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\new-exercise-set.html"*/,
        }), 
        __metadata('design:paramtypes', [FormBuilder, NavController, NavParams])
    ], NewExerciseSetForm);
    return NewExerciseSetForm;
}());
//# sourceMappingURL=new-exercise-set.js.map