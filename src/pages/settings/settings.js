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
import { NavController } from 'ionic-angular';
import { Authenticator } from '../../providers/authenticator/authenticator';
export var SettingsPage = (function () {
    function SettingsPage(nav, authenticator) {
        this.nav = nav;
        this.authenticator = authenticator;
        this.settings = authenticator.user.settings;
    }
    SettingsPage.prototype.saveClicked = function ($event) {
    };
    SettingsPage = __decorate([
        Component({
            selector: 'settings',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\settings\settings.html"*/'\n<ion-header>\n  <ion-navbar>\n    <ion-title>Settings</ion-title>\n    <app-buttons></app-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding class="settings">\n  <ion-list>\n    <ion-item>\n      <ion-label stacked>Number of Repetitions</ion-label>\n      <ion-input type="number" [(ngModel)]="settings.numberOfRepititions"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>Minimum Tempo</ion-label>\n      <ion-input type="number" [(ngModel)]="settings.minTempo"></ion-input>\n    </ion-item>\n        <ion-item>\n      <ion-label stacked>MaximumTempo</ion-label>\n      <ion-input type="number" [(ngModel)]="settings.maxTempo"></ion-input>\n    </ion-item>\n        <ion-item>\n      <ion-label stacked>Tempo Step</ion-label>\n      <ion-input type="number" [(ngModel)]="settings.stepTempo"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label stacked>Seconds Before Start</ion-label>\n      <ion-input type="number" [(ngModel)]="settings.secondsBeforeStart"></ion-input>\n    </ion-item> \n  </ion-list>\n  \n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\settings\settings.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController, Authenticator])
    ], SettingsPage);
    return SettingsPage;
}());
//# sourceMappingURL=settings.js.map