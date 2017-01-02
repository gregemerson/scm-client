var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
export var CountDownPage = (function () {
    function CountDownPage(nav, navParams, viewController, changeDetect) {
        var _this = this;
        this.nav = nav;
        this.navParams = navParams;
        this.viewController = viewController;
        this.changeDetect = changeDetect;
        this.id = Math.random();
        this.countEmitter = navParams.get('countdown');
        this.subscription = this.countEmitter.subscribe(function (count) { return _this.countHandler(count); });
    }
    CountDownPage.prototype.countHandler = function (count) {
        if (count == 1) {
            this.subscription.unsubscribe();
            this.nav.pop();
            //this.nav.pop();
            return;
        }
        this.countdown = count;
        this.changeDetect.detectChanges();
    };
    CountDownPage = __decorate([
        Component({
            selector: 'countdown',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\countdown\countdown.html"*/'<!--\n  Generated template for the CountDownPage page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>Countdown</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <ion-card>\n    <ion-card-content>{{ countdown }}</ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\countdown\countdown.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, NavParams, ViewController, ChangeDetectorRef])
    ], CountDownPage);
    return CountDownPage;
}());
//# sourceMappingURL=countdown.js.map