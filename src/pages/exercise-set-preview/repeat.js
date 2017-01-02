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
export var RepeatForm = (function () {
    function RepeatForm(navCtrl, params) {
        this.navCtrl = navCtrl;
        this.minMeasures = 1;
        this.minRepeats = 1;
        this.maxRepeats = 99;
        this.numMeasures = 1;
        this.numRepeats = 1;
        this.callback = params.get('create');
        this.maxMeasures = params.get('maxMeasures');
    }
    RepeatForm.prototype.create = function () {
        this.callback(this.numMeasures, this.numRepeats);
        this.navCtrl.pop();
    };
    RepeatForm.prototype.cancel = function () {
        this.navCtrl.pop();
    };
    RepeatForm = __decorate([
        Component({
            selector: 'new-repeat',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\repeat.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Define Repeat</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n    <ion-list>\n\n        <ion-item>\n\n            <ion-label>Number of Measures</ion-label>\n\n            <ion-range pin="true" [min]="minMeasures" [max]="maxMeasures" [step]="1" [(ngModel)]="numMeasures" color="primary">\n\n                <ion-label range-left>Min: {{ minMeasures }}</ion-label>\n\n                <ion-label range-right>Max: {{ maxMeasures }}</ion-label>\n\n            </ion-range>\n\n            <ion-badge>{{ numMeasures }}</ion-badge>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label>Number of Repeats</ion-label>\n\n            <ion-range pin="true" [min]="minRepeats" [max]="maxRepeats" [step]="1" [(ngModel)]="numRepeats" color="primary">\n\n                <ion-label range-left>Min: {{ minRepeats }}</ion-label>\n\n                <ion-label range-right>Max: {{ maxRepeats }}</ion-label>\n\n            </ion-range>\n\n            <ion-badge>{{ numRepeats }}</ion-badge>\n\n        </ion-item>\n\n        <button ion-button (click)="create()">Create</button>\n\n        <button ion-button (click)="cancel()">Cancel</button>\n\n    </ion-list>\n\n</ion-content>'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\repeat.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController, NavParams])
    ], RepeatForm);
    return RepeatForm;
}());
//# sourceMappingURL=repeat.js.map