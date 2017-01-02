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
import { NavController, NavParams, ViewController } from 'ionic-angular';
export var LoginPage = (function () {
    function LoginPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.maxPasswordLength = 12;
        this.maxUsernameLength = 20;
        // Current accounts
        this.password = '';
        this.email = '';
        // For new accounts
        this.newUsername = '';
        this.newEmail = '';
        this.newPassword1 = '';
        this.newPassword2 = '';
        this.showError = false;
        // Usedf to switch between different control groups
        this.invisibilityMap = {
            'Menu': false,
            'LogIn': true,
            'CreateAccount': true
        };
        this.authenticator = navParams.get('authenticator');
    }
    LoginPage.prototype.onChange = function (form) {
        this.showError = false;
    };
    LoginPage.prototype.makeVisible = function (controlGroup) {
        for (var ctrl in this.invisibilityMap) {
            this.invisibilityMap[ctrl] = ctrl != controlGroup;
        }
        this.email = '';
        this.password = '';
        this.newEmail = '';
        this.newPassword1 = '';
        this.newPassword2 = '';
        this.showError = false;
    };
    LoginPage.prototype.logIn = function () {
        var _this = this;
        this.authenticator.login(this.email, this.password)
            .subscribe(function () {
            _this.viewCtrl.dismiss();
        }, function (err) {
            _this.showError = true;
            console.log(err);
            // Display errors
        }, function () {
        });
    };
    LoginPage.prototype.createAccount = function () {
        var _this = this;
        this.authenticator.createUser(this.newEmail, this.newPassword1, this.newUsername)
            .subscribe(function () {
            _this.viewCtrl.dismiss();
            // Now load the services for user
            // May "Welcome" + username while services are loading
        }, function (err) {
            console.log(err);
            // Display errors
        }, function () {
        });
    };
    LoginPage.prototype.loginGuest = function () {
        var _this = this;
        this.authenticator.loginGuest().subscribe(function (next) {
            _this.viewCtrl.dismiss();
        }, function (err) {
            console.log(err);
        }, function () {
        });
    };
    LoginPage = __decorate([
        Component({
            selector: 'login',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\login\login.html"*/'\n<ion-header>\n  <ion-navbar>\n    <ion-title>Log in/Sign up</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-card>\n  <ion-card-header fancy-text>Welcome to Stick Control Metronome!</ion-card-header>\n  <ion-card-content>\n    <ion-list [hidden]="invisibilityMap[\'Menu\']">\n      <ion-item>\n        <button ion-button (click)="makeVisible(\'LogIn\')" >Log In</button>\n        <button ion-button (click)="makeVisible(\'CreateAccount\')">Create Account</button>\n        <button ion-button (click)="loginGuest()">Guest</button>\n      </ion-item>\n    </ion-list>\n    <ion-list [hidden]="invisibilityMap[\'LogIn\']">\n      <ion-item>\n        <ion-input (change)="onChange(\'old\')" [(ngModel)]="email" type="email" value="" placeholder="Email"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input (change)="onChange(\'old\')" [(ngModel)]="password"  type="password" value="" placeholder="Password"></ion-input>\n      </ion-item>\n      <ion-item>\n        <button ion-button (click)="logIn()">Ok</button>\n        <button ion-button (click)="makeVisible(\'Menu\')">Cancel</button>\n      </ion-item>\n      <ion-item color="danger" [hidden]="!showError">Invalid Credentials</ion-item>\n    </ion-list>\n    <ion-list ion-list [hidden]="invisibilityMap[\'CreateAccount\']">\n      <ion-item>\n        <ion-input  (change)="onChange(\'new\')" [(ngModel)]="newUsername"  type="text" value="" placeholder="User name"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input (change)="onChange(\'new\')" [(ngModel)]="newEmail" type="email" value="" placeholder="Email"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input (change)="onChange(\'new\')" [(ngModel)]="newPassword1"  type="password" value="" placeholder="Password"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input (change)="onChange(\'new\')" [(ngModel)]="newPassword2"  type="password" value="" placeholder="Re-enter password"></ion-input>\n      </ion-item>\n      <ion-item>\n        <button ion-button (click)="createAccount()">Ok</button>\n        <button ion-button (click)="makeVisible(\'Menu\')">Cancel</button>\n      </ion-item>\n    </ion-list>\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\login\login.html"*/
        }), 
        __metadata('design:paramtypes', [NavController, NavParams, ViewController])
    ], LoginPage);
    return LoginPage;
}());
//# sourceMappingURL=login.js.map