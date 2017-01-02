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
import { NavController, NavParams, ModalController } from 'ionic-angular';
export var MessagesPage = (function () {
    function MessagesPage(navCtrl, params, modalCrl) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.modalCrl = modalCrl;
        this.messages = [];
        this.messages = params.get('messages');
    }
    MessagesPage.createMessage = function (heading, body, type) {
        return new Message(heading, body, type.toString());
    };
    MessagesPage.prototype.onOk = function () {
        this.navCtrl.pop();
    };
    MessagesPage = __decorate([
        Component({
            selector: 'messages',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\messages\messages.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Messages</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n  <button ion-button (click)="onOk()" color="primary" small>\n    <ion-icon name="close"></ion-icon>\n  </button>\n  <ion-list>\n    <ion-item *ngFor="let m of messages">\n      <span [style.color]="m.type == \'Error\' ? \'danger\' : \'secondary\'">\n        {{ m.heading }}\n      </span>\n      <p>{{ m.body }}</p>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\messages\messages.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController, NavParams, ModalController])
    ], MessagesPage);
    return MessagesPage;
}());
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Error"] = 0] = "Error";
    MessageType[MessageType["Info"] = 1] = "Info";
})(MessageType || (MessageType = {}));
var Message = (function () {
    function Message(heading, body, type) {
        this.heading = heading;
        this.body = body;
        this.type = type;
    }
    return Message;
}());
//# sourceMappingURL=messages.js.map