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
import { HomePage } from '../home/home';
export var AppButtons = (function () {
    function AppButtons(navCtrl, authenticator) {
        this.navCtrl = navCtrl;
        this.authenticator = authenticator;
    }
    AppButtons.prototype.logout = function () {
        var _this = this;
        this.authenticator.logout().subscribe({
            next: function (res) {
                _this.navCtrl.push(HomePage);
            },
            error: function (err) {
                console.dir(err);
            }
        });
    };
    AppButtons = __decorate([
        Component({
            selector: 'app-buttons',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\app-buttons\app-buttons.html"*/'\n<ion-buttons end>\n  <button ion-button (click)="help()">\n    <ion-icon name="help"></ion-icon>\n  </button>\n  <button ion-button (click)="logout()">\n    <ion-icon name="exit"></ion-icon>\n  </button>\n</ion-buttons> \n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\app-buttons\app-buttons.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, Authenticator])
    ], AppButtons);
    return AppButtons;
}());
//# sourceMappingURL=app-buttons.js.map