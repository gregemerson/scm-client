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
export var ShareExerciseSetForm = (function () {
    function ShareExerciseSetForm(formBuilder, navCtrl, params) {
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.emailCallback = params.get('emailCallback');
        this.shareForm = this.formBuilder.group({
            'email': ['', Validators.required]
        });
    }
    ShareExerciseSetForm.prototype.create = function () {
        this.emailCallback(this.shareForm.value.email);
        this.navCtrl.pop();
    };
    ShareExerciseSetForm.prototype.cancel = function () {
        this.navCtrl.pop();
    };
    ShareExerciseSetForm = __decorate([
        Component({
            selector: 'share-exercise-set',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\share-exercise-set.html"*/'<form [formGroup]="shareForm">\n\n    <ion-card>\n\n        <ion-card-content>\n\n            Enter the email address of the user you would like to share this exercise with.\n\n        </ion-card-content>\n\n    </ion-card>\n\n    <ion-item>\n\n        <ion-label>Email</ion-label>\n\n        <ion-input type="email" formControlName="email"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n        <ion-buttons start>\n\n            <button ion-button type="submit" [disabled]="!shareForm.valid" (click)="create()" color="primary" small>\n\n                <ion-icon name="checkmark"></ion-icon></button>\n\n            <button ion-button (click)="cancel()" color="danger" small>\n\n                <ion-icon name="close"></ion-icon>\n\n            </button>\n\n        </ion-buttons>\n\n    </ion-item>\n\n</form>'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\share-exercise-set.html"*/,
        }), 
        __metadata('design:paramtypes', [FormBuilder, NavController, NavParams])
    ], ShareExerciseSetForm);
    return ShareExerciseSetForm;
}());
//# sourceMappingURL=share-exercise-set.js.map