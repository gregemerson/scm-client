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
import { NavController, NavParams } from 'ionic-angular';
export var WarningPage = (function () {
    function WarningPage(navCtrl, params) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.message = params.get('message');
        this.okCallback = params.get('okCallback');
    }
    WarningPage.prototype.onOk = function () {
        this.okCallback();
        this.navCtrl.pop();
    };
    WarningPage.prototype.onCancel = function () {
        this.navCtrl.pop();
    };
    WarningPage = __decorate([
        Component({
            selector: 'warning',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\messages\warning.html"*/'<ion-content padding>\n  <ion-card>\n    <ion-card-content>{{ message }}</ion-card-content>\n  </ion-card>\n  <ion-buttons start>\n    <button ion-button (click)="onOk()" color="primary" small>\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n    <button ion-button (click)="onCancel()" color="danger" small>\n      <ion-icon name="close"></ion-icon>\n    </button>\n  </ion-buttons>\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\messages\warning.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController, NavParams])
    ], WarningPage);
    return WarningPage;
}());
//# sourceMappingURL=warning.js.map