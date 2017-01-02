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
export var GuidePage = (function () {
    function GuidePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    GuidePage = __decorate([
        Component({
            selector: 'guide',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\guide\guide.html"*/'\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>guide</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\guide\guide.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController])
    ], GuidePage);
    return GuidePage;
}());
//# sourceMappingURL=guide.js.map